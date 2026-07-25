import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, PRD_EXAMPLES, PRD_STEP_LABELS } from '../../lib/data';
import { AtlasMarkdown } from '../AtlasMarkdown';
import { CitationChip } from '../CitationChip';
import { ConfidenceBadge } from '../ConfidenceBadge';
import { GmailComposeButton } from '../GmailComposeButton';

export function PRD() {
  const { state, onPrdPromptChange, quickFillPrd, runPrd } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const result = state.prdResult;

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">PRD Generator</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">
        Describe a feature — Atlas retrieves org context and drafts a grounded, cited PRD
      </p>

      <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5 mb-4.5">
        <textarea
          value={state.prdPrompt}
          onChange={(e) => onPrdPromptChange(e.target.value)}
          placeholder="Describe the feature… e.g. 'Unified notification controls for enterprise users'"
          className="w-full box-border min-h-[64px] border-none text-sm font-inherit resize-none outline-none text-[#18181B]"
        />
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#F0EEE8]">
          <div className="flex flex-wrap gap-1.5">
            {PRD_EXAMPLES.map((ex) => (
              <div
                key={ex}
                onClick={() => quickFillPrd(ex)}
                className="text-[11.5px] px-2.5 py-1.5 rounded-full border border-[#E4E2DC] text-[#78716C] cursor-pointer hover:border-[#A8A29E]"
              >
                {ex}
              </div>
            ))}
          </div>
          <button
            onClick={runPrd}
            disabled={state.prdGenerating || !state.prdPrompt.trim()}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-[11px] text-[13px] font-bold text-white border-none cursor-pointer"
            style={{ background: def.accent, opacity: state.prdGenerating || !state.prdPrompt.trim() ? 0.6 : 1 }}
          >
            {state.prdGenerating && (
              <div
                className="w-3 h-3 rounded-full border-2 border-white/40"
                style={{ borderTopColor: '#fff', animation: 'atlas-spin 0.8s linear infinite' }}
              />
            )}
            <div>{state.prdGenerating ? 'Generating…' : 'Generate'}</div>
          </button>
        </div>
      </div>

      {state.prdError && (
        <div className="rounded-2xl px-4.5 py-3.5 mb-4.5 bg-[#FEF2F2] border border-[#FECACA] text-[#dc2626] text-[13px]">
          {state.prdError}
        </div>
      )}

      {state.prdGenerating && (
        <div
          className="rounded-2xl p-4.5 mb-4.5 flex flex-col gap-2.5"
          style={{ background: def.accentBg, border: `1px solid ${def.accent}30` }}
        >
          {PRD_STEP_LABELS.map((label, i) => {
            const done = i < state.prdStep;
            const opacity = i < state.prdStep ? 1 : i === state.prdStep ? 0.7 : 0.3;
            return (
              <div key={label} className="flex items-center gap-2 text-[13px]" style={{ color: def.accent, opacity }}>
                {done && <span>✓</span>}
                <div className="w-[9px] h-[9px] rounded-full shrink-0" style={{ border: `1.4px solid ${def.accent}` }} />
                <span>{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {result && (
        <div className="bg-white border border-[#E4E2DC] rounded-2xl overflow-hidden">
          <div className="px-5.5 py-4.5 border-b border-[#F0EEE8]">
            <div className="flex items-center gap-2 text-[11px] text-[#A8A29E] mb-1.5">
              <span className="font-mono">{def.name} · v0.3</span>
              {result.confidence && <ConfidenceBadge confidence={result.confidence} />}
            </div>
            <h2 className="text-[16px] font-bold m-0 mb-2">{result.title ?? state.prdPrompt}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <GmailComposeButton
                subject={result.title ?? `PRD: ${state.prdPrompt}`}
                body={result.body}
                citationIds={result.citations.map((c) => c.id)}
                uncertaintyFlags={result.uncertaintyFlags}
              />
            </div>
            {result.citations.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {result.citations.map((c) => (
                  <CitationChip key={c.id} citation={c} accent={def.accent} />
                ))}
              </div>
            )}
          </div>

          <div className="p-5.5">
            <AtlasMarkdown>{result.body}</AtlasMarkdown>
          </div>

          {result.uncertaintyFlags ? (
            <div className="mx-5.5 mb-5.5 rounded-xl px-4 py-3 bg-[#FFF4EA] border border-[#F5D9B4] text-[#92400e] text-[12.5px] leading-snug">
              <p className="font-bold m-0 mb-1">⚠ Uncertainty Flags</p>
              <p className="m-0">{result.uncertaintyFlags}</p>
            </div>
          ) : (
            <div className="mx-5.5 mb-5.5 flex items-center gap-2 text-xs text-[#0d9668] bg-[#EDFAF4] rounded-xl px-4 py-2.5">
              <span>🛡</span> No uncertainty flags — sufficient source coverage detected
            </div>
          )}
        </div>
      )}
    </div>
  );
}
