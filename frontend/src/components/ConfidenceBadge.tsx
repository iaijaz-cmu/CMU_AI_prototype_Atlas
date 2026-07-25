import type { Confidence } from '../lib/types';

const COLORS: Record<Confidence['level'], { bg: string; color: string; dot: string }> = {
  High: { bg: '#EDFAF4', color: '#0d9668', dot: '#10b981' },
  Medium: { bg: '#FFF4EA', color: '#b45309', dot: '#D4640A' },
  Low: { bg: '#FEF2F2', color: '#dc2626', dot: '#dc2626' },
};

export function ConfidenceBadge({ confidence }: { confidence: Confidence }) {
  const c = COLORS[confidence.level];
  return (
    <span className="inline-flex items-center gap-1.5" title={confidence.reason}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: c.dot }} />
      <span style={{ color: c.color }} className="font-semibold">
        {confidence.level} confidence
      </span>
    </span>
  );
}
