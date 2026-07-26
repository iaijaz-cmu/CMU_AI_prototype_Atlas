import { useState } from 'react';
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
  /** Allow editing user prompts (ChatGPT-style); removes later turns and regenerates */
  editableUserMessages?: boolean;
  onEditUserMessage?: (messageIndex: number, newText: string) => void;
  editDisabled?: boolean;
}

const messageActionBtn =
  'flex items-center justify-center w-7 h-7 shrink-0 rounded-lg border border-transparent bg-transparent text-n-text-muted cursor-pointer hover:bg-n-surface-2 hover:text-n-text hover:border-n-border transition-colors mb-0.5';

function EditableUserMessage({
  text,
  scope,
  bubbleClass,
  messageIndex,
  onEdit,
  editDisabled,
}: {
  text: string;
  scope?: string | null;
  bubbleClass: string;
  messageIndex: number;
  onEdit: (index: number, newText: string) => void;
  editDisabled?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  if (editing) {
    return (
      <div className="flex flex-col items-end gap-2 w-full max-w-[min(88%,520px)]">
        {scope && (
          <span className="text-[10px] font-semibold text-n-text-muted uppercase tracking-wide self-end">
            @{scope}
          </span>
        )}
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={Math.min(8, Math.max(2, draft.split('\n').length))}
          className="w-full box-border rounded-xl border border-n-border-strong bg-white px-3 py-2.5 text-[13px] text-n-text outline-none resize-y min-h-[72px] font-inherit leading-relaxed shadow-sm"
          autoFocus
        />
        <div className="flex items-center gap-2 self-end">
          <button
            type="button"
            onClick={() => {
              setDraft(text);
              setEditing(false);
            }}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-n-border bg-white text-n-text-2 cursor-pointer hover:bg-n-surface-2"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!draft.trim() || editDisabled}
            onClick={() => {
              const next = draft.trim();
              if (!next) return;
              onEdit(messageIndex, next);
              setEditing(false);
            }}
            className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border-none cursor-pointer text-white disabled:opacity-40"
            style={{ background: theme.accent }}
          >
            Save & resend
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col items-end gap-1 max-w-full">
      {scope && (
        <span className="text-[10px] font-semibold text-n-text-muted uppercase tracking-wide">@{scope}</span>
      )}
      <div className="flex items-end gap-1 max-w-full">
        <div className="flex items-end gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mb-0.5">
          <button
            type="button"
            onClick={copyText}
            className={messageActionBtn}
            aria-label={copied ? 'Copied' : 'Copy message'}
            title={copied ? 'Copied' : 'Copy message'}
          >
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden strokeLinecap="round" strokeLinejoin="round">
                <rect x="5.5" y="5.5" width="7.5" height="7.5" rx="1.2" stroke="currentColor" strokeWidth="1.35" />
                <path d="M4 10.5V3.8A1.3 1.3 0 015.3 2.5H10" stroke="currentColor" strokeWidth="1.35" />
              </svg>
            )}
          </button>
          {!editDisabled && (
            <button
              type="button"
              onClick={() => {
                setDraft(text);
                setEditing(true);
              }}
              className={messageActionBtn}
              aria-label="Edit message"
              title="Edit message"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden strokeLinecap="round" strokeLinejoin="round">
                <path
                  d="M11.5 2.5l2 2L5.5 12.5H3.5v-2L11.5 2.5z"
                  stroke="currentColor"
                  strokeWidth="1.35"
                />
              </svg>
            </button>
          )}
        </div>
        <div className={bubbleClass}>{text}</div>
      </div>
    </div>
  );
}

export function ChatMessageList({
  messages,
  compact = false,
  citationAccent = theme.ai,
  showGmail = true,
  gmailCompact = true,
  onOpenAgent,
  editableUserMessages = false,
  onEditUserMessage,
  editDisabled = false,
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
          const canEdit = editableUserMessages && onEditUserMessage;
          return (
            <div key={`${i}-user`} className="flex flex-col items-end gap-1 w-full">
              {canEdit ? (
                <EditableUserMessage
                  text={m.text}
                  scope={m.scope}
                  bubbleClass={bubbleUser}
                  messageIndex={i}
                  onEdit={onEditUserMessage}
                  editDisabled={editDisabled}
                />
              ) : (
                <>
                  {m.scope && (
                    <span className="text-[10px] font-semibold text-n-text-muted uppercase tracking-wide">
                      @{m.scope}
                    </span>
                  )}
                  <div className={bubbleUser}>{m.text}</div>
                </>
              )}
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
