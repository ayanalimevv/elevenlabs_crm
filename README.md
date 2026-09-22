# Reality Rift — Call Dashboard

Internal dashboard that logs the results of every outbound call the "Aria" ElevenLabs
agent makes: contact info, outcome, transcript, and captured meeting/email details.

This is a **logging-only** tool (v1). Calls are still placed through ElevenLabs directly
(dashboard/batch calling) — this app just receives ElevenLabs' post-call webhook, stores
it in Postgres, and shows it in a filterable table behind a single-password login.

## How it works

ElevenLabs POSTs to `/api/webhook/elevenlabs` after every call finishes
(`post_call_transcription` event), signed with an HMAC secret. We verify the signature,
then read the structured `outcome` / `captured_email` / `meeting_time` fields ElevenLabs'
own **Data Collection** feature extracts from the transcript (configured on the agent, not
in this repo — see below), and store a `Contact` + `CallLog` row. The full raw payload is
always kept in `CallLog.rawPayload` as a safety net.

## Local development

```bash
npm install
npx prisma generate
npm run dev
```

Copy `.env.example` to `.env` and fill in real values (a placeholder `DATABASE_URL`
pointing at a Postgres you don't have will make the dashboard/webhook routes 500 with
`ECONNREFUSED` — that's expected until a real database is wired up; auth and routing work
without one).

## One-time setup (outside this repo)

1. **Database**: provision Postgres (Vercel Storage → Postgres/Neon), set `DATABASE_URL`,
   then run `npx prisma migrate deploy` (or `npx prisma migrate dev` locally).
2. **ElevenLabs agent → Data Collection**: on the agent's settings, add these data points
   (`Add data point` panel):
   - `outcome` — type **String**, Enum Values set to exactly:
     `MEETING_BOOKED_LIVE`, `MEETING_BOOKED_EMAIL`, `INTERESTED_INFO_SENT`,
     `NOT_INTERESTED`, `VOICEMAIL`, `NO_ANSWER_FAILED`. Description: tell the LLM to pick
     the value matching how the call ended, based on the agent's own script branches
     (meeting booked live vs. by email, said they're interested but wanted info sent,
     said not interested, went to voicemail, or never answered/call failed).
   - `captured_email` — type **String**, no enum. Description: the email address the
     contact gave for the calendar invite or follow-up info, if any.
   - `meeting_time` — type **String**, no enum. Description: the day/time the contact
     agreed to for the discovery call, if a live meeting was booked.
3. **ElevenLabs agent → Post-Call Webhook**: set the URL to
   `https://<deployed-domain>/api/webhook/elevenlabs`, copy the signing secret into
   `ELEVENLABS_WEBHOOK_SECRET`.
4. Set `DASHBOARD_PASSWORD` (the shared login password) and `SESSION_SECRET` (random
   string, e.g. `openssl rand -hex 32`).
5. Deploy to Vercel with those env vars set.

## Stack

Next.js (App Router) + Prisma/Postgres, deployed on Vercel. See `prisma/schema.prisma`
for the `Contact`/`CallLog` models and the `CallOutcome` enum.
