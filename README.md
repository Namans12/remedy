# Remedy

PayPal AI Hackathon sandbox prototype for reviewing customer cases and testing a partial refund.

## Local setup

Requires Node.js 22 or newer.

```sh
npm install
# On a fresh clone only:
cp .env.example .env
```

The original workspace already has `.env`. Fill in `PAYPAL_CLIENT_ID`,
`PAYPAL_CLIENT_SECRET`, and `GEMINI_API_KEY`. Use sandbox PayPal app credentials.
Leave `GEMINI_MODEL` empty until we select and verify a model available to the account;
it will be required for inference. Webhook and AG Studio values are optional for now.

```sh
npm run check:env
npm run dev
```

Open http://localhost:3000. Restart the development server after changing credentials.
The checker reports variable presence only; API access still needs verification.
Next.js reads `.env` automatically. Existing shell variables and `.env.local` can override
it, so use this one `.env` file for the initial setup.

The PayPal API base is fixed to sandbox in `src/lib/env.ts`. Secrets are server-only
and must not be given a `NEXT_PUBLIC_` prefix. Buyer sandbox login details are used
manually in the PayPal checkout window; they are not application API credentials.

## Checks

```sh
npm run build
npm run typecheck
# With the local development server running, exercise non-transactional API checks:
npm run check:api
```

## GitHub

Repository owner: `Namans12`. Authorized collaborator for pushes: `namans1201`.
The local GitHub CLI was confirmed active as `namans1201` during setup.
Remote: `https://github.com/Namans12/remedy.git`. Collaborator push access was verified.
`.env` and all local environment overrides are ignored; `.env.example` is safe to share.

## Plan

See [HACKATHON_STRATEGY.md](HACKATHON_STRATEGY.md) for the proposed scope and research.

## Current local demo

1. Run `npm run dev` and open http://127.0.0.1:3000. Locally the demo accepts same-origin localhost requests. Hosted access requires additional configuration and validation; do not deploy this prototype as-is.
2. Select **Create test payment**, sign in with your PayPal sandbox *personal buyer* account and approve the $72 test order. On return, the app captures it in sandbox.
3. Select **Review with AI**, then approve the $24 sandbox refund. The policy screen is a synthetic preview; it does not change server-side refund rules.

If checkout reports `UNSUPPORTED_PAYEE_CURRENCY`, PayPal is rejecting the seller's
ability to receive the order currency (USD). Check the seller's sandbox currency
settings. Alternatively, create a **US Business** sandbox account, then create a
new sandbox REST app associated with that seller. Put that app's client ID and
secret in the local `.env` and restart the server; begin a new test payment.
Create a separate **US Personal** sandbox buyer and use it for approval. The API
credentials determine the seller; logging in as the business account does not
change the seller. PayPal does not support domestic payments between India
accounts, so changing the buyer alone may not resolve the seller currency error.
Do not enter a real payment card.
PayPal's [sandbox account guide](https://developer.paypal.com/sandbox-testing/accounts)
and [India payments guidance](https://www.paypal.com/in/cshelp/article/can-i-use-paypal-to-receive-payments-from-indian-customers-help1049)
describe test accounts and the domestic-payment restriction.

The order ID and refund action are stored locally in `.data/remedy.sqlite`, which is Git-ignored. Each capture can have only one demo refund. A failed or uncertain refund is recorded and is not automatically retried; check PayPal before taking further action. This prototype is not a production service: it has no merchant authentication, verified webhooks, multi-user support, or production-safe deployment. The server limits refunds to a fixed $24 demo amount, but AI review is not a server-side authorization decision. Confirm actual PayPal response statuses rather than assuming success.

## Hosted demo status

The code includes a PostgreSQL adapter (`DATABASE_URL`), an HTTPS `APP_ORIGIN` check and a shared-password demo gate (`DEMO_PASSWORD`, minimum 16 characters; user name `judge`). It also includes shared fixed-window limits for selected actions. These controls are preliminary, have not been tested against a Render database, and are not production-ready; the shared-password login itself is not rate-limited, and verified webhooks are not implemented. Configure secrets in the hosting platform, never in the repository. Do not deploy until authentication, database persistence, rate limiting and sandbox checkout have been validated.

The existing local `.data/remedy.sqlite` is preserved and is not migrated automatically to PostgreSQL. Hosted and local transactions are separate. AG Studio is not included; its evaluation-only license must be checked before hosted use.

### Render cost and availability planning

[Render's free-tier documentation](https://render.com/docs/free) says Free web
services spin down after 15 minutes without traffic and may take about one minute
to start again. Free Postgres expires after 30 days and has no backups. A free
database created on November 11 would therefore expire around December 11, before
the event's stated December 21 access target. Use an appropriate paid database or
another verified durable option if the demo must remain available throughout
judging. Check the exact service price, credit coverage, workspace usage and
possible overages in Render before creating anything; credits do not establish a
guarantee of zero charges. No Render resource has been provisioned by this project.
As a planning estimate, Render lists its smallest paid Postgres compute at
approximately $6/month; an always-on Starter web service plus that database has
been estimated by Render at about $13/month before storage growth and bandwidth.
Actual rates, storage, taxes, usage and promo eligibility must be checked in the
dashboard. See [Render's cost guide](https://render.com/articles/how-much-does-cloud-application-hosting-cost-for-small-businesses)
and [database pricing guide](https://render.com/articles/managed-postgresql-pricing-2026).

## License

The source is available under the [MIT License](LICENSE).
