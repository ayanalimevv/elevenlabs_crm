import { CallOutcome } from "@prisma/client";

export const OUTCOME_LABELS: Record<CallOutcome, string> = {
  MEETING_BOOKED_LIVE: "Meeting booked (live)",
  MEETING_BOOKED_EMAIL: "Meeting booked (email)",
  INTERESTED_INFO_SENT: "Interested – info sent",
  NOT_INTERESTED: "Not interested",
  VOICEMAIL: "Voicemail left",
  NO_ANSWER_FAILED: "No answer / failed",
  UNKNOWN: "Unknown",
};

export const OUTCOME_COLORS: Record<CallOutcome, string> = {
  MEETING_BOOKED_LIVE: "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/25",
  MEETING_BOOKED_EMAIL: "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20",
  INTERESTED_INFO_SENT: "bg-sky-500/10 text-sky-300 ring-1 ring-inset ring-sky-500/25",
  NOT_INTERESTED: "bg-white/5 text-zinc-400 ring-1 ring-inset ring-white/10",
  VOICEMAIL: "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/25",
  NO_ANSWER_FAILED: "bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/25",
  UNKNOWN: "bg-white/5 text-zinc-500 ring-1 ring-inset ring-white/10",
};

export const OUTCOME_DOT: Record<CallOutcome, string> = {
  MEETING_BOOKED_LIVE: "bg-emerald-400",
  MEETING_BOOKED_EMAIL: "bg-emerald-400",
  INTERESTED_INFO_SENT: "bg-sky-400",
  NOT_INTERESTED: "bg-zinc-500",
  VOICEMAIL: "bg-amber-400",
  NO_ANSWER_FAILED: "bg-red-400",
  UNKNOWN: "bg-zinc-600",
};
