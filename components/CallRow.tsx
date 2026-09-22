"use client";

import { useState } from "react";
import type { CallLog, Contact } from "@prisma/client";
import { OUTCOME_COLORS, OUTCOME_LABELS } from "@/lib/outcome";

type CallWithContact = CallLog & { contact: Contact };

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function transcriptTurns(transcript: unknown): { role: string; message: string }[] {
  if (!Array.isArray(transcript)) return [];
  return transcript
    .filter(
      (t): t is { role: unknown; message: unknown } =>
        typeof t === "object" && t !== null && "role" in t && "message" in t,
    )
    .map((t) => ({ role: String(t.role), message: String(t.message ?? "") }));
}

export function CallRow({ call }: { call: CallWithContact }) {
  const [open, setOpen] = useState(false);
  const turns = transcriptTurns(call.transcript);

  return (
    <div className="p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-wrap items-center gap-4 text-left"
      >
        <span className="w-36 shrink-0 text-sm text-neutral-500">
          {call.startedAt ? new Date(call.startedAt).toLocaleString() : "—"}
        </span>
        <span className="min-w-[140px] flex-1 text-sm font-medium text-neutral-100">
          {call.contact.firstName ?? "Unknown"}
          {call.contact.company ? ` · ${call.contact.company}` : ""}
        </span>
        <span className="w-36 shrink-0 text-sm text-neutral-400">{call.contact.phone}</span>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${OUTCOME_COLORS[call.outcome]}`}
        >
          {OUTCOME_LABELS[call.outcome]}
        </span>
        <span className="w-14 shrink-0 text-right text-sm text-neutral-500">
          {formatDuration(call.durationSeconds)}
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 text-sm">
          {call.summary && (
            <p className="text-neutral-300">
              <span className="text-neutral-500">Summary: </span>
              {call.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-6 text-neutral-400">
            {call.capturedEmail && (
              <p>
                <span className="text-neutral-500">Email: </span>
                {call.capturedEmail}
              </p>
            )}
            {call.meetingTime && (
              <p>
                <span className="text-neutral-500">Meeting time: </span>
                {call.meetingTime}
              </p>
            )}
          </div>
          {turns.length > 0 && (
            <div className="max-h-80 space-y-2 overflow-y-auto border-t border-neutral-800 pt-3">
              {turns.map((t, i) => (
                <p key={i} className="text-neutral-300">
                  <span className="font-medium text-neutral-500">
                    {t.role === "agent" ? "Aria" : "Contact"}:{" "}
                  </span>
                  {t.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
