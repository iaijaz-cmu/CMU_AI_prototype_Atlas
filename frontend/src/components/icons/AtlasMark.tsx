interface Props {
  size?: number;
}

export function AtlasMark({ size = 28 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="shrink-0">
      <rect width="28" height="28" rx="8" fill="#18181B" />
      <circle cx="14" cy="14" r="7" stroke="white" strokeWidth="1.4" />
      <ellipse cx="14" cy="14" rx="3.5" ry="7" stroke="white" strokeWidth="1.2" />
      <line x1="7" y1="14" x2="21" y2="14" stroke="white" strokeWidth="1.2" />
    </svg>
  );
}
