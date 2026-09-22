export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(99,102,241,0.16), transparent)",
        }}
      />

      <form
        action="/api/login"
        method="POST"
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

        <input type="hidden" name="from" value={from ?? "/"} />

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-zinc-300">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            placeholder="••••••••"
            className="w-full rounded-lg border border-white/10 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-500 px-3.5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-950/50 transition-colors hover:bg-indigo-400 active:bg-indigo-600"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
