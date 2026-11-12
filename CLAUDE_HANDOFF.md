# Remedy handoff for Claude

Take over the existing Remedy repo. Run it locally, review the merchant workspace
on desktop and mobile, and ship a small frontend polish pass. Reproduce and fix
any issues that could interrupt a judge's demo. Then produce the demo video and
prepare the Devpost entry for the owner. Report what you verified and what still
needs a manual check.

## Starting point

- Repo: [Namans12/remedy](https://github.com/Namans12/remedy). The last verified
  code baseline is commit `6f0e384`. Check `git status` and preserve any local
  work, including the existing untracked `.hallmark/` directory.
- Remedy lets a merchant review a synthetic customer message, see the evidence
  behind a Gemini suggestion, and explicitly approve a $24 partial refund for a
  $72 PayPal sandbox order. Policy preview uses sample data.
- The November 12 hosted test confirmed buyer approval, a completed $72 capture,
  a completed $24 refund, and that a repeat request returns the original refund.
  A fresh state request retained the completed refund. Hosted auth, cross-origin
  write rejection, Gemini review, and PostgreSQL persistence also passed.
- Hosted demo: [Render](https://remedy-oyr0.onrender.com/). Login username is
  `judge`. The owner can copy `DEMO_PASSWORD` from the Render service's
  Environment page. Use an isolated local environment for transaction testing so
  the shared hosted demo retains its recorded payment and refund.
- The last confirmed handoff left the public YouTube demo and Devpost submission
  pending. The owner may have completed them since. See the
  [recording guide](DEMO_RECORDING.md) and [submission draft](SUBMISSION_DRAFT.md).

## Run locally

Use Node.js 22 or newer. Read [AGENTS.md](AGENTS.md) and the relevant bundled
Next.js guides under `node_modules/next/dist/docs/` before editing. On a fresh
checkout run `npm ci` and copy `.env.example` to `.env` if no local file exists.
Reuse the configured sandbox and Gemini credentials when available. See the
[project README](README.md) for variable names and provider setup.

```sh
npm run check:env
npm run dev
```

Open `http://127.0.0.1:3000`. Local state uses SQLite. Render uses private
PostgreSQL. Keep credentials server-side and out of commits, screenshots, and
logs. Full checkout uses a separate US Personal sandbox buyer and US Business
sandbox seller with test funds. Use PayPal sandbox endpoints throughout.

## Small UI pass and issue review

1. Start in [the workspace](src/app/page.tsx) and [its styles](src/app/style.css).
   Preserve the warm palette and make a few targeted improvements to spacing,
   readable status labels, and button hierarchy. Keep the customer quote and
   suggested resolution easy to scan. On narrow screens, check that navigation,
   timeline, and payment actions fit without horizontal scrolling.
2. Reproduce the stale checkout path. During the prior test, PayPal stopped
   recognizing an old order and a fresh order was created through the API.
   Check whether a merchant can recover from that state through the UI. If the
   order is confirmed expired or unavailable, give them a clear way to start a
   new sandbox payment. For timeouts or uncertain responses, preserve the
   existing order and let the merchant recheck its status.
3. Check that keyboard navigation, visible focus, loading, errors, cancellation,
   and disabled-action explanations work in both the Resolution desk and Policy
   preview. Inspect at desktop width and about 390 px. Review whether the UI
   explains each next action using the current PayPal status.
4. Fix reproducible issues in the existing flow. Preserve explicit merchant
   refund approval, the fixed $24 amount, refund deduplication, literal AI
   evidence checking, and the distinction between sample policy data and
   transaction state. Keep unresolved payment outcomes available for
   reconciliation before any retry. Use
   [the system design](Remedy%20System%20Design.docx) for architecture context.

## Verify and hand back

- Run `npm run build` and `npm run typecheck`. With the local development server
  running, run `npm run check:api` for the existing non-transactional API checks.
- Exercise AI review, policy controls, checkout cancellation and recovery, and
  refresh after a payment status change. If you change the payment flow, check
  sandbox buyer approval, capture, refund, and duplicate protection using a
  separate test order. Report any check that needs the owner to sign in.
- Summarize the UI edits, bugs fixed, and checks run. Keep the Render deployment
  and existing spend configuration out of this polish pass. The current base
  hosting estimate is $13.30/month and the owner's credit budget is $50 total.

## Produce the demo video and prepare Devpost

1. Ask the owner whether a video or entry already exists if its status is unclear.
   Use the [recording guide](DEMO_RECORDING.md) to produce a local MP4 under three
   minutes from the verified app. Show the customer message, Gemini's quoted
   evidence, the sample policy preview, and the actual PayPal sandbox capture
   and $24 refund. Use a separate sandbox order for fresh footage. Cut sign-in
   screens and check the final export for readable text, clear audio, and
   visible secrets or personal information before handing it back.
2. If screen recording tools or buyer sign-in require the owner, prepare the
   app and shot list and specify exactly which clip or action you need. Resume
   editing once the footage is available. Deliver the finished file path and
   duration.
3. Prepare a reviewable Devpost entry using the
   [submission draft](SUBMISSION_DRAFT.md). Include the public repo, hosted demo,
   testing instructions for the `judge` login, and the public YouTube link once
   available. Verify the current [official rules](https://paypalaihackathon.devpost.com/rules)
   and submission status. Hand the owner the public upload and final submission
   steps if they require account access or approval.
