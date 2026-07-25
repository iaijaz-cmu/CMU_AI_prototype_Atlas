import type { IntegrationIcon } from '../lib/types';
import type { ReactElement } from 'react';

interface Props {
  icon: IntegrationIcon;
  size?: number;
  radius?: number;
  overlap?: boolean;
  bg?: string;
  className?: string;
}

function SlackMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="w-[62%] h-[62%]">
      <path
        d="M5.5 14.5a1.75 1.75 0 1 1 0-3.5h3.5V8.5a1.75 1.75 0 1 1 3.5 0v3.5H9.5a1.75 1.75 0 0 1-1.75 1.75H5.5Z"
        fill="#36C5F0"
      />
      <path
        d="M8.5 5.5a1.75 1.75 0 1 1 3.5 0v3.5h3.5a1.75 1.75 0 1 1 0 3.5h-3.5V9.5a1.75 1.75 0 0 1-1.75-1.75V5.5Z"
        fill="#2EB67D"
      />
      <path
        d="M18.5 9.5a1.75 1.75 0 1 1 0 3.5h-3.5v3.5a1.75 1.75 0 1 1-3.5 0v-3.5h3.5a1.75 1.75 0 0 1 1.75-1.75v-1.75Z"
        fill="#ECB22E"
      />
      <path
        d="M15.5 18.5a1.75 1.75 0 1 1-3.5 0v-3.5H8.5a1.75 1.75 0 1 1 0-3.5h3.5v3.5a1.75 1.75 0 0 1 1.75 1.75h1.75Z"
        fill="#E01E5A"
      />
    </svg>
  );
}

function JiraMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[70%] h-[70%]">
      <path
        fill="#2684FF"
        d="M11.53 2.5c.35-.35.92-.35 1.27 0l8.2 8.2c.35.35.35.92 0 1.27l-8.2 8.2a.9.9 0 0 1-1.27 0l-8.2-8.2a.9.9 0 0 1 0-1.27l8.2-8.2Z"
      />
      <path fill="#0052CC" d="M11.53 6.2 6.7 11.03l4.83 4.83 4.83-4.83L11.53 6.2Z" />
    </svg>
  );
}

function ConfluenceMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[68%] h-[68%]">
      <path
        fill="#2684FF"
        d="M4.2 16.8c2.4 2.6 5.8 4 9.3 3.2 1.4-.3 2.7-.9 3.8-1.8.4-.3.9-.2 1.2.2l1.6 1.8c.3.3.2.8-.1 1.1-1.6 1.4-3.5 2.4-5.6 2.9-4.5 1.1-9.2-.7-12-4.5-.3-.4-.2-.9.2-1.2l1.8-1.5c.4-.3.9-.2 1.2.1Z"
      />
      <path
        fill="#2684FF"
        d="M19.8 7.2c-2.4-2.6-5.8-4-9.3-3.2-1.4.3-2.7.9-3.8 1.8-.4.3-.9.2-1.2-.2L3.9 4.8c-.3-.3-.2-.8.1-1.1 1.6-1.4 3.5-2.4 5.6-2.9 4.5-1.1 9.2.7 12 4.5.3.4.2.9-.2 1.2l-1.8 1.5c-.4.3-.9.2-1.2-.1Z"
      />
    </svg>
  );
}

function DriveMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[68%] h-[68%]">
      <path fill="#0F9D58" d="M12 3.5 20.5 18H3.5L12 3.5Z" />
      <path fill="#FFBA00" d="M3.5 18 8 9.5h8L20.5 18H3.5Z" opacity="0.95" />
      <path fill="#4285F4" d="M8 9.5 12 3.5l4 6H8Z" />
    </svg>
  );
}

function ZendeskMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[72%] h-[72%]">
      <path
        fill="#03363D"
        d="M12 3.5c-4.7 0-8.5 3.8-8.5 8.5S7.3 20.5 12 20.5s8.5-3.8 8.5-8.5S16.7 3.5 12 3.5Zm-2.2 11.2L6.8 8.8l2.9-1.2 2.1 5.1 2.1-5.1 2.9 1.2-3 5.9H9.8Z"
      />
    </svg>
  );
}

function SalesforceMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[72%] h-[72%]">
      <path
        fill="#00A1E0"
        d="M8.2 5.5c.9-1.2 2.3-2 3.9-2 1.2 0 2.3.4 3.2 1.1.6-.3 1.3-.5 2-.5 2.5 0 4.5 1.8 4.9 4.2 1.8.4 3.1 2 3.1 3.9 0 2.2-1.8 4-4 4H6.8c-2.2 0-4-1.8-4-4 0-1.7 1.1-3.1 2.7-3.7.3-2.2 2.2-3.9 4.5-3.9.5 0 1 .1 1.5.2-.2-.6-.3-1.2-.3-1.8Z"
      />
    </svg>
  );
}

function GmailMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[68%] h-[68%]">
      <path fill="#EA4335" d="M4 6.5v11h16v-11H4Z" />
      <path fill="#FBBC04" d="M4 6.5 12 13l8-6.5H4Z" />
      <path fill="#34A853" d="M20 6.5v11l-5.5-4.5L20 6.5Z" />
      <path fill="#4285F4" d="M4 17.5V6.5l5.5 4.5L4 17.5Z" />
      <path fill="#fff" d="M4 7.8 12 14.2 20 7.8V6.5H4v1.3Z" opacity="0.95" />
      <path fill="#C5221F" d="M4 6.5h4.2L12 10.5 15.8 6.5H20L12 13 4 6.5Z" />
    </svg>
  );
}

function GoogleNewsMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[68%] h-[68%]">
      <path fill="#4285F4" d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" />
      <path fill="#fff" d="M8 8h8v2H8V8Zm0 3h8v2H8v-2Zm0 3h5v2H8v-2Z" />
    </svg>
  );
}

function BloombergMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[70%] h-[70%]">
      <rect width="24" height="24" rx="4" fill="#000" />
      <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="system-ui,sans-serif">
        B
      </text>
    </svg>
  );
}

const MARKS: Record<IntegrationIcon, () => ReactElement> = {
  slack: SlackMark,
  jira: JiraMark,
  confluence: ConfluenceMark,
  drive: DriveMark,
  zendesk: ZendeskMark,
  salesforce: SalesforceMark,
  gmail: GmailMark,
  google_news: GoogleNewsMark,
  bloomberg: BloombergMark,
};

export function IntegrationLogo({ icon, size = 22, radius = 6, overlap = false, bg = '#fff', className = '' }: Props) {
  const Mark = MARKS[icon];
  return (
    <div
      className={`flex items-center justify-center shrink-0 overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        marginLeft: overlap ? -6 : 0,
        border: overlap ? '2px solid #fff' : '1px solid rgba(0,0,0,0.06)',
      }}
      title={icon}
    >
      <Mark />
    </div>
  );
}
