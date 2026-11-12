import type { Metadata } from 'next';
import { checkoutParams, demoUser } from '@/lib/demo-auth';
import { Icon } from '../icons';
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
      <div className="signInPanel">
        <div className="signInBrand">
          <span aria-hidden="true">r</span> remedy.
        </div>
        <h1>Sign in to Remedy</h1>
        <p className="signInIntro">Open the merchant workspace with your judge demo credentials.</p>
        <form action="/api/sign-in" method="post" className="signInForm">
          {Array.from(checkout, ([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <label htmlFor="judge-username">Username</label>
          <input id="judge-username" name="username" autoComplete="username"
            defaultValue={demoUser} maxLength={64} required />
          <label htmlFor="judge-password">Demo password</label>
          <input id="judge-password" name="password" type="password"
            autoComplete="current-password" aria-describedby={error ? 'sign-in-error' : 'sign-in-help'}
            maxLength={256} required />
          {error && <p className="signInError" id="sign-in-error" role="alert">{error}</p>}
          <button className="primary" type="submit">Sign in</button>
        </form>
        <p className="signInHelp" id="sign-in-help">Find the demo password in the Devpost testing instructions.</p>
        <p className="signInSandbox"><Icon name="shield" /> PayPal Sandbox uses test funds.</p>
      </div>
    </main>
  );
}
