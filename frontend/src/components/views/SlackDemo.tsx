import { useCallback, useEffect, useState } from 'react';
import {
  AtlasApiError,
  fetchSlackMessages,
  fetchSlackStatus,
  slackRespond,
  type GenerateResult,
  type SlackMessage,
  type SlackStatus,
} from '../../lib/api';
import { GmailComposeButton } from '../GmailComposeButton';

const DEMO_PROMPTS = [
  'Summarize this Slack thread on payment failures and cite evidence from our org data.',
  'What Jira work should we prioritize based on this discussion?',
  'Draft a 3-bullet standup brief for the payments team from this channel.',
];

function displayUser(user?: string) {
  if (!user) return 'teammate';
  if (user.startsWith('U-')) return user.slice(2);
  return user.slice(0, 8);
}

export function SlackDemo() {
  const [status, setStatus] = useState<SlackStatus | null>(null);
  const [messages, setMessages] = useState<SlackMessage[]>([]);
  const [channelName, setChannelName] = useState('product-payments');
  const [demoMode, setDemoMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [question, setQuestion] = useState(DEMO_PROMPTS[0]);
  const [postToSlack, setPostToSlack] = useState(false);
  const [answering, setAnswering] = useState(false);
  const [answer, setAnswer] = useState<GenerateResult | null>(null);
  const [answerError, setAnswerError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const st = await fetchSlackStatus();
      setStatus(st);
      setDemoMode(st.demoMode ?? !st.configured);
      const data = await fetchSlackMessages(20);
      setMessages(data.messages);
      setChannelName(data.channel?.name ?? 'product-payments');
    } catch (e) {
      setLoadError(e instanceof AtlasApiError ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onAsk = async () => {
    const q = question.trim();
    if (!q || answering) return;
    setAnswering(true);
    setAnswer(null);
    setAnswerError(null);
    try {
      const result = await slackRespond(q, postToSlack && !demoMode);
      setAnswer(result);
    } catch (e) {
      setAnswerError(e instanceof AtlasApiError ? e.message : String(e));
    } finally {
      setAnswering(false);
    }
  };

  return (
    <section className="mt-8 bg-white border border-[#E4E2DC] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#E4E2DC] flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold m-0 flex items-center gap-2">
            <span className="text-[#4A154B]">#</span>
            {channelName}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F5EBF5] text-[#4A154B]">
              Slack × Atlas
            </span>
          </h2>
          <p className="text-[12px] text-[#78716C] m-0 mt-1">
            {demoMode
              ? 'Demo channel (sample thread). Add SLACK_BOT_TOKEN to api/.env for your workspace.'
              : 'Live messages from your connected Slack workspace.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {status?.eventsReady && !demoMode && (
            <span className="text-[11px] text-[#1A9E6E] font-medium">@Atlas mentions enabled</span>
          )}
          <button
            type="button"
            onClick={() => void refresh()}
            className="text-[11.5px] font-bold px-3 py-1.5 rounded-[9px] cursor-pointer border border-[#E4E2DC] bg-[#FAFAF8] text-[#3f3d38]"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <p className="px-5 py-4 text-[13px] text-[#78716C] m-0">Loading channel…</p>}
      {loadError && (
        <p className="px-5 py-4 text-[13px] text-[#B42318] m-0">⚠️ {loadError}</p>
      )}

      {!loading && !loadError && (
        <>
          <div className="px-4 py-3 max-h-[320px] overflow-y-auto bg-[#FAFAF8] space-y-3">
            {messages.map((m) => (
              <div key={m.ts} className="flex gap-2.5 items-start">
                <div className="w-8 h-8 rounded-lg bg-[#4A154B] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {displayUser(m.user).slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold m-0 text-[#1C1917]">{displayUser(m.user)}</p>
                  <p className="text-[13px] text-[#44403C] m-0 mt-0.5 leading-snug whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-4 border-t border-[#E4E2DC] bg-white">
            <p className="text-[12px] font-bold text-[#57534E] m-0 mb-2">Ask Atlas about this thread</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {DEMO_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setQuestion(p)}
                  className="text-[11px] px-2.5 py-1 rounded-lg border border-[#E4E2DC] bg-[#FAFAF8] text-[#57534E] cursor-pointer hover:border-[#4A154B]/30"
                >
                  {p.length > 52 ? `${p.slice(0, 52)}…` : p}
                </button>
              ))}
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="w-full text-[13px] border border-[#E4E2DC] rounded-xl px-3 py-2.5 resize-y focus:outline-none focus:border-[#4A154B]/40"
              placeholder="e.g. Summarize this Slack discussion on payment failures"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
              <label className="flex items-center gap-2 text-[12px] text-[#78716C] cursor-pointer">
                <input
                  type="checkbox"
                  checked={postToSlack}
                  disabled={demoMode}
                  onChange={(e) => setPostToSlack(e.target.checked)}
                />
                Post answer back to Slack
                {demoMode && <span className="text-[#A8A29E]">(requires live token)</span>}
              </label>
              <button
                type="button"
                onClick={() => void onAsk()}
                disabled={answering || !question.trim()}
                className="text-[13px] font-bold px-4 py-2 rounded-xl cursor-pointer text-white disabled:opacity-50"
                style={{ background: '#4A154B' }}
              >
                {answering ? 'Atlas is thinking…' : 'Run Atlas on thread'}
              </button>
            </div>

            {answerError && (
              <p className="text-[13px] text-[#B42318] mt-3 mb-0">⚠️ {answerError}</p>
            )}
            {answer && (
              <div className="mt-4 p-4 rounded-xl border border-[#E4E2DC] bg-[#FAFAF8]">
                <p className="text-[11px] font-bold text-[#4A154B] m-0 mb-2 uppercase tracking-wide">Atlas response</p>
                {answer.title && <p className="font-bold text-sm m-0 mb-2">{answer.title}</p>}
                <div className="text-[13px] text-[#292524] leading-relaxed whitespace-pre-wrap">{answer.body}</div>
                {answer.citations.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {answer.citations.map((c) => (
                      <span
                        key={c.id}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-[#E4E2DC] text-[#57534E]"
                      >
                        {c.id}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  <GmailComposeButton
                    subject={answer.title ?? 'Atlas · Slack thread summary'}
                    body={answer.body}
                    citationIds={answer.citations.map((c) => c.id)}
                    uncertaintyFlags={answer.uncertaintyFlags}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
