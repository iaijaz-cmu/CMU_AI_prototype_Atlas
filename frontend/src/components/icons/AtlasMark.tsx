interface Props {
  size?: number;
  variant?: 'default' | 'ai';
}

/** Minimal line mark — Notion AI–style sparkle on warm surface */
export function AtlasMark({ size = 28, variant = 'default' }: Props) {
  const stroke = variant === 'ai' ? '#9065B0' : '#37352F';
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="shrink-0" aria-hidden>
      <rect width="28" height="28" rx="7" fill="#FFFFFF" stroke="#E9E9E7" strokeWidth="1" />
      <path
        d="M14 6.5v3M14 18.5v3M6.5 14h3M18.5 14h3"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M9.2 9.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 9.2l-2.1 2.1M11.3 16.7l-2.1 2.1"
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="14" cy="14" r="2" fill={variant === 'ai' ? '#9065B0' : '#37352F'} opacity="0.9" />
    </svg>
  );
}
