'use client';

import { useState } from 'react';

export function PasswordField({ hasError }: { hasError: boolean }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="signInPassword">
      <input id="judge-password" name="password" type={visible ? 'text' : 'password'}
        autoComplete="current-password" autoFocus
        aria-describedby={hasError ? 'sign-in-help sign-in-error' : 'sign-in-help'}
        aria-invalid={hasError || undefined} maxLength={256} required />
      <button type="button" className="signInToggle" aria-controls="judge-password"
        aria-label="Show password" aria-pressed={visible}
        onClick={() => setVisible(!visible)}>
        {visible ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}
