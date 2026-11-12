# Remedy submission draft

**Status: draft; the owner handles the Devpost submission and the public upload.**
The hosted demo passed authentication, persistence, and Gemini review checks.
PayPal confirmed the $72 sandbox capture and the $24 partial refund on Render, and
again locally on 2026-11-13 (revision `61aa86f` plus the then-uncommitted UI polish):
buyer approval, capture, a `COMPLETED` refund, a repeated refund request returning
the original refund (`duplicate: true`), and the completed status persisting after a
reload. A local demo video has been produced (see `DEMO_RECORDING.md`); it has not
been uploaded.

## Short description

Remedy helps a small merchant review a customer issue, see the evidence behind an
AI suggestion, and resolve a sample order through PayPal sandbox.

## Project description

A small merchant receiving a complaint has to connect the customer's words to an
order and decide how to respond. Remedy brings a sample customer message, an AI
review, and the payment status into one workspace. The AI extracts a short quote
from the message and suggests a next step. The server checks that the quote appears
word for word in the message, so the merchant can see which words the suggestion is
based on. It does not verify that the recommendation is correct, that anything is
damaged, or the customer's claim.

The demo models a $72 order containing three $24 mugs. A merchant can create a
PayPal sandbox order and, after buyer approval and capture, explicitly approve a
fixed $24 sandbox refund. Remedy records the refund attempt and prevents another
local refund for the same capture. Pending and uncertain outcomes are shown as
such and may require investigation in the PayPal sandbox dashboard.

The policy preview uses six clearly labelled sample cases. Adjusting the threshold
changes the preview; it does not change the server's refund rules or move money.
The prototype is a single shared demo workspace, not a production merchant system.

## Built with

- Next.js, React, TypeScript, and CSS.
- PayPal Orders and Payments REST APIs, using the sandbox environment only.
- Gemini API for the message review.
- SQLite for local state and Render PostgreSQL for hosted state.

The policy preview is built into Remedy.

## Demonstration video outline

Target length: under three minutes. Show real application screens and label all
sample data and sandbox transactions.

1. Introduce the merchant's problem and the $72 synthetic order.
2. Show the editable customer message and run the AI review. Point out the quoted
   evidence and the limitation that the claim has not been independently verified.
3. Show the policy preview and change the threshold. Explain that it is a simulation.
4. Show the sandbox checkout and buyer approval, followed by the captured status.
5. Show explicit merchant approval of the $24 refund and its actual PayPal status.
6. Show how a repeated action is prevented and mention how unknown outcomes are
   investigated. Do not claim a completed refund until PayPal confirms it.

Do not show secrets, personal account credentials, or private billing information
in the recording. After a completed refund, use **Start another test payment** to
create a new sandbox order. The previous transaction remains in the database.

## Links and release checks

- Public source: https://github.com/Namans12/remedy
- Public video: **recorded locally, not yet uploaded**. The owner uploads it as
  Public and pastes the watch URL into Devpost.
- Hosted demo: https://remedy-oyr0.onrender.com/. The project owner shares the
  `judge` login password privately through the judging instructions; do not put it
  in the public project text. After signing in, the "How to try Remedy" panel on the
  Resolution desk lists the steps in order. The shared demo may already show a
  completed sample case; judges can select **Start another test payment** for a fresh
  sandbox run, which needs the sandbox buyer account from the testing instructions.
- Open-source license: MIT (see LICENSE).
- PayPal sandbox buyer approval, capture, completed partial refund, and duplicate handling: **verified locally and on Render**.
- Review actual Devpost submission fields, testing instructions, disclosures, and
  judging availability before submitting. No submission has been made.

See the [official rules](https://paypalaihackathon.devpost.com/rules) for the
authoritative submission and judging requirements.
