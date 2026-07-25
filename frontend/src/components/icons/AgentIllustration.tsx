import type { AgentId } from '../../lib/types';

export function AgentIllustrationCard({ agentId }: { agentId: AgentId }) {
  if (agentId === 'product') {
    return (
      <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
        <rect x="20" y="30" width="100" height="70" rx="8" stroke="#18181B" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1="20" y1="48" x2="120" y2="48" stroke="#18181B" strokeWidth="1.5" />
        <rect x="30" y="56" width="40" height="6" rx="3" fill="#6D5BD0" opacity="0.3" />
        <rect x="30" y="68" width="60" height="4" rx="2" fill="#18181B" opacity="0.1" />
        <rect x="30" y="76" width="50" height="4" rx="2" fill="#18181B" opacity="0.1" />
        <rect x="30" y="84" width="55" height="4" rx="2" fill="#18181B" opacity="0.1" />
        <circle cx="155" cy="60" r="28" stroke="#18181B" strokeWidth="1.5" />
        <path d="M145 60 L153 68 L167 52" stroke="#6D5BD0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="155" cy="60" r="4" fill="#6D5BD0" opacity="0.15" />
        <line x1="115" y1="90" x2="130" y2="75" stroke="#18181B" strokeWidth="1" strokeDasharray="3 2" opacity="0.4" />
        <circle cx="40" cy="125" r="5" stroke="#18181B" strokeWidth="1.5" />
        <circle cx="70" cy="118" r="5" stroke="#18181B" strokeWidth="1.5" />
        <circle cx="100" cy="122" r="5" stroke="#18181B" strokeWidth="1.5" />
        <circle cx="130" cy="110" r="5" stroke="#18181B" strokeWidth="1.5" />
        <polyline points="40,125 70,118 100,122 130,110" stroke="#6D5BD0" strokeWidth="1.5" fill="none" opacity="0.6" />
        <line x1="30" y1="135" x2="170" y2="135" stroke="#18181B" strokeWidth="1" opacity="0.2" />
      </svg>
    );
  }
  if (agentId === 'engineering') {
    return (
      <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
        <rect x="15" y="20" width="170" height="110" rx="8" stroke="#18181B" strokeWidth="1.5" />
        <rect x="15" y="20" width="170" height="24" rx="8" fill="#18181B" opacity="0.05" />
        <circle cx="30" cy="32" r="4" fill="#1A9E6E" opacity="0.5" />
        <circle cx="44" cy="32" r="4" fill="#D4640A" opacity="0.4" />
        <circle cx="58" cy="32" r="4" fill="#18181B" opacity="0.15" />
        <text x="28" y="60" fontSize="9" fill="#1A9E6E" fontFamily="monospace" opacity="0.8">{'{'}</text>
        <text x="36" y="70" fontSize="9" fill="#18181B" fontFamily="monospace" opacity="0.6">retrieve(query)</text>
        <text x="36" y="80" fontSize="9" fill="#6D5BD0" fontFamily="monospace" opacity="0.7">rerank(top_k=5)</text>
        <text x="36" y="90" fontSize="9" fill="#D4640A" fontFamily="monospace" opacity="0.7">generate(prd)</text>
        <text x="28" y="100" fontSize="9" fill="#1A9E6E" fontFamily="monospace" opacity="0.8">{'}'}</text>
        <line x1="130" y1="48" x2="170" y2="48" stroke="#18181B" strokeWidth="1" opacity="0.15" />
        <line x1="130" y1="56" x2="160" y2="56" stroke="#18181B" strokeWidth="1" opacity="0.1" />
        <line x1="130" y1="64" x2="165" y2="64" stroke="#18181B" strokeWidth="1" opacity="0.1" />
        <rect x="130" y="80" width="40" height="30" rx="4" stroke="#1A9E6E" strokeWidth="1.2" strokeDasharray="3 2" />
        <text x="138" y="98" fontSize="8" fill="#1A9E6E" fontFamily="monospace">ADR-042</text>
        <line x1="40" y1="115" x2="180" y2="115" stroke="#18181B" strokeWidth="1" opacity="0.1" />
      </svg>
    );
  }
  if (agentId === 'market') {
    return (
      <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
        <circle cx="100" cy="78" r="55" stroke="#18181B" strokeWidth="1.5" strokeDasharray="5 3" />
        <circle cx="100" cy="78" r="35" stroke="#18181B" strokeWidth="1" opacity="0.3" />
        <circle cx="100" cy="78" r="15" stroke="#D4640A" strokeWidth="1.5" />
        <circle cx="100" cy="78" r="4" fill="#D4640A" />
        <line x1="100" y1="23" x2="100" y2="133" stroke="#18181B" strokeWidth="1" opacity="0.15" />
        <line x1="45" y1="78" x2="155" y2="78" stroke="#18181B" strokeWidth="1" opacity="0.15" />
        <circle cx="68" cy="48" r="8" fill="#6D5BD0" opacity="0.2" stroke="#6D5BD0" strokeWidth="1.2" />
        <text x="63" y="51" fontSize="7" fill="#6D5BD0" fontWeight="600">A</text>
        <circle cx="148" cy="55" r="10" fill="#1A9E6E" opacity="0.15" stroke="#1A9E6E" strokeWidth="1.2" />
        <text x="142" y="58" fontSize="7" fill="#1A9E6E" fontWeight="600">B</text>
        <circle cx="58" cy="110" r="6" fill="#D4640A" opacity="0.2" stroke="#D4640A" strokeWidth="1.2" />
        <text x="54" y="113" fontSize="7" fill="#D4640A" fontWeight="600">C</text>
        <line x1="68" y1="52" x2="88" y2="68" stroke="#18181B" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
        <line x1="140" y1="60" x2="112" y2="72" stroke="#18181B" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      <path d="M30 120 L30 60 L80 40 L130 70 L180 30" stroke="#0F7FBE" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="120" r="4" fill="#0F7FBE" />
      <circle cx="80" cy="40" r="4" fill="#0F7FBE" />
      <circle cx="130" cy="70" r="4" fill="#0F7FBE" />
      <circle cx="180" cy="30" r="4" fill="#0F7FBE" />
      <path d="M30 120 L30 60 L80 40 L130 70 L180 30 L180 140 L30 140 Z" fill="#0F7FBE" opacity="0.05" />
      <rect x="42" y="80" width="28" height="50" rx="3" stroke="#18181B" strokeWidth="1.2" fill="white" opacity="0.8" />
      <rect x="44" y="88" width="24" height="3" rx="1.5" fill="#18181B" opacity="0.15" />
      <rect x="44" y="94" width="18" height="3" rx="1.5" fill="#18181B" opacity="0.1" />
      <rect x="80" y="95" width="28" height="35" rx="3" stroke="#18181B" strokeWidth="1.2" fill="white" opacity="0.8" />
      <rect x="82" y="103" width="24" height="3" rx="1.5" fill="#18181B" opacity="0.15" />
      <rect x="118" y="100" width="28" height="30" rx="3" stroke="#18181B" strokeWidth="1.2" fill="white" opacity="0.8" />
      <path d="M165 22 L178 18 L174 30" stroke="#0F7FBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="30" y1="140" x2="180" y2="140" stroke="#18181B" strokeWidth="1" opacity="0.2" />
    </svg>
  );
}

export function AgentIllustrationSmall({ agentId, accent }: { agentId: AgentId; accent: string }) {
  if (agentId === 'product') {
    return (
      <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
        <rect x="20" y="30" width="100" height="70" rx="8" stroke="#18181B" strokeWidth="1.5" strokeDasharray="4 2" />
        <circle cx="155" cy="60" r="28" stroke="#18181B" strokeWidth="1.5" />
        <path d="M145 60 L153 68 L167 52" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="40" cy="125" r="5" stroke="#18181B" strokeWidth="1.5" />
        <circle cx="70" cy="118" r="5" stroke="#18181B" strokeWidth="1.5" />
        <circle cx="100" cy="122" r="5" stroke="#18181B" strokeWidth="1.5" />
        <circle cx="130" cy="110" r="5" stroke="#18181B" strokeWidth="1.5" />
        <polyline points="40,125 70,118 100,122 130,110" stroke={accent} strokeWidth="1.5" fill="none" opacity="0.6" />
      </svg>
    );
  }
  if (agentId === 'engineering') {
    return (
      <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
        <rect x="15" y="20" width="170" height="110" rx="8" stroke="#18181B" strokeWidth="1.5" />
        <rect x="15" y="20" width="170" height="24" rx="8" fill="#18181B" opacity="0.05" />
        <text x="28" y="60" fontSize="9" fill={accent} fontFamily="monospace" opacity="0.8">{'{'}</text>
        <text x="36" y="70" fontSize="9" fill="#18181B" fontFamily="monospace" opacity="0.6">retrieve(query)</text>
        <text x="36" y="80" fontSize="9" fill={accent} fontFamily="monospace" opacity="0.7">rerank(top_k=5)</text>
        <rect x="130" y="80" width="40" height="30" rx="4" stroke={accent} strokeWidth="1.2" strokeDasharray="3 2" />
      </svg>
    );
  }
  if (agentId === 'market') {
    return (
      <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
        <circle cx="100" cy="78" r="55" stroke="#18181B" strokeWidth="1.5" strokeDasharray="5 3" />
        <circle cx="100" cy="78" r="35" stroke="#18181B" strokeWidth="1" opacity="0.3" />
        <circle cx="100" cy="78" r="15" stroke={accent} strokeWidth="1.5" />
        <circle cx="100" cy="78" r="4" fill={accent} />
        <circle cx="68" cy="48" r="8" fill="#6D5BD0" opacity="0.2" stroke="#6D5BD0" strokeWidth="1.2" />
        <circle cx="148" cy="55" r="10" fill="#1A9E6E" opacity="0.15" stroke="#1A9E6E" strokeWidth="1.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
      <path d="M30 120 L30 60 L80 40 L130 70 L180 30" stroke={accent} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="120" r="4" fill={accent} />
      <circle cx="80" cy="40" r="4" fill={accent} />
      <circle cx="130" cy="70" r="4" fill={accent} />
      <circle cx="180" cy="30" r="4" fill={accent} />
      <rect x="42" y="80" width="28" height="50" rx="3" stroke="#18181B" strokeWidth="1.2" fill="white" opacity="0.8" />
      <rect x="80" y="95" width="28" height="35" rx="3" stroke="#18181B" strokeWidth="1.2" fill="white" opacity="0.8" />
      <rect x="118" y="100" width="28" height="30" rx="3" stroke="#18181B" strokeWidth="1.2" fill="white" opacity="0.8" />
    </svg>
  );
}
