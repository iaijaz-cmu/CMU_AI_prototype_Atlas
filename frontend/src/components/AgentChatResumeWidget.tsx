import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import type { AgentId } from '../lib/types';

interface Props {
  agentId: AgentId;
  accent: string;
  accentBg: string;
}

export function AgentChatResumeWidget({ agentId, accent, accentBg }: Props) {
  const { state, openInlineChat, onHeaderDraftChange } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === agentId)!;
  const thread = state.headerThreads[agentId] ?? [];
  const lastUser = [...thread].reverse().find((m) => m.role === 'user');
  const lastAssistant = [...thread].reverse().find((m) => m.role === 'assistant');
  const preview = lastAssistant?.text ?? lastUser?.text;

  if (thread.length === 0) {
    return (
      <section className="bg-white border border-[#E4E2DC] rounded-2xl p-5 mb-5">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#A8A29E] m-0 mb-2">Chat with {def.name}</p>
        <h2 className="text-[16px] font-bold m-0 mb-1">Start a conversation</h2>
        <p className="text-[13px] text-[#78716C] m-0 mb-3">
          Use chat below or the Ask bar on the homepage — your thread appears here and in full chat view.
        </p>
        <button
          type="button"
          onClick={openInlineChat}
          className="text-[12px] font-bold px-3 py-2 rounded-lg border-none cursor-pointer text-white"
          style={{ background: accent }}
        >
          Open chat
        </button>
      </section>
    );
  }

  const snippet =
    preview && preview.length > 220 ? `${preview.slice(0, 220).trim()}…` : preview ?? '';

  return (
    <section className="bg-white border border-[#E4E2DC] rounded-2xl p-5 mb-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide m-0 mb-1" style={{ color: accent }}>
            Chat history
          </p>
          <h2 className="text-[17px] font-bold m-0 leading-snug">Pick up where you left off</h2>
          <p className="text-[12px] text-[#78716C] m-0 mt-1">
            {thread.length} message{thread.length === 1 ? '' : 's'} with {def.name} Agent · saved in this browser
          </p>
        </div>
        <button
          type="button"
          onClick={openInlineChat}
          className="text-[12px] font-bold px-3 py-2 rounded-lg cursor-pointer border-none text-white shrink-0"
          style={{ background: accent }}
        >
          Continue chat
        </button>
      </div>

      <div className="rounded-xl p-3.5 max-h-[200px] overflow-y-auto flex flex-col gap-2.5" style={{ background: accentBg }}>
        {thread.slice(-4).map((m, i) => (
          <div key={i} className="text-[13px] leading-snug">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#78716C] mr-2">
              {m.role === 'user' ? 'You' : def.name}
            </span>
            <span className="text-[#3f3d38]">{m.text.length > 160 ? `${m.text.slice(0, 160)}…` : m.text}</span>
          </div>
        ))}
      </div>

      {lastUser && (
        <button
          type="button"
          onClick={() => {
            onHeaderDraftChange(`Follow up: ${lastUser.text.slice(0, 120)}`);
            openInlineChat();
          }}
          className="mt-3 text-[12px] font-semibold px-0 py-0 border-none bg-transparent cursor-pointer hover:underline"
          style={{ color: accent }}
        >
          Reply to last question →
        </button>
      )}

      {snippet && thread.length > 0 && (
        <p className="text-[11px] text-[#A8A29E] m-0 mt-2 italic truncate">Latest: {snippet}</p>
      )}
    </section>
  );
}
