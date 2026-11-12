# Remedy demo video for Claude Code

Produce a finished MP4 from the actual Remedy app. Aim for 2:40 and keep the
final export under 3:00. Assume the viewer is a PayPal AI Hackathon judge who
has never opened the project.

## Deliverables

- `Remedy-Demo.mp4` at 1920 × 1080, 30 fps, H.264, with clear narration and
  accurate captions.
- Editable Remotion source, a narration script, and a short note naming the
  app revision recorded and any steps you could not capture.
- Optional separate SRT if the video also uses open captions. Keep raw footage
  and render outputs out of the app repository unless the owner asks otherwise.

## Start here

Read [the project README](README.md), [the handoff](CLAUDE_HANDOFF.md), and
[the recording guide](DEMO_RECORDING.md). Check for existing usable footage
before recording again. Create the Remotion project in a separate folder so
the app build and its dependencies stay independent.

Install the official [Remotion plugin for Claude Code](https://www.remotion.dev/docs/ai/claude-code-plugin)
if needed. Restart Claude Code after installation and invoke
`/remotion:remotion-create` with this brief. Use Remotion for sequencing,
captions, and export. Capture the app with an available browser or screen
recorder. If only the PayPal sign-in is blocked, assemble the other scenes and
ask the owner for that specific clip or action.

## Timeline and narration

| Time | Real footage to show | Narration or message |
| --- | --- | --- |
| 0:00–0:15 | Open directly on the Resolution Desk and sample complaint. | “One of three mugs arrived chipped. A small merchant has to make a fair decision and carry it out. Remedy brings that review and the PayPal transaction into one workspace.” |
| 0:15–0:48 | Click **Review with AI**. Hold on the quoted evidence and suggested $24 refund. | “Gemini highlights the customer’s own words and suggests reviewing a $24 partial refund. Remedy checks the quote against the original message. The merchant decides how to respond.” |
| 0:48–1:05 | Open **Policy preview** and change the threshold once. | “The policy preview shows which sample cases would need review at a different threshold.” Label it as a simulation. |
| 1:05–1:48 | Create the $72 sandbox payment, show buyer approval, return to Remedy, and hold on the capture status. | “This test order contains three $24 mugs. The buyer approves the $72 payment in PayPal Sandbox, then Remedy shows the capture status.” |
| 1:48–2:22 | Show the merchant explicitly approving the $24 refund and hold on the resulting status. | “The merchant approves the refund for one mug. Remedy records the result PayPal returns.” Say “completed” after that status appears. |
| 2:22–2:40 | Show the recorded refund after refresh and the short closing card. | “The recorded refund survives a refresh, and Remedy prevents a duplicate refund for the same capture.” Close with Remedy, PayPal Sandbox, and Gemini. |

If time is tight, shorten the policy preview and transitions first. Keep
buyer approval, capture, merchant approval, and refund confirmation legible.

## Footage and editing

- Record the real app with synthetic customer data and a separate PayPal
  Sandbox order. Use the test buyer and seller accounts and sandbox funds.
  Trim any password entry. Remove API keys, real account information, billing
  screens, and unrelated tabs from the footage.
- Cut pauses and use gentle zooms to draw attention to the quote, amount, and
  status. Keep screen text readable at half size. Use Remedy's existing
  colors and keep captions clear of controls and status messages.
- Use the owner's narration or an authorized synthetic voice. Use silence
  underneath unless suitable licensed audio is already available.
- Use factual labels and actual responses. If buyer approval footage is
  unavailable, use the previously verified transaction state, label it as
  a recorded sandbox result, and tell the owner which clip is missing.

## Final check and handoff

Play the rendered MP4 from start to finish. Check duration, spoken numbers,
caption timing, legibility, and credential exposure. Confirm that the app
workflow appears in the right order and that the final file plays outside
Remotion Studio. Hand back the file path, exact duration, and a suggested
YouTube title and description. The owner can upload it as Public and paste the
watch URL into Devpost. [Official hackathon rules](https://paypalaihackathon.devpost.com/rules)
