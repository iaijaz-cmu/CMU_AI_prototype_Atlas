import type { ToolIcon as ToolIconName } from '../../lib/types';

interface Props {
  icon: ToolIconName;
  color: string;
  size?: number;
}

export function ToolIcon({ icon, color, size = 15 }: Props) {
  const s = size;
  switch (icon) {
    case 'grid':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" stroke={color} strokeWidth="1.3" />
          <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" stroke={color} strokeWidth="1.3" />
          <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" stroke={color} strokeWidth="1.3" />
          <rect x="9" y="9" width="5.5" height="5.5" rx="1.5" stroke={color} strokeWidth="1.3" />
        </svg>
      );
    case 'doc':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <path d="M3 2h7l3 3v9H3V2z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M10 2v3h3" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="5" y1="7" x2="11" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="9.5" x2="11" y2="9.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="12" x2="8.5" y2="12" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'map':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <polyline points="1,3 5,1 11,5 15,3 15,13 11,15 5,11 1,13" stroke={color} strokeWidth="1.3" strokeLinejoin="round" fill="none" />
          <line x1="5" y1="1" x2="5" y2="11" stroke={color} strokeWidth="1.2" opacity="0.5" />
          <line x1="11" y1="5" x2="11" y2="15" stroke={color} strokeWidth="1.2" opacity="0.5" />
        </svg>
      );
    case 'check':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" stroke={color} strokeWidth="1.3" />
          <polyline points="4.5,8 7,10.5 11.5,5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'chart':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <line x1="2" y1="14" x2="14" y2="14" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <rect x="3" y="9" width="2.5" height="5" rx="1" stroke={color} strokeWidth="1.2" />
          <rect x="6.75" y="6" width="2.5" height="8" rx="1" stroke={color} strokeWidth="1.2" />
          <rect x="10.5" y="3" width="2.5" height="11" rx="1" stroke={color} strokeWidth="1.2" />
        </svg>
      );
    case 'code':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <polyline points="5,4.5 1.5,8 5,11.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="11,4.5 14.5,8 11,11.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="9.5" y1="2.5" x2="6.5" y2="13.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'ticket':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <rect x="1.5" y="4" width="13" height="8" rx="2" stroke={color} strokeWidth="1.3" />
          <line x1="5.5" y1="4" x2="5.5" y2="12" stroke={color} strokeWidth="1.2" strokeDasharray="1.5 1.5" />
          <line x1="7.5" y1="7" x2="12" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="7.5" y1="9.5" x2="10" y2="9.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'decision':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="3" r="2" stroke={color} strokeWidth="1.3" />
          <circle cx="3" cy="13" r="2" stroke={color} strokeWidth="1.3" />
          <circle cx="13" cy="13" r="2" stroke={color} strokeWidth="1.3" />
          <line x1="8" y1="5" x2="8" y2="9" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <line x1="8" y1="9" x2="3.7" y2="11.2" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <line x1="8" y1="9" x2="12.3" y2="11.2" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'bolt':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <polyline points="10,1.5 5,8.5 8.5,8.5 6,14.5 11,7.5 7.5,7.5 10,1.5" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      );
    case 'radar':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.2" />
          <circle cx="8" cy="8" r="3.5" stroke={color} strokeWidth="1.2" />
          <circle cx="8" cy="8" r="1.2" fill={color} />
          <line x1="8" y1="8" x2="12.5" y2="4.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case 'globe':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.3" />
          <ellipse cx="8" cy="8" rx="3" ry="6.5" stroke={color} strokeWidth="1.2" />
          <line x1="1.5" y1="8" x2="14.5" y2="8" stroke={color} strokeWidth="1.2" />
          <line x1="2.5" y1="5" x2="13.5" y2="5" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="2.5" y1="11" x2="13.5" y2="11" stroke={color} strokeWidth="1" opacity="0.5" />
        </svg>
      );
    case 'signal':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <path d="M1.5 12.5 C3.5 10 5.5 9.5 8 10.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M3 9.5 C5 6.5 8 5.5 12 7" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M5 6.5 C7 3.5 11 3 14.5 5.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8" cy="13.5" r="1.5" fill={color} />
        </svg>
      );
    case 'report':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <rect x="2.5" y="1.5" width="11" height="13" rx="2" stroke={color} strokeWidth="1.3" />
          <line x1="5" y1="5.5" x2="11" y2="5.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="8" x2="11" y2="8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5" y1="10.5" x2="8.5" y2="10.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'shield':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <path d="M8 1.5 L14 4.5 V8 C14 11.5 11 13.5 8 14.5 C5 13.5 2 11.5 2 8 V4.5 Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
          <polyline points="5.5,8 7.5,10 10.5,6" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'target':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.2" />
          <circle cx="8" cy="8" r="3.5" stroke={color} strokeWidth="1.2" />
          <circle cx="8" cy="8" r="1.5" fill={color} />
          <line x1="8" y1="1.5" x2="8" y2="4.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="8" y1="11.5" x2="8" y2="14.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="1.5" y1="8" x2="4.5" y2="8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="11.5" y1="8" x2="14.5" y2="8" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'trophy':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <path d="M5.5 2H10.5V8.5C10.5 10.4 9.4 11.5 8 11.5C6.6 11.5 5.5 10.4 5.5 8.5V2Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
          <path d="M5.5 4H3C3 4 2.5 7.5 5.5 7.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.5 4H13C13 4 13.5 7.5 10.5 7.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="8" y1="11.5" x2="8" y2="13" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
          <line x1="5.5" y1="14" x2="10.5" y2="14" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    case 'deal':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <path d="M1.5 10.5 L5.5 6.5 L8 9 L12 4.5 L14.5 7" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M11.5 4.5 H14.5 V7.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="1.5" y1="13.5" x2="14.5" y2="13.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
        </svg>
      );
    case 'plug':
      return (
        <svg width={s} height={s} viewBox="0 0 16 16" fill="none">
          <path d="M6 2v3.5M10 2v3.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M4 5.5h8v3a4 4 0 0 1-4 4 4 4 0 0 1-4-4v-3z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
          <line x1="8" y1="12.5" x2="8" y2="14.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}
