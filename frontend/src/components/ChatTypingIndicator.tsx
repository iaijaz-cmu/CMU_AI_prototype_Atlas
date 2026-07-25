import { AtlasMark } from './icons/AtlasMark';

export function ChatTypingIndicator({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex items-start gap-2.5 ${compact ? '' : 'px-0.5'}`}>
      <div
        className="shrink-0 rounded-md bg-white border border-n-border flex items-center justify-center"
        style={{ width: compact ? 24 : 28, height: compact ? 24 : 28 }}
      >
        <AtlasMark size={compact ? 16 : 18} variant="ai" />
      </div>
      <div
        className={`bg-n-inset border border-n-border rounded-xl rounded-tl-sm ${compact ? 'px-3 py-2 text-xs' : 'px-3.5 py-2.5 text-[13px]'} text-n-text-2 flex items-center gap-1`}
      >
        <span>Atlas is thinking</span>
        <span className="inline-flex gap-0.5" aria-hidden>
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="w-1 h-1 rounded-full bg-n-text-muted inline-block"
              style={{ animation: `atlas-pulse 1.2s ease-in-out ${d * 0.15}s infinite` }}
            />
          ))}
        </span>
      </div>
    </div>
  );
}
