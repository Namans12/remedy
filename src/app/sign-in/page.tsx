import type { Metadata } from 'next';
import { checkoutParams, demoUser } from '@/lib/demo-auth';
import { Icon } from '../icons';
import { PasswordField } from './password-field';
import '../style.css';
import './sign-in.css';

export const metadata: Metadata = {
  title: 'Sign in to Remedy',
  robots: { index: false, follow: false },
};

const errors: Record<string, string> = {
  credentials: 'The username or password didn’t match. Check the judge testing instructions and try again.',
  limit: 'Too many sign-in attempts. Wait a minute and try again.',
  unavailable: 'Sign-in is temporarily unavailable. Try again in a moment.',
};

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; token?: string; error?: string }>;
}) {
  const query = await searchParams;
  const checkout = checkoutParams(query.checkout, query.token);
  const error = typeof query.error === 'string' && Object.hasOwn(errors, query.error)
    ? errors[query.error] : undefined;

  return (
    <main className="signIn">
      <div className="signInShell">
        <header className="signInHeader">
          <div className="signInBrand"><span aria-hidden="true">r</span> remedy.</div>
          <span className="signInBadge">PayPal AI Hackathon demo</span>
        </header>
        <div className="signInLayout">
          <div className="signInWelcome">
            <p className="signInEyebrow">A thoughtful path to resolution</p>
            <h1>Customer complaints.<br />Clearer next steps.</h1>
            <p className="signInIntro">Remedy helps merchants review customer complaints with AI-quoted evidence and approve PayPal sandbox refunds.</p>
          </div>
          <section className="signInPanel" aria-labelledby="sign-in-title">
            <div className="signInCardIcon"><Icon name="desk" /></div>
            <h2 id="sign-in-title">Welcome, judges</h2>
            <p className="signInCardIntro">Sign in to explore the merchant workspace.</p>
            <form action="/api/sign-in" method="post" className="signInForm">
              {Array.from(checkout, ([name, value]) => (
                <input key={name} type="hidden" name={name} value={value} />
              ))}
              <div className="signInField">
                <label htmlFor="judge-username">Username</label>
                <input id="judge-username" name="username" autoComplete="username"
                  defaultValue={demoUser} maxLength={64} required />
              </div>
              <div className="signInField">
                <label htmlFor="judge-password">Demo password</label>
                <PasswordField hasError={Boolean(error)} />
                <p className="signInHelp" id="sign-in-help">Find the demo password in the Devpost testing instructions.</p>
              </div>
              {error && <p className="signInError" id="sign-in-error" role="alert"><Icon name="warning" /><span>{error}</span></p>}
              <button className="primary" type="submit">Sign in to Remedy <span aria-hidden="true">→</span></button>
            </form>
            <p className="signInSandbox"><Icon name="shield" /><span>PayPal Sandbox · Test funds only</span></p>
          </section>
          <section className="signInPreview" aria-labelledby="sign-in-preview-title">
            <h2 id="sign-in-preview-title">After you sign in</h2>
            <ol className="signInSteps">
              <li><span className="signInStepNumber" aria-hidden="true">01</span><div><h3>Review a sample complaint</h3><p>Step into a merchant’s workspace with a synthetic customer case.</p></div></li>
              <li><span className="signInStepNumber" aria-hidden="true">02</span><div><h3>Check Gemini’s quoted evidence</h3><p>Inspect the source text. AI does not verify the customer’s claim.</p></div></li>
              <li><span className="signInStepNumber" aria-hidden="true">03</span><div><h3>Try the sandbox payment flow</h3><p>Use a $72 test order and explicitly approve a $24 partial refund.</p></div></li>
            </ol>
            <p className="signInPreviewNote"><Icon name="info" /><span>Sample data throughout. You review the evidence and make the refund decision.</span></p>
          </section>
        </div>
      </div>
    </main>
  );
}
