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
  MEETING_BOOKED_LIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  MEETING_BOOKED_EMAIL: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  INTERESTED_INFO_SENT: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  NOT_INTERESTED: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
  VOICEMAIL: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  NO_ANSWER_FAILED: "bg-red-500/15 text-red-400 border-red-500/30",
  UNKNOWN: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
};
