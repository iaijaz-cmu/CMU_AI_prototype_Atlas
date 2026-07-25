import type { AgentId, Citation } from '../lib/types';
import { AGENT_DEFS } from '../lib/data';
import { theme } from '../lib/theme';
import { AtlasMarkdown } from './AtlasMarkdown';
import { AtlasMark } from './icons/AtlasMark';
import { CitationChip } from './CitationChip';
import { GmailComposeButton } from './GmailComposeButton';

export interface ThreadMessage {
  role: 'user' | 'assistant';
  text: string;
  title?: string | null;
  scope?: string | null;
  citations?: Citation[];
  uncertaintyFlags?: string | null;
  agentTag?: AgentId | null;
}

interface Props {
  messages: ThreadMessage[];
  compact?: boolean;
  citationAccent?: string;
  showGmail?: boolean | ((msg: ThreadMessage, index: number) => boolean);
  gmailCompact?: boolean;
  onOpenAgent?: (agentId: AgentId) => void;
}

export function ChatMessageList({
  messages,
  compact = false,
  citationAccent = theme.ai,
  showGmail = true,
  gmailCompact = true,
  onOpenAgent,
}: Props) {
  const bubbleUser = compact
    ? 'max-w-[88%] bg-n-surface-2 text-n-text rounded-[14px_14px_4px_14px] px-3 py-2 text-xs leading-relaxed border border-n-border'
    : 'max-w-[min(88%,520px)] bg-n-surface-2 text-n-text rounded-[12px_12px_4px_12px] px-3.5 py-2.5 text-[13.5px] leading-relaxed border border-n-border';
  const bubbleAssistant = compact
    ? 'flex-1 min-w-0 bg-white border border-n-border rounded-[14px_14px_14px_4px] px-3 py-2 text-xs leading-relaxed text-n-text shadow-sm'
    : 'flex-1 min-w-0 bg-white border border-n-border rounded-[12px_12px_12px_4px] px-3.5 py-3 text-[13.5px] leading-relaxed text-n-text shadow-sm';

  return (
    <>
      {messages.map((m, i) => {
        const isError = m.text.startsWith('⚠️');
        const gmail =
          typeof showGmail === 'function' ? showGmail(m, i) : showGmail && m.role === 'assistant' && !isError;
        const agentDef = m.agentTag ? AGENT_DEFS.find((a) => a.id === m.agentTag) : null;

        if (m.role === 'user') {
          return (
            <div key={`${i}-user`} className="flex flex-col items-end gap-1">
              {m.scope && (
                <span className="text-[10px] font-semibold text-n-text-muted uppercase tracking-wide">@{m.scope}</span>
              )}
              <div className={bubbleUser}>{m.text}</div>
            </div>
          );
        }

        return (
          <div key={`${i}-assistant`} className="flex items-start gap-2.5 w-full">
            <div
              className="shrink-0 rounded-md bg-white border border-n-border flex items-center justify-center overflow-hidden"
              style={{ width: compact ? 26 : 32, height: compact ? 26 : 32 }}
            >
              <AtlasMark size={compact ? 18 : 22} variant="ai" />
            </div>
            <div className="flex-1 min-w-0 max-w-[min(92%,560px)]">
              <div className={bubbleAssistant}>
                <AtlasMarkdown>{m.text}</AtlasMarkdown>
              </div>
              {m.citations && m.citations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.citations.map((c) => (
                    <CitationChip key={c.id} citation={c} accent={citationAccent} />
                  ))}
                </div>
              )}
              {gmail && (
                <div className="mt-2.5">
                  <GmailComposeButton
                    subject={m.title}
                    body={m.text}
                    citationIds={m.citations?.map((c) => c.id)}
                    uncertaintyFlags={m.uncertaintyFlags}
                    compact={gmailCompact}
                  />
                </div>
              )}
              {agentDef && onOpenAgent && (
                <button
                  type="button"
                  onClick={() => onOpenAgent(agentDef.id)}
                  className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer border-none"
                  style={{ background: agentDef.accentBg, color: agentDef.accent }}
                >
                  Open {agentDef.name} Agent →
                </button>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
