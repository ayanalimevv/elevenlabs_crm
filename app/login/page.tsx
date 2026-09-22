export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const { from, error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <form
        action="/api/login"
        method="POST"
        className="w-full max-w-sm space-y-4 rounded-xl border border-neutral-800 bg-neutral-900 p-6"
      >
        <h1 className="text-lg font-semibold text-neutral-100">
          Reality Rift — Call Dashboard
        </h1>
        {error && <p className="text-sm text-red-400">Wrong password. Try again.</p>}
        <input type="hidden" name="from" value={from ?? "/"} />
        <div className="space-y-1">
          <label htmlFor="password" className="text-sm text-neutral-400">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 outline-none focus:border-neutral-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
