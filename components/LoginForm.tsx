"use client";

import { useState } from "react";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 10s2.7-5.5 8-5.5S18 10 18 10s-2.7 5.5-8 5.5S2 10 2 10Z" />
        <circle cx="10" cy="10" r="2.25" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2 10s2.7-5.5 8-5.5S18 10 18 10s-2.7 5.5-8 5.5S2 10 2 10Z" />
      <circle cx="10" cy="10" r="2.25" />
      <path strokeLinecap="round" d="m3 3 14 14" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 animate-spin">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" opacity="0.25" />
      <path d="M18 10a8 8 0 0 0-8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LoginForm({ from, error }: { from: string; error: boolean }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      action="/api/login"
      method="POST"
      onSubmit={() => setSubmitting(true)}
      className="relative w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm"
    >
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 ring-1 ring-inset ring-indigo-500/30">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 text-indigo-300"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5.5A2.5 2.5 0 0 1 5.5 3h1.379a1 1 0 0 1 .928.629l1.443 3.607a1 1 0 0 1-.29 1.128l-1.65 1.402a12.035 12.035 0 0 0 5.923 5.923l1.402-1.65a1 1 0 0 1 1.128-.29l3.607 1.443a1 1 0 0 1 .629.928V19.5a2.5 2.5 0 0 1-2.5 2.5h-.5C9.492 22 2 14.508 2 5.5V5.5"
            />
          </svg>
        </div>
        <h1 className="text-lg font-semibold text-zinc-50">Call Dashboard</h1>
        <p className="text-sm text-zinc-500">Reality Rift — outbound agent results</p>
      </div>

      {error && (
        <div className="animate-fade-in flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-inset ring-red-500/25">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0">
            <path
              fillRule="evenodd"
              d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0Zm-7-4a1 1 0 1 0-2 0v4a1 1 0 0 0 2 0V6Zm-1 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"
              clipRule="evenodd"
            />
          </svg>
          Wrong password. Try again.
        </div>
      )}

      <input type="hidden" name="from" value={from} />

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-300">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoFocus
            placeholder="••••••••"
            className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3.5 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors hover:border-white/20 focus:border-indigo-400/60 focus-visible:ring-2 focus-visible:ring-indigo-400/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-zinc-300 focus-visible:text-zinc-200 focus-visible:outline-none"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/50 transition-all hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-400/50 focus-visible:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:active:scale-100"
      >
        {submitting && <SpinnerIcon />}
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
