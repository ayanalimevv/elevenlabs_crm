// Deep import: the top-level ElevenLabsClient eagerly requires an API key
// at construction time, but webhook signature verification needs none —
// going through it would make this module crash on load if
// ELEVENLABS_API_KEY were ever unset, for a check it doesn't even use.
import { WebhooksClient } from "@elevenlabs/elevenlabs-js/wrapper/webhooks";
import { CallOutcome } from "@prisma/client";

const webhooks = new WebhooksClient({});

const VALID_OUTCOMES = new Set<string>(Object.values(CallOutcome));

/**
 * Verifies the `elevenlabs-signature` header (t=.../v0=... HMAC-SHA256,
 * 30-minute tolerance) and parses the raw body. Throws on a bad/missing
 * signature — callers should treat that as a 400/401 response.
 */
export async function verifyWebhook(rawBody: string, sigHeader: string | null) {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("ELEVENLABS_WEBHOOK_SECRET is not set");
  }
  return webhooks.constructEvent(rawBody, sigHeader ?? "", secret);
}

export interface ParsedWebhookCall {
  contact: {
    phone: string;
    firstName?: string;
    company?: string;
    industry?: string;
    painPoint?: string;
    buildIdea?: string;
  };
  call: {
    conversationId: string;
    startedAt?: Date;
    durationSeconds?: number;
    callStatus?: string;
    outcome: CallOutcome;
    capturedEmail?: string;
    meetingTime?: string;
    summary?: string;
    transcript?: unknown;
    successEvaluation?: boolean;
    rawPayload: unknown;
  };
}

/**
 * `data_collection_results` entries come back from ElevenLabs as either a
 * bare scalar or `{ value, rationale, ... }` depending on field type —
 * unwrap defensively rather than trusting one shape.
 */
function extractValue(entry: unknown): string | undefined {
  if (entry == null) return undefined;
  if (typeof entry === "string" || typeof entry === "number") return String(entry);
  if (typeof entry === "object" && "value" in entry) {
    const v = (entry as { value: unknown }).value;
    return v == null ? undefined : String(v);
  }
  return undefined;
}

/**
 * Returns null for webhook events we don't care about (e.g. post_call_audio),
 * so the route handler can 200-and-ignore them.
 */
export function parseWebhookEvent(event: unknown): ParsedWebhookCall | null {
  if (typeof event !== "object" || event === null) return null;
  const envelope = event as { type?: string; data?: Record<string, unknown> };
  if (envelope.type !== "post_call_transcription" || !envelope.data) return null;

  const data = envelope.data;
  const metadata = (data.metadata ?? {}) as Record<string, unknown>;
  const analysis = (data.analysis ?? {}) as Record<string, unknown>;
  const initData = (data.conversation_initiation_client_data ?? {}) as Record<string, unknown>;
  const dynamicVars = (initData.dynamic_variables ?? {}) as Record<string, unknown>;
  const dataCollection = (analysis.data_collection_results ?? {}) as Record<string, unknown>;

  const conversationId = String(data.conversation_id ?? "");
  if (!conversationId) return null;

  // system__called_number is the destination number ElevenLabs auto-injects
  // for outbound calls; fall back to a manually-set phone_number variable,
  // and finally to a synthetic key so we never fail the unique constraint.
  const phone =
    (dynamicVars.system__called_number as string | undefined) ??
    (dynamicVars.phone_number as string | undefined) ??
    `unknown-${conversationId}`;

  const startedAtSecs = metadata.start_time_unix_secs;
  const startedAt =
    typeof startedAtSecs === "number" ? new Date(startedAtSecs * 1000) : undefined;

  const durationSeconds =
    typeof metadata.call_duration_secs === "number" ? metadata.call_duration_secs : undefined;

  const callSuccessful = analysis.call_successful;
  const successEvaluation =
    callSuccessful === "success" ? true : callSuccessful === "failure" ? false : undefined;

  const rawOutcome = extractValue(dataCollection.outcome);
  const outcome =
    rawOutcome && VALID_OUTCOMES.has(rawOutcome) ? (rawOutcome as CallOutcome) : CallOutcome.UNKNOWN;

  return {
    contact: {
      phone,
      firstName: dynamicVars.firstName as string | undefined,
      company: dynamicVars.company as string | undefined,
      industry: dynamicVars.industry as string | undefined,
      painPoint: dynamicVars.painPoint as string | undefined,
      buildIdea: dynamicVars.buildIdea as string | undefined,
    },
    call: {
      conversationId,
      startedAt,
      durationSeconds,
      callStatus: typeof data.status === "string" ? data.status : undefined,
      outcome,
      capturedEmail: extractValue(dataCollection.captured_email),
      meetingTime: extractValue(dataCollection.meeting_time),
      summary: typeof analysis.transcript_summary === "string" ? analysis.transcript_summary : undefined,
      transcript: data.transcript,
      successEvaluation,
      rawPayload: event,
    },
  };
}
