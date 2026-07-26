import type { ReactElement } from 'react';

type BrandKey = 'google' | 'notion' | 'perplexity' | 'openai' | 'granola' | 'dovetail' | 'default';

interface Props {
  companyId: string;
  name: string;
  size?: number;
  className?: string;
}

const BRAND_BG: Record<BrandKey, string> = {
  google: '#FFFFFF',
  notion: '#FFFFFF',
  perplexity: '#FFFFFF',
  openai: '#000000',
  granola: '#F5E6D3',
  dovetail: '#6B4EFF',
  default: '#F4F4F5',
};

function resolveBrandKey(companyId: string, name: string): BrandKey {
  const id = companyId.toLowerCase();
  const n = name.toLowerCase();
  if (id === 'google' || n.includes('google')) return 'google';
  if (id === 'notion_ai' || n.includes('notion')) return 'notion';
  if (id === 'perplexity' || n.includes('perplexity')) return 'perplexity';
  if (n.includes('openai') || id.includes('openai')) return 'openai';
  if (id === 'granola' || n.includes('granola')) return 'granola';
  if (id === 'dovetail' || n.includes('dovetail')) return 'dovetail';
  return 'default';
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[62%] h-[62%]">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function NotionMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[62%] h-[62%]">
      <path
        fill="#000"
        d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z"
      />
    </svg>
  );
}

function PerplexityMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[58%] h-[58%]">
      <path
        fill="#20808D"
        d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z"
      />
    </svg>
  );
}

function OpenAIMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[58%] h-[58%]">
      <path
        fill="#fff"
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
      />
    </svg>
  );
}

function GranolaMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[58%] h-[58%]">
      <ellipse cx="12" cy="13" rx="7" ry="4.5" fill="#C4A574" />
      <path
        fill="#8B6914"
        d="M8 10.5c1.5-2 4.5-2 6 0 .8-1.2 2.5-1.8 4-1.2-1.2 2.2-3.5 3.5-6 3.5S7.2 11.5 6 9.3c1.5-.6 3.2 0 4 1.2Z"
      />
    </svg>
  );
}

function DovetailMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="w-[58%] h-[58%]">
      <path fill="#fff" d="M6 17V7l6-3 6 3v10l-6 3-6-3Z" opacity="0.95" />
      <path fill="#fff" d="M12 4v16M6 7l6 3 6-3M6 17l6-3 6 3" stroke="#6B4EFF" strokeWidth="0.6" />
    </svg>
  );
}

function DefaultMark({ letter }: { letter: string }) {
  return (
    <span className="text-[13px] font-semibold text-n-accent" aria-hidden>
      {letter}
    </span>
  );
}

const MARKS: Record<Exclude<BrandKey, 'default'>, () => ReactElement> = {
  google: GoogleMark,
  notion: NotionMark,
  perplexity: PerplexityMark,
  openai: OpenAIMark,
  granola: GranolaMark,
  dovetail: DovetailMark,
};

export function CompetitorBrandMark({ companyId, name, size = 40, className = '' }: Props) {
  const key = resolveBrandKey(companyId, name);
  const bg = BRAND_BG[key];
  const Mark = key === 'default' ? null : MARKS[key];

  return (
    <div
      className={`flex items-center justify-center shrink-0 overflow-hidden border border-n-border/60 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: bg,
      }}
      title={name}
      aria-hidden={key !== 'default'}
    >
      {Mark ? <Mark /> : <DefaultMark letter={name.slice(0, 1).toUpperCase()} />}
    </div>
  );
}
