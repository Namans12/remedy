# Remedy demo recording guide

Target: under three minutes. This is a recording plan; the video has not been
recorded or uploaded. Use synthetic data and PayPal sandbox only.

## Before recording

- Open Remedy and sign in if using a hosted demo. Close billing, email, account
  settings, and other unrelated tabs. Do not show passwords, API keys, or card
  details. Use only the sandbox personal buyer account.
- Have the sandbox buyer's credentials available privately. The approval page
  must be at `www.sandbox.paypal.com`; never enter a real card or PayPal login.
- Check that AI review is available. If it is unavailable, do not present a
  fabricated AI result: retry or record the error and explain the limitation.
- Start with a fresh sample payment. After a completed refund, select **Start
  another test payment**. The prior refund remains recorded. Sandbox checkouts
  may require the buyer to sign in again. If checkout is interrupted before
  approval, select **Resume checkout** to reopen the same sandbox order.

## Suggested narration and screen actions

| Time | Screen action | Narration |
| --- | --- | --- |
| 0:00–0:20 | Show the resolution desk and sample message. | “Small merchants need to turn customer complaints into fair, consistent actions. Remedy brings the message, a suggested resolution, and the PayPal transaction together.” |
| 0:20–0:45 | Select **Review with AI**. Show the quoted evidence and suggestion. | “The AI highlights what the customer actually said and proposes a next step. The merchant remains responsible for the decision; Remedy does not verify the damage.” |
| 0:45–1:05 | Open **Policy preview** and adjust the threshold. | “This preview lets a merchant explore how a review threshold affects sample cases. It is a simulation and does not change the refund rules.” |
| 1:05–1:45 | Return to the desk, create the test payment, approve as the sandbox buyer, and show the completed capture. Trim any waiting or private sign-in. | “The example order is three mugs for $72. The buyer approves a PayPal sandbox payment, and Remedy displays the payment status returned by PayPal.” |
| 1:45–2:15 | Review the message again if needed, approve the $24 refund, and show the returned status. | “The merchant explicitly approves a $24 partial refund for one mug. Remedy shows the actual PayPal response.” Say “completed” only if the displayed status is completed. |
| 2:15–2:35 | Show **Refund recorded** and the payment timeline. | “The application records the refund attempt and prevents a second refund for this capture. If an outcome is uncertain, it requires reconciliation rather than blindly retrying.” |
| 2:35–2:45 | Show the repository or closing screen. | “Remedy is a sandbox prototype built with PayPal APIs, AI, and a merchant review workflow.” |

Use cuts to remove waiting and password entry while preserving the real sequence.
Capture and refund were verified locally and on Render. Record a fresh sandbox
checkout if you want to show the full buyer flow.

## Before publishing

Review the finished video for visible secrets or personal information, confirm
its duration and audio, upload it as required by the current Devpost rules, and
paste its public link into the submission. Do not submit until the working demo
and judge-access instructions have also been verified.
