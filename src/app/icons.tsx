import type { ReactNode } from 'react';

type IconName = 'desk' | 'policy' | 'card' | 'sparkle' | 'check' | 'clock' | 'warning' | 'refund' | 'refresh' | 'close' | 'message' | 'shield' | 'spinner' | 'info';
const paths: Record<IconName, ReactNode> = {
  desk: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M8 9v11M12 13h5M12 16h3"/></>,
  policy: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5"/></>,
  card: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/></>,
  sparkle: <><path d="m10 3 2.3 6.7L19 12l-6.7 2.3L10 21l-2.3-6.7L1 12l6.7-2.3zM19 2v5M16.5 4.5h5"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  warning: <><path d="m10.3 4-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3l-8-14a2 2 0 0 0-3.4 0Z M12 9v4M12 17h.01"/></>,
  refund: <><path d="M8 4 3 9l5 5M3 9h11a6 6 0 0 1 0 12h-3"/></>,
  refresh: <><path d="M20 7v5h-5M4 17v-5h5M5.5 7a7 7 0 0 1 11.8-1L20 12M4 12l2.7 6A7 7 0 0 0 18.5 17"/></>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  message: <><path d="M21 14a3 3 0 0 1-3 3H9l-6 4V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3zM7 8h10M7 12h6"/></>,
  shield: <><path d="m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6z"/><path d="m8 12 3 3 5-6"/></>,
  spinner: <path d="M21 12a9 9 0 1 1-9-9"/>,
  info: <><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></>,
};

/** Decorative only: the adjacent text always supplies the accessible name. */
export function Icon({ name }: { name: IconName }) {
  return <svg className={`icon${name === 'spinner' ? ' spinner' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
