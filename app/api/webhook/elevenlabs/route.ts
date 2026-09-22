import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { parseWebhookEvent, verifyWebhook } from "@/lib/elevenlabs-webhook";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("elevenlabs-signature");

  let event: unknown;
  try {
    event = await verifyWebhook(rawBody, sigHeader);
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const parsed = parseWebhookEvent(event);
  if (!parsed) {
    // Not a post_call_transcription event (e.g. post_call_audio) — ack and ignore.
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    const contact = await db.contact.upsert({
      where: { phone: parsed.contact.phone },
      update: parsed.contact,
      create: parsed.contact,
    });

    const callData = {
      startedAt: parsed.call.startedAt,
      durationSeconds: parsed.call.durationSeconds,
      callStatus: parsed.call.callStatus,
      outcome: parsed.call.outcome,
      capturedEmail: parsed.call.capturedEmail,
      meetingTime: parsed.call.meetingTime,
      summary: parsed.call.summary,
      transcript: parsed.call.transcript as Prisma.InputJsonValue | undefined,
      successEvaluation: parsed.call.successEvaluation,
      rawPayload: parsed.call.rawPayload as Prisma.InputJsonValue,
    };

    await db.callLog.upsert({
      where: { conversationId: parsed.call.conversationId },
      update: callData,
      create: {
        contactId: contact.id,
        conversationId: parsed.call.conversationId,
        ...callData,
      },
    });
  } catch (err) {
    console.error("Failed to persist ElevenLabs webhook", err);
    return NextResponse.json({ error: "internal error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
