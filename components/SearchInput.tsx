"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-zinc-500" stroke="currentColor" strokeWidth="1.75">
      <circle cx="9" cy="9" r="6" />
      <path strokeLinecap="round" d="m17 17-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

export function SearchInput({ defaultValue }: { defaultValue: string }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();
  const searchParams = useSearchParams();

  function clear() {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(params.size > 0 ? `/?${params.toString()}` : "/");
  }

  return (
    <div className="relative min-w-[220px] flex-1">
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
        <SearchIcon />
      </div>
      <input
        type="text"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search name, company, phone..."
        className="h-10 w-full rounded-lg border border-white/10 bg-zinc-900/60 pr-9 pl-9 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors hover:border-white/20 focus:border-indigo-400/60 focus-visible:ring-2 focus-visible:ring-indigo-400/20"
      />
      {value && (
        <button
          type="button"
          onClick={clear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-2.5 flex items-center text-zinc-500 transition-colors hover:text-zinc-200 focus-visible:text-zinc-200 focus-visible:outline-none"
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}
