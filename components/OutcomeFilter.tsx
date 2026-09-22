"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CallOutcome } from "@prisma/client";
import { OUTCOME_LABELS } from "@/lib/outcome";

const OUTCOME_OPTIONS = Object.values(CallOutcome);

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5.5 8 4.5 4.5L14.5 8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-indigo-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 10.5 4 4 8-9" />
    </svg>
  );
}

export function OutcomeFilter({ value }: { value: string }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function select(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) params.set("outcome", next);
    else params.delete("outcome");
    setOpen(false);
    router.push(params.size > 0 ? `/?${params.toString()}` : "/");
  }

  const isSingleKnownOutcome = OUTCOME_OPTIONS.includes(value as CallOutcome);
  const label = !value ? "All outcomes" : isSingleKnownOutcome ? OUTCOME_LABELS[value as CallOutcome] : "Multiple outcomes";

  return (
    <div className="relative" ref={containerRef}>
      <input type="hidden" name="outcome" value={value} />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 min-w-[190px] items-center justify-between gap-2.5 rounded-lg border border-white/10 bg-zinc-900/60 px-3.5 text-sm outline-none transition-all hover:border-white/20 focus-visible:border-indigo-400/60 focus-visible:ring-2 focus-visible:ring-indigo-400/20 active:scale-[0.98]"
      >
        <span className={value ? "text-zinc-100" : "text-zinc-500"}>{label}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="animate-fade-in absolute z-20 mt-1.5 w-60 overflow-hidden rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl shadow-black/50">
          <button
            type="button"
            onClick={() => select("")}
            className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none ${
              !value ? "bg-white/[0.04] text-zinc-100" : "text-zinc-300"
            }`}
          >
            All outcomes
            {!value && <CheckIcon />}
          </button>
          <div className="my-1 h-px bg-white/5" />
          {OUTCOME_OPTIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => select(o)}
              className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.06] focus-visible:bg-white/[0.06] focus-visible:outline-none ${
                value === o ? "bg-white/[0.04] text-zinc-100" : "text-zinc-300"
              }`}
            >
              {OUTCOME_LABELS[o]}
              {value === o && <CheckIcon />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
