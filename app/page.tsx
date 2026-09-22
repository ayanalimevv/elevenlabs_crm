import Link from "next/link";
import { CallOutcome, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { CallRow } from "@/components/CallRow";
import { OutcomeFilter } from "@/components/OutcomeFilter";

const OUTCOME_OPTIONS = Object.values(CallOutcome);

const MEETING_OUTCOMES: CallOutcome[] = [
  CallOutcome.MEETING_BOOKED_LIVE,
  CallOutcome.MEETING_BOOKED_EMAIL,
];

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-zinc-500" stroke="currentColor" strokeWidth="1.75">
      <circle cx="9" cy="9" r="6" />
      <path strokeLinecap="round" d="m17 17-4.35-4.35" />
    </svg>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-zinc-900/50 px-4 py-3.5">
      <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold tabular-nums ${accent ?? "text-zinc-100"}`}>{value}</p>
    </div>
  );
}

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

  const [calls, outcomeCounts] = await Promise.all([
    db.callLog.findMany({
      where,
      include: { contact: true },
      orderBy: { startedAt: "desc" },
      take: 200,
    }),
    db.callLog.groupBy({ by: ["outcome"], where, _count: true }),
  ]);

  const countFor = (outcomes: CallOutcome[]) =>
    outcomeCounts
      .filter((row) => outcomes.includes(row.outcome))
      .reduce((sum, row) => sum + row._count, 0);

  const total = outcomeCounts.reduce((sum, row) => sum + row._count, 0);
  const meetingsBooked = countFor(MEETING_OUTCOMES);
  const interested = countFor([CallOutcome.INTERESTED_INFO_SENT]);
  const notInterested = countFor([CallOutcome.NOT_INTERESTED]);

  return (
    <div className="min-h-screen bg-zinc-950 px-6 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 ring-1 ring-inset ring-indigo-500/30">
              <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5 text-indigo-300" stroke="currentColor" strokeWidth="1.75">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5.5A2.5 2.5 0 0 1 5.5 3h1.379a1 1 0 0 1 .928.629l1.443 3.607a1 1 0 0 1-.29 1.128l-1.65 1.402a12.035 12.035 0 0 0 5.923 5.923l1.402-1.65a1 1 0 0 1 1.128-.29l3.607 1.443a1 1 0 0 1 .629.928V19.5a2.5 2.5 0 0 1-2.5 2.5h-.5C9.492 22 2 14.508 2 5.5V5.5"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-zinc-50">Call Dashboard</h1>
              <p className="text-sm text-zinc-500">Reality Rift — outbound agent results</p>
            </div>
          </div>
          <form action="/api/logout" method="POST">
            <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-200">
              Sign out
              <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 15.5 17.5 11m0 0L13 6.5m4.5 4.5h-11M9 15.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5" />
              </svg>
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total calls" value={total} />
          <StatCard label="Meetings booked" value={meetingsBooked} accent="text-emerald-300" />
          <StatCard label="Interested" value={interested} accent="text-sky-300" />
          <StatCard label="Not interested" value={notInterested} accent="text-zinc-400" />
        </div>

        <form method="GET" className="flex flex-wrap gap-3">
          <div className="relative min-w-[220px] flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <SearchIcon />
            </div>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search name, company, phone..."
              className="h-10 w-full rounded-lg border border-white/10 bg-zinc-900/60 pr-3 pl-9 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-colors focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-400/20"
            />
          </div>

          <OutcomeFilter value={outcome ?? ""} />

          <button
            type="submit"
            className="h-10 rounded-lg bg-indigo-500 px-5 text-sm font-medium text-white shadow-md shadow-indigo-950/40 transition-colors hover:bg-indigo-400 active:bg-indigo-600"
          >
            Filter
          </button>
          {(q || outcome) && (
            <Link
              href="/"
              className="flex h-10 items-center rounded-lg px-3 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Clear
            </Link>
          )}
        </form>

        <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/30">
          {calls.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-zinc-500" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5A2.5 2.5 0 0 1 5.5 3h1.379a1 1 0 0 1 .928.629l1.443 3.607a1 1 0 0 1-.29 1.128l-1.65 1.402a12.035 12.035 0 0 0 5.923 5.923l1.402-1.65a1 1 0 0 1 1.128-.29l3.607 1.443a1 1 0 0 1 .629.928V19.5a2.5 2.5 0 0 1-2.5 2.5h-.5C9.492 22 2 14.508 2 5.5V5.5" />
                </svg>
              </div>
              <p className="text-sm font-medium text-zinc-300">
                {q || outcome ? "No calls match your filters" : "No calls yet"}
              </p>
              <p className="max-w-xs text-sm text-zinc-500">
                {q || outcome
                  ? "Try clearing the search or outcome filter."
                  : "Calls will show up here automatically once Aria starts dialing."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
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
