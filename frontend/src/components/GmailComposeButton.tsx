import { formatBodyForEmail, openGmailCompose } from '../lib/gmail';
import { IntegrationLogo } from './IntegrationLogo';

interface Props {
  subject?: string | null;
  body: string;
  citationIds?: string[];
  uncertaintyFlags?: string | null;
  compact?: boolean;
}

export function GmailComposeButton({ subject, body, citationIds, uncertaintyFlags, compact }: Props) {
  const onClick = () => {
    openGmailCompose({
      subject: subject?.trim() || 'Atlas summary',
      body: formatBodyForEmail(body, {
        citations: citationIds,
        uncertainty: uncertaintyFlags,
      }),
    });
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#E4E2DC] bg-white text-[#57534E] cursor-pointer hover:border-[#EA4335]/40 hover:text-[#EA4335]"
      >
        <IntegrationLogo icon="gmail" bg="#FCE8E6" size={16} radius={4} />
        Gmail
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-[12.5px] font-bold px-3.5 py-2 rounded-xl border-none cursor-pointer text-white shadow-sm"
      style={{ background: 'linear-gradient(180deg, #EA4335 0%, #D93025 100%)' }}
    >
      <IntegrationLogo icon="gmail" bg="#fff" size={20} radius={5} />
      Open in Gmail
    </button>
  );
}
