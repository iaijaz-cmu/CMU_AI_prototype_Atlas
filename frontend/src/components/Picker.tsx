import { useState } from 'react';
import { useAtlas } from '../lib/AtlasContext';
import { AGENT_DEFS } from '../lib/data';
import type { AgentId } from '../lib/types';
import { AtlasMark } from './icons/AtlasMark';
import { AgentIllustrationCard } from './icons/AgentIllustration';
import { AppBubble } from './AppBubble';
import { FloatingChat } from './FloatingChat';
import { AtlasMarkdown } from './AtlasMarkdown';
import { CitationChip } from './CitationChip';

const STAT_STRIP = [
  { label: '38 KB documents', sub: 'indexed' },
  { label: '100% eval score', sub: 'Sprint 2' },
  { label: '$0.27/user/mo', sub: 'avg inference cost' },
  { label: '4 agents', sub: 'one workspace' },
];

export function Picker() {
  return (
    <div className="h-full flex flex-col overflow-y-auto relative">
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2.5">
          <AtlasMark size={32} />
          <span className="font-bold text-[17px] tracking-[-0.2px]">Atlas</span>
        </div>
        <div className="flex items-center gap-2 text-[12.5px] text-[#78716C]">
          <span
            className="w-[7px] h-[7px] rounded-full bg-emerald-500 inline-block"
            style={{ animation: 'atlas-pulse 2s ease-in-out infinite' }}
          />
          v0.3 · Sprint 2
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-16">
        <div className="text-center mb-8 max-w-[560px]">
          <div className="inline-flex items-center gap-2 text-[11.5px] font-semibold px-3.5 py-1.5 rounded-full border border-[#D6D3CB] text-[#78716C] mb-4.5 bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A8A29E] inline-block" />
            RAG-powered · Evidence-grounded · Human-approved
          </div>
          <h1 className="font-inherit text-[48px] leading-none font-normal m-0 mb-3.5 tracking-[-0.5px]">
            Hello, Ifra<span className="text-[#6D5BD0]">.</span>
          </h1>
          <p className="text-[#78716C] text-[17px] leading-normal m-0">
            Your workspace, your agents. Ask anything, or pick who you want working with you.
          </p>
        </div>

        <AskCard />

        <div className="grid gap-4 w-full max-w-[1040px]" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
          {AGENT_DEFS.map((ag) => (
            <AgentCard key={ag.id} agentId={ag.id} />
          ))}
        </div>

        <div className="flex items-center gap-0 mt-11 text-[13px] text-[#A8A29E]">
          {STAT_STRIP.map((st, i) => (
            <div
              key={st.label}
              className="px-5.5 text-center"
              style={{ borderLeft: i === 0 ? 'none' : '1px solid #E4E2DC', paddingLeft: i === 0 ? 0 : undefined }}
            >
              <p className="font-bold text-[#57534E] m-0 mb-0.5 text-[13.5px]">{st.label}</p>
              <p className="m-0 text-[11.5px]">{st.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <FloatingChat />
    </div>
  );
}

function AskCard() {
  const { state, onHeaderDraftChange, sendHeaderChat, toggleHeaderAppMenu, setHeaderScope, setChatMode } = useAtlas();
  const connected = state.integrations.filter((i) => i.status === 'connected');
  const shown = connected.slice(0, 2);
  const overflow = Math.max(0, connected.length - 2);
  const headerScopeLabel = state.headerScopeApp ? '@' + state.headerScopeApp : 'All apps';

  const modes: { id: 'ask' | 'research' | 'build'; label: string }[] = [
    { id: 'ask', label: 'Ask' },
    { id: 'research', label: 'Research' },
    { id: 'build', label: 'Build' },
  ];

  return (
    <div className="w-full max-w-[720px] mb-10">
      <div className="bg-white border border-[#E4E2DC] rounded-[22px] shadow-[0_12px_32px_rgba(0,0,0,0.06)] px-5.5 py-5">
        <input
          value={state.headerDraft}
          onChange={(e) => onHeaderDraftChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendHeaderChat()}
          placeholder="Ask or find anything from your workspace…"
          className="w-full box-border border-none outline-none text-[16px] text-[#18181B] font-inherit mb-4.5"
        />
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-1">
            {modes.map((m) => {
              const active = state.chatMode === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setChatMode(m.id)}
                  className="flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full cursor-pointer"
                  style={{ background: active ? '#F5F4F0' : 'transparent', color: active ? '#18181B' : '#A8A29E' }}
                >
                  <span>{m.label}</span>
                  {m.id === 'ask' && <span className="text-[9px] text-[#A8A29E]">▾</span>}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center">
              {shown.map((ic) => (
                <AppBubble key={ic.name} initial={ic.name[0]} color={ic.color} bg={ic.bg} overlap />
              ))}
              {overflow > 0 && <span className="text-[11px] text-[#A8A29E] ml-1">+{overflow}</span>}
            </div>
            <div className="relative">
              <div
                onClick={toggleHeaderAppMenu}
                className="flex items-center gap-1 text-[12.5px] text-[#57534E] cursor-pointer"
              >
                <span>{headerScopeLabel}</span>
                <span className="text-[9px] text-[#A8A29E]">▾</span>
              </div>
              {state.headerAppMenuOpen && (
                <div className="absolute bottom-[26px] right-0 w-[200px] bg-white border border-[#E4E2DC] rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.14)] p-1.5 z-[51]">
                  <div
                    onClick={toggleHeaderAppMenu}
                    className="px-2.5 py-1.5 rounded-lg text-xs text-[#57534E] cursor-pointer hover:bg-[#F5F4F0]"
                  >
                    All connected apps
                  </div>
                  {connected.map((app) => (
                    <div
                      key={app.name}
                      onClick={() => setHeaderScope(app.name)}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[#F5F4F0]"
                    >
                      <AppBubble initial={app.name[0]} color={app.color} bg={app.bg} size={18} radius={5} fontSize={9} />
                      <span className="text-xs text-[#3f3d38]">{app.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[#A8A29E] text-sm cursor-default">@</span>
            <span className="text-[#A8A29E] text-sm cursor-default">📎</span>
            <button
              onClick={sendHeaderChat}
              disabled={!state.headerDraft.trim() || state.headerChatLoading}
              className="w-8 h-8 rounded-full bg-[#18181B] text-white border-none cursor-pointer flex items-center justify-center text-sm"
              style={{ opacity: state.headerDraft.trim() && !state.headerChatLoading ? 1 : 0.5 }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>

      {(state.headerMessages.length > 0 || state.headerChatLoading) && (
        <div className="mt-3.5 bg-white border border-[#E4E2DC] rounded-2xl px-4 py-3.5 flex flex-col gap-2 max-h-[220px] overflow-y-auto text-left">
          {state.headerMessages.map((m, i) =>
            m.role === 'user' ? (
              <div
                key={i}
                className="self-end max-w-[85%] bg-[#18181B] text-white rounded-[11px_11px_3px_11px] px-2.5 py-2 text-[12.5px] leading-normal"
              >
                {m.text}
              </div>
            ) : (
              <div key={i} className="max-w-[88%]">
                <div className="bg-[#F5F4F0] rounded-[11px_11px_11px_3px] px-2.5 py-2 text-[12.5px] leading-normal text-[#3f3d38]">
                  <AtlasMarkdown>{m.text}</AtlasMarkdown>
                </div>
                {m.citations && m.citations.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {m.citations.map((c) => (
                      <CitationChip key={c.id} citation={c} accent="#6D5BD0" />
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
          {state.headerChatLoading && (
            <div className="bg-[#F5F4F0] rounded-[11px_11px_11px_3px] px-2.5 py-2 text-[12.5px] text-[#A8A29E] self-start">
              Thinking…
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AgentCard({ agentId }: { agentId: AgentId }) {
  const { goAgent } = useAtlas();
  const [hover, setHover] = useState(false);
  const def = AGENT_DEFS.find((a) => a.id === agentId)!;

  return (
    <div
      onClick={() => goAgent(agentId)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="bg-white rounded-2xl border overflow-hidden cursor-pointer"
      style={{
        borderColor: hover ? def.accent : '#E4E2DC',
        transform: hover ? 'translateY(-3px)' : 'none',
        boxShadow: hover ? `0 10px 30px ${def.shadowColor}` : 'none',
        transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s',
        animation: 'atlas-fadein 0.4s ease-out',
      }}
    >
      <div className="h-[160px] bg-[#F9F8F5] flex items-center justify-center p-4 box-border">
        <AgentIllustrationCard agentId={agentId} />
      </div>
      <div className="p-4.5">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[11px] font-bold tracking-[0.8px] uppercase"
            style={{ color: def.accent }}
          >
            {def.name}
          </span>
          <span style={{ color: def.accent }} className="text-sm">
            →
          </span>
        </div>
        <p className="font-bold text-sm m-0 mb-1.5 leading-snug text-[#18181B]">{def.tagline}</p>
        <p className="text-xs text-[#78716C] leading-normal m-0">{def.description}</p>
      </div>
      <div className="px-4.5 pb-4.5 grid gap-1.5" style={{ gridTemplateColumns: 'repeat(2,max-content)' }}>
        {def.tools.slice(1).map((t) => (
          <span
            key={t.id}
            className="text-[11.5px] font-medium px-3 py-1 rounded-full text-center"
            style={{ border: `1px solid ${def.accent}35`, color: def.accent, background: def.accentBg }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  );
}
