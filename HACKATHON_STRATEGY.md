# PayPal AI Hackathon: revised competition strategy

Research date: November 10, 2026. Recommendation, not an approved product choice or a tested implementation. User confirms no existing implementation, solo participation with substantial time available, and no working PayPal sandbox or AI API access yet. Account access is the first dependency.

## Decision

Build **Remedy** (working name): an evidence-linked resolution workbench for small PayPal merchants. A customer reports an order problem; AI assembles the relevant facts and proposes a remedy; deterministic policy checks and merchant approval control execution; PayPal performs the refund and supplies the payment record.

The signature feature is **policy rehearsal**: a merchant can preview how a different refund limit changes recommendations across sample cases, without moving funds. A preview can never authorize execution. This makes judgment and control visible in the product and video.

This is a stronger competition hypothesis than the original message-to-invoice idea because it can demonstrate evidence interpretation, financial state, exception handling, and a coherent business workflow. It is not evidence of better odds of winning. Build quality and judges' preferences remain unknown.

## Alternatives considered

| Concept | Strongest quality | Decisive concern | Decision |
|---|---|---|---|
| Message-to-invoice assistant | Fast, coherent workflow | Limited distinction from existing invoicing tools | Fallback if already substantially built |
| Evidence-linked resolution workbench | AI reasoning plus actual financial action and policy rehearsal | Existing customer-support competition | Recommended with narrow differentiation |
| Freelancer proof-of-delivery payment release | Memorable conditional payment story | Subjective work acceptance and authorization timing | Avoid long milestone/escrow promises |
| Shopping agent with spending controls | Strong agentic commerce narrative | Product discovery does not grant checkout rights at external merchants | Only viable with a clearly controlled sandbox storefront |
| Gig-worker instant payouts | Direct impact story | Extra account and funding dependencies | Too many unverified dependencies for current window |

Gorgias already documents support agents handling returns and order actions. Therefore do not claim AI returns automation is novel. Proposed differentiation is the combination of visible evidence, versioned merchant rules, policy rehearsal, and explicit PayPal transaction reconciliation. This combination still needs user validation; this research was not an exhaustive competitive landscape review. [Gorgias documentation](https://docs.gorgias.com/en-US/ai-agent-explained-497772)

## Demonstration story

Use a fictional small ceramics merchant. An order contains three mugs at $24 each; no taxes, discounts, or shipping in the first demo. The buyer paid $72 through sandbox checkout. They report one chipped mug and attach a sample photo with clear demo provenance.

1. Open the order's resolution case.
2. AI extracts the reported problem and connects it to a specific line item. A photo can support a visual observation; it cannot establish provenance, fault, or authenticity.
3. The workbench displays the customer statement, order line, and applicable policy beside the proposed $24 refund.
4. If the image or item is ambiguous, request clarification. Do not assert damage is independently verified.
5. Preview a lower merchant approval limit across a small fixture set. Cases move from eligible recommendations to review-required. No money moves.
6. Return to the active policy. The merchant approves the exact $24 resolution.
7. The backend refunds the original capture. Show the real sandbox refund ID and actual status.
8. Retry the same action: no additional refund is created. Demonstrate the existing record.

Customer benefit: understandable resolution and visible payment status. Merchant benefit: less context switching and a reviewable explanation. These are hypotheses until measured.

## Scope

Required: one sandbox merchant; USD; authenticated merchant session; linked order and case; editable customer message; one optional image; structured AI recommendation; evidence pointers; structured merchant policy; explicit approval; real partial refund; status reconciliation; audit trail; judge reset instructions; usable public repository and video.

Signature addition: policy rehearsal across 6–10 clearly labeled synthetic cases. Reuse the same policy evaluator as the live flow. Never present synthetic case results as customer outcomes.

Cut first if behind: image input, charts, alternate remedies, extra sponsor integrations. Keep textual evidence and real refund working. Do not cut the actual payment operation, approval, error states, or submission packaging.

Out of scope: formal PayPal dispute adjudication, marketplace onboarding, production refunds, autonomous damage verification, exchanges requiring logistics, multiple currencies, browser purchasing, accounting sync, email ingestion, multi-agent roleplay.

## Architecture and invariants

Suggested implementation: TypeScript web app, server routes, persistent SQL database, one model API, direct PayPal REST integration, ordinary hosted HTTPS service. Select exact packages and hosting after checking available accounts.

Flow: customer evidence → AI proposal → schema validation → policy checks → merchant approval → execution checks → PayPal refund → stored result/reconciliation.

AI returns issue category, item references, evidence references, uncertainty, and a proposed remedy. The server calculates the permitted amount from trusted order data. Store money as integer minor units internally and serialize decimal strings at the PayPal boundary.

Policy is structured and merchant-controlled: version, supported reason codes, time window, refund limit, required approval, and required evidence. Human-readable policy text is generated from this same configuration. Do not rely on an LLM to enforce spending limits.

Approval binds case, capture, amount, currency, evidence version, and policy version. Any material change invalidates approval. Before execution, re-check capture ownership, current financial state, pending actions, cumulative refunds, and policy validity. Serialize local execution for each capture; document that external dashboard actions can race, and treat PayPal's response as authoritative.

Suggested records: Order, OrderItem, Case, Evidence, PolicyVersion, Proposal, Approval, PaymentAction, WebhookEvent. Unique constraints on action keys and webhook event IDs. Customer uploads and messages are data, not instructions to invoke payment tools.

PaymentAction states: approved, executing, pending, completed, failed, unknown. A timeout means unknown until reconciled; it does not justify a new refund with a new key. A pending refund must reserve the amount in our local ledger. Never report a pending refund as completed.

## Documentation-backed integration map

| Need | Operation | Implementation implication |
|---|---|---|
| Create a reproducible purchase | Orders v2 create, buyer approval, capture | Persist order ID and capture ID; approval alone is not payment completion |
| Confirm the captured payment | GET /v2/payments/captures/{capture_id} | Check merchant-owned transaction and status |
| Refund one item | POST /v2/payments/captures/{capture_id}/refund | Supply explicit amount and currency; retain refund ID |
| Resolve uncertain status | GET /v2/payments/refunds/{refund_id} | Use actual refund state rather than UI optimism |
| Receive later changes | Capture/refund webhooks | Verify sender; deduplicate events; reconcile resource state |

Orders operations are documented in [Orders v2](https://developer.paypal.com/api/orders/v2). Standard checkout SDK setup is documented in [JavaScript SDK v6](https://developer.paypal.com/sdk/js/set-up); use the sandbox SDK URL. The public client ID can be in the browser, but the secret belongs only on the server.

The [refund endpoint](https://developer.paypal.com/api/payments/v2/captures-refund) supports full and partial refunds and PayPal-Request-Id. Use a stable UUID for retries of the same logical action, plus local uniqueness/locking. The [idempotency guide](https://developer.paypal.com/api/rest/reference/idempotency/) notes retention is bounded and concurrent duplicate requests can fail; the header is not a permanent exactly-once guarantee.

[Webhook guidance](https://developer.paypal.com/api/rest/webhooks/) requires message verification. Subscriptions are app-specific. Handle capture completed/refunded and refund pending/failed as documented in [event names](https://developer.paypal.com/api/rest/webhooks/event-names/). Avoid assuming a PAYMENT.REFUND.COMPLETED event exists. Fetch refund details where needed.

These are documented capabilities, not tested account access. First verify OAuth, a real sandbox purchase/capture, a $24 refund, retry behavior, and status retrieval. No working capture means no working refund demonstration.

## Why some attractive ideas are risky

PayPal authorization is time-limited; [authorization documentation](https://developer.paypal.com/payment-methods/auth-honor/) describes a 29-day window and a three-day honor period. It is not an indefinite escrow mechanism. Reauthorization details vary across documentation, so we should not base the current project on an untested long-duration flow.

[Payouts documentation](https://developer.paypal.com/payouts/use-payouts/overview) distinguishes production access approval from sandbox testing and lists balance requirements. Payouts is feasible to explore in sandbox but is not necessary for the proposed merchant refund workflow.

[Channel3's event page](https://paypalaihackathon.devpost.com/details/channel3) describes product discovery, availability, and buy links. That does not establish permission or capability to complete PayPal checkout for arbitrary listed retailers. A shopping demo must make its merchant/payment boundaries explicit.

## Sponsor strategy

Use one sponsor because it strengthens the finished product; do not optimize for tool count. The [FAQ](https://paypalaihackathon.devpost.com/details/faqs) says multiple sponsor tools can be used, but a project can win at most one sponsor prize alongside one grand prize or honorable mention.

- **AG Grid:** Potential fit for the resolution queue and policy-rehearsal view. The [event guidance](https://paypalaihackathon.devpost.com/details/aggrid) emphasizes Studio, custom widgets, theming, and agent interaction. A plain table is weak award positioning. The page offers a 45-day trial and starter. Verify the actual license expiry covers December 21 and how licensed dependencies are installed from the public repo.
- **APIMatic:** Low product-scope overhead if its context plugin is actually used during PayPal development. Record concrete use and accurate feedback; do not claim integration based on reading its page. [Event page](https://paypalaihackathon.devpost.com/details/apimatic).
- **Render:** Natural hosting option if available. Check credit and service lifetime through the judging period. [Event page](https://paypalaihackathon.devpost.com/details/render).
- **Bryntum:** Stronger for scheduling than this workflow; do not add a calendar just to qualify. [Event page](https://paypalaihackathon.devpost.com/details/bryntum).
- **Elastic:** Useful for larger policy/evidence corpora; a tiny fixed merchant policy does not need a search cluster. [Event page](https://paypalaihackathon.devpost.com/details/elastic).
- **Astropods:** Agent hosting/observability option, but another runtime to learn. [Event page](https://paypalaihackathon.devpost.com/details/astropods).
- **KERNEL:** Browser automation is unnecessary for our API-based workflow. [Event page](https://paypalaihackathon.devpost.com/details/kernel).
- **Postman:** Useful for repeatable API checks and a collection shared with judges. [Event page](https://paypalaihackathon.devpost.com/details/postman).
- **Zapier:** Optional workflow connectivity; unnecessary for the core demo. Check trial duration if adopted. [Event page](https://paypalaihackathon.devpost.com/details/zapier).
- **Channel3:** Better suited to the shopping alternative. See the capability caveat above.

## Evidence that could improve judging

Use the five equally weighted judging dimensions as a build checklist. [Official rules](https://paypalaihackathon.devpost.com/rules).

| Dimension | Evidence we should produce |
|---|---|
| Technical implementation | Actual capture and refund IDs; verified state; repeat-action test; visible handling of failure |
| Design | A legible order/evidence/decision workspace; useful pending and empty states; keyboard-friendly review |
| Potential impact | Two short merchant interviews if reachable; measured task time; specific limits on findings |
| Innovation | Policy rehearsal connected to the same rules used for execution; evidence-linked financial decisions |
| Presentation | One complete customer problem resolved in under three minutes |

Evaluation fixture set: 20 cases spanning clear eligible claims, ambiguous items, missing facts, policy-window failures, already-refunded items, and injected instructions in customer text. Define expected outcomes before running the model. Hold several cases aside during prompt tuning.

Measure item identification, valid evidence references, appropriate clarification/escalation, and unsafe actions permitted by the execution layer. Report actual sample counts and results, not invented accuracy percentages. Compare a simple manual review with the app on the same task; report observed time only. A small fixture set is not proof of production safety or business impact.

Critical tests: wrong merchant/case access; amount exceeds remaining capture; stale approval; repeated click; concurrent local action; API timeout; pending refund; invalid webhook signature; duplicate/out-of-order notification; model output containing nonexistent evidence IDs.

## Delivery plan for November 10–12

The final cutoff is November 13 at 01:30 IST (November 12 noon PST). Latest [organizer update](https://paypalaihackathon.devpost.com/updates) confirms this. Internal target: November 12 by 18:00 IST.

1. **First two focused hours:** verify account access and purchase → capture → partial refund → status. Write down IDs and outcomes. If blocked, resolve the account/API issue before building screens around assumed success.
2. **Next six to eight hours:** implement minimal case workflow, model output, policy evaluator, explicit approval, refund persistence, and hosted access. Save a screen recording once it works.
3. **November 11:** add policy rehearsal, meaningful failure tests, user feedback where possible, and visual polish. Deploy the first complete version. Record and upload a first public video and prepare the submission.
4. **November 12 morning:** clean-clone setup test, judge-access test, final evaluation, accurate write-up and final video. Remove any optional integration that threatens stability.
5. **November 12 afternoon:** submit and verify the submitted state and all links before the internal deadline. Preserve the final commit and deployed artifact.

This assumes roughly 20–28 focused builder-hours and timely account access. It is not a guarantee. If less time is available, cut images and sponsor dashboards before the core flow. If substantial code exists elsewhere, adapt it rather than pivot automatically.

Latest organizer instructions say keep demo access and credits active until December 21 and freeze repository, video, and linked materials after the deadline until the winner announcement. This is stricter operational guidance than the earlier plan's December 15 availability target. [Submission checklist update](https://paypalaihackathon.devpost.com/updates/47307-submission-checklist-it-s-go-time)

## Video outline: target 2:40

- 0:00–0:15: Small merchant, $72 order, one damaged item, one unresolved customer.
- 0:15–0:50: AI interprets evidence; show exactly what supports the $24 proposal.
- 0:50–1:15: Policy rehearsal changes recommendations without spending.
- 1:15–1:55: Merchant approves; actual PayPal sandbox refund appears with status and ID.
- 1:55–2:15: Repeat action shows the same result; ambiguous case asks for clarification.
- 2:15–2:40: State measured results, current scope, and next steps.

Judges may rely on the video without running the application, according to the [judging update](https://paypalaihackathon.devpost.com/updates/47306-lights-camera-paypal-video-tips-and-how-judging-works). Demonstrate the implementation, distinguish synthetic inputs from actual sandbox transactions, and avoid claims of guaranteed refunds, fraud detection, or production readiness.

## Submission and unresolved inputs

The [event requirements](https://paypalaihackathon.devpost.com/) call for a functional build, public source with an open-source license, clear tool disclosure, and a public YouTube video under three minutes. Include setup, environment variable names, demo access, architecture, tests, known limits, and third-party attribution. Never publish secrets with test instructions.

The submission form was inspected November 1 but is not available through the former connector in this session; re-check the actual form before submitting. Registration, eligibility, team membership, and submission status remain unverified.

Needed from user: complete PayPal developer login and obtain sandbox app credentials; obtain a model API key; optional access to a merchant for feedback. Credentials should be configured locally, not pasted into chat. User has confirmed starting from scratch and working solo.

## Resource selection after inspecting the linked starter

Recommended order: PayPal sandbox setup → direct model API access → working capture/refund → AG Studio policy-preview screen → Render deployment. APIMatic and Postman are development aids. These are recommendations; no account, license, credit, plugin, or deployment has been activated.

The [PayPal + AG Studio starter](https://github.com/paypaldev/hackathon-paypal-ag-grid-boilerplate) is a Next.js data dashboard with server-side PayPal access and an optional AI assistant. It is useful as a reference, but its documented endpoints do not implement our refund workflow. Its README flags missing authentication and rate limiting on the AI proxy. Verify reuse licensing before copying code; no license was visible in the inspected root listing. We can independently implement against the published APIs if permissions are unclear.

AG Studio can give policy rehearsal a concrete visual form: a case queue, before/after refund totals, cases requiring merchant review, and a custom widget showing evidence for the selected case. Its agent tools should query and alter the preview, while money movement remains behind the server's approval and execution checks. [Agent documentation](https://www.ag-grid.com/studio/react/ai-agents/)

The [pricing page](https://www.ag-grid.com/studio/license-pricing/) distinguishes a 45-day Studio trial from 30-day Grid/Charts Enterprise trials. Check the actual issued expiry date against December 21. Community Grid/Charts are MIT-licensed alternatives if Studio access does not work promptly. Timebox initial Studio setup to 60–90 minutes after the financial flow works.

For a fresh model account, Gemini via [Google AI Studio](https://aistudio.google.com/apikey) is a practical first option: [key setup](https://ai.google.dev/gemini-api/docs/api-key), [structured output](https://ai.google.dev/gemini-api/docs/structured-output), and [billing](https://ai.google.dev/gemini-api/docs/billing) document the required access and structured response support. Free-tier access is model/quota dependent; verify with an actual request. This choice would need a different adapter from the starter's existing OpenAI integration. Keep the core recommendation service independent of Studio so either UI path remains possible.

Immediate user setup:

1. Sign into the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/), select Sandbox, and obtain an app client ID and secret from Apps & Credentials. Identify the sandbox Business seller and Personal buyer. See [sandbox accounts](https://developer.paypal.com/sandbox-testing/accounts) and [REST setup](https://developer.paypal.com/api/rest/).
2. Obtain a Gemini API key in AI Studio. Keep it local; model access is not supplied by AG Studio's UI license.
3. Once the core flow works, request the AG Studio trial and check the issued terms/expiry. Use [Render's event credit portal](https://credits-portal-mmdm.onrender.com/claim/paypal-ai-hackathon) to explore the advertised $50 credit offer; credit receipt, conditions, and remaining balance must be verified before relying on it.

The APIMatic event page links a PDF setup guide; its contents were not extractable through the web viewer in this review. Installation is therefore not verified. Do not count it as a used sponsor until the plugin is actually used during development.

Research scope: current rules, FAQ, overview, updates, all ten sponsor overview pages, key PayPal checkout/orders/payments/refund/webhook/idempotency docs, authorization/payout limitations, toolkit repository overview, and one relevant competitor's official documentation. Not all linked SDK pages or webinars were reviewed. The legacy agent-tools-reference URL failed through the browsing tool. Core recommendation deliberately relies on documented direct REST APIs and still requires sandbox testing.
