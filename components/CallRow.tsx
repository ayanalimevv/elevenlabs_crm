"use client";

import { useState } from "react";
import type { CallLog, Contact } from "@prisma/client";
import { OUTCOME_COLORS, OUTCOME_DOT, OUTCOME_LABELS } from "@/lib/outcome";

type CallWithContact = CallLog & { contact: Contact };

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function transcriptTurns(transcript: unknown): { role: string; message: string }[] {
  if (!Array.isArray(transcript)) return [];
  return transcript
    .filter(
      (t): t is { role: unknown; message: unknown } =>
        typeof t === "object" && t !== null && "role" in t && "message" in t,
    )
    .map((t) => ({ role: String(t.role), message: String(t.message ?? "") }))
    .filter((t) => t.message.trim().length > 0);
}

export function CallRow({ call }: { call: CallWithContact }) {
  const [open, setOpen] = useState(false);
  const turns = transcriptTurns(call.transcript);
  const isPlaceholderPhone = call.contact.phone.startsWith("unknown-");

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full flex-wrap items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400/40"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className={`h-4 w-4 shrink-0 text-zinc-600 transition-transform duration-150 ${open ? "rotate-90" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m7.5 4.5 5 5.5-5 5.5" />
        </svg>

        <span className="w-32 shrink-0 text-sm text-zinc-500">{formatDate(call.startedAt)}</span>

        <span className="min-w-[140px] flex-1 truncate text-sm font-medium text-zinc-100">
          {call.contact.firstName || "Unknown"}
          {call.contact.company && <span className="text-zinc-500"> · {call.contact.company}</span>}
        </span>

        <span className="w-32 shrink-0 truncate text-sm text-zinc-500">
          {isPlaceholderPhone ? "—" : call.contact.phone}
        </span>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${OUTCOME_COLORS[call.outcome]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${OUTCOME_DOT[call.outcome]}`} />
          {OUTCOME_LABELS[call.outcome]}
        </span>

        <span className="w-12 shrink-0 text-right font-mono text-sm text-zinc-500">
          {formatDuration(call.durationSeconds)}
        </span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-200 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="space-y-4 border-t border-white/5 bg-black/20 px-4 py-4 pl-11 text-sm">
            {call.summary && <p className="leading-relaxed text-zinc-300">{call.summary}</p>}

            {(call.capturedEmail || call.meetingTime) && (
              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {call.capturedEmail && (
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-zinc-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Zm0 0 7 5.5 7-5.5" />
                    </svg>
                    <span className="text-zinc-300">{call.capturedEmail}</span>
                  </div>
                )}
                {call.meetingTime && (
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 text-zinc-600">
                      <rect x="3" y="4" width="14" height="13" rx="2" />
                      <path strokeLinecap="round" d="M3 8h14M7 2v3m6-3v3" />
                    </svg>
                    <span className="text-zinc-300">{call.meetingTime}</span>
                  </div>
                )}
              </div>
            )}

            {turns.length > 0 && (
              <div className="max-h-80 space-y-2.5 overflow-y-auto border-t border-white/5 pt-4">
                {turns.map((t, i) => {
                  const isAgent = t.role === "agent";
                  return (
                    <div key={i} className={`flex ${isAgent ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[80%] rounded-xl px-3.5 py-2 text-sm leading-relaxed ${
                          isAgent
                            ? "rounded-tl-sm bg-white/5 text-zinc-300"
                            : "rounded-tr-sm bg-indigo-500/15 text-indigo-100"
                        }`}
                      >
                        <p className="mb-0.5 text-[11px] font-medium tracking-wide text-zinc-500 uppercase">
                          {isAgent ? "Aria" : call.contact.firstName || "Contact"}
                        </p>
                        {t.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
