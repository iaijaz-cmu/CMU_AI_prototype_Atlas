import { useAtlas } from '../../lib/AtlasContext';
import { AGENT_DEFS, TECH_SPEC_EXAMPLES } from '../../lib/data';
import { AtlasMarkdown } from '../AtlasMarkdown';
import { CitationChip } from '../CitationChip';
import { ConfidenceBadge } from '../ConfidenceBadge';
import { GmailComposeButton } from '../GmailComposeButton';

export function TechSpec() {
  const { state, onTechSpecPromptChange, quickFillTechSpec, runTechSpec } = useAtlas();
  const def = AGENT_DEFS.find((a) => a.id === state.currentAgentId) ?? AGENT_DEFS[0];
  const result = state.techSpecResult;

  return (
    <div className="p-7 max-w-[900px] mx-auto">
      <h1 className="text-xl font-bold m-0 mb-1">Tech Spec Generator</h1>
      <p className="text-[13px] text-[#78716C] m-0 mb-5.5">Turn PRDs into implementation-ready technical specifications</p>

      <div className="bg-white border border-[#E4E2DC] rounded-2xl p-4.5 mb-4.5">
        <textarea
          value={state.techSpecPrompt}
          onChange={(e) => onTechSpecPromptChange(e.target.value)}
          placeholder="Describe what needs a tech spec…"
          className="w-full box-border min-h-[48px] border-none text-[13.5px] font-inherit resize-none outline-none text-[#3f3d38]"
        />
        <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#F0EEE8]">
          <div className="flex flex-wrap gap-1.5">
            {TECH_SPEC_EXAMPLES.map((ex) => (
              <div
                key={ex}
                onClick={() => quickFillTechSpec(ex)}
                className="text-[11.5px] px-2.5 py-1.5 rounded-full border border-[#E4E2DC] text-[#78716C] cursor-pointer hover:border-[#A8A29E]"
              >
                {ex}
              </div>
            ))}
          </div>
          <button
            onClick={runTechSpec}
            disabled={state.techSpecGenerating || !state.techSpecPrompt.trim()}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-[11px] text-[13px] font-bold text-white border-none cursor-pointer"
            style={{ background: def.accent, opacity: state.techSpecGenerating || !state.techSpecPrompt.trim() ? 0.6 : 1 }}
          >
            {state.techSpecGenerating && (
              <div
                className="w-3 h-3 rounded-full border-2 border-white/40"
                style={{ borderTopColor: '#fff', animation: 'atlas-spin 0.8s linear infinite' }}
              />
            )}
            <div>{state.techSpecGenerating ? 'Generating…' : 'Generate Spec'}</div>
          </button>
        </div>
      </div>

      {state.techSpecError && (
        <div className="rounded-2xl px-4.5 py-3.5 mb-4.5 bg-[#FEF2F2] border border-[#FECACA] text-[#dc2626] text-[13px]">
          {state.techSpecError}
        </div>
      )}

      {result && (
        <div className="bg-white border border-[#E4E2DC] rounded-2xl overflow-hidden">
          <div className="px-5.5 py-4.5 border-b border-[#F0EEE8]">
            <div className="flex items-center gap-2 text-[11px] text-[#A8A29E] mb-1.5">
              <span className="font-mono">{def.name} · v0.3</span>
              {result.confidence && <ConfidenceBadge confidence={result.confidence} />}
            </div>
            <h2 className="text-[15px] font-bold m-0 mb-2">{result.title ?? state.techSpecPrompt}</h2>
            <div className="mb-2">
              <GmailComposeButton
                subject={result.title ?? `Tech spec: ${state.techSpecPrompt}`}
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

          {result.uncertaintyFlags && (
            <div className="mx-5.5 mb-5.5 rounded-xl px-4 py-3 bg-[#FFF4EA] border border-[#F5D9B4] text-[#92400e] text-[12.5px] leading-snug">
              <p className="font-bold m-0 mb-1">⚠ Uncertainty Flags</p>
              <p className="m-0">{result.uncertaintyFlags}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
