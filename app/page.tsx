import { CallOutcome, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { OUTCOME_LABELS } from "@/lib/outcome";
import { CallRow } from "@/components/CallRow";

const OUTCOME_OPTIONS = Object.values(CallOutcome);

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ outcome?: string; q?: string }>;
}) {
  const { outcome, q } = await searchParams;

  const where: Prisma.CallLogWhereInput = {};
  if (outcome && OUTCOME_OPTIONS.includes(outcome as CallOutcome)) {
    where.outcome = outcome as CallOutcome;
  }
  if (q) {
    where.contact = {
      OR: [
        { firstName: { contains: q, mode: "insensitive" } },
        { company: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    };
  }

  const calls = await db.callLog.findMany({
    where,
    include: { contact: true },
    orderBy: { startedAt: "desc" },
    take: 200,
  });

  return (
    <div className="min-h-screen bg-neutral-950 px-6 py-8 text-neutral-100">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Reality Rift — Call Dashboard</h1>
          <form action="/api/logout" method="POST">
            <button className="text-sm text-neutral-400 hover:text-neutral-200">Sign out</button>
          </form>
        </div>

        <form method="GET" className="flex flex-wrap gap-3">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search name, company, phone..."
            className="min-w-[200px] flex-1 rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          />
          <select
            name="outcome"
            defaultValue={outcome ?? ""}
            className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-neutral-600"
          >
            <option value="">All outcomes</option>
            {OUTCOME_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {OUTCOME_LABELS[o]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white"
          >
            Filter
          </button>
        </form>

        <div className="overflow-hidden rounded-xl border border-neutral-800">
          {calls.length === 0 ? (
            <p className="p-6 text-sm text-neutral-500">No calls yet.</p>
          ) : (
            <div className="divide-y divide-neutral-800">
              {calls.map((call) => (
                <CallRow key={call.id} call={call} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
