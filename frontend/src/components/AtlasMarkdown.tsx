import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

const components: Components = {
  h1: ({ children }) => <h2 className="text-[16px] font-bold mt-4 mb-2 first:mt-0">{children}</h2>,
  h2: ({ children }) => <h2 className="text-[16px] font-bold mt-4 mb-2 first:mt-0">{children}</h2>,
  h3: ({ children }) => <h3 className="text-[13.5px] font-bold mt-3.5 mb-1.5 first:mt-0">{children}</h3>,
  p: ({ children }) => <p className="text-[13.5px] text-[#3f3d38] leading-[1.7] m-0 mb-2.5">{children}</p>,
  ul: ({ children }) => <ul className="m-0 mb-2.5 pl-5 flex flex-col gap-1.5">{children}</ul>,
  ol: ({ children }) => <ol className="m-0 mb-2.5 pl-5 flex flex-col gap-1.5">{children}</ol>,
  li: ({ children }) => <li className="text-[13.5px] text-[#3f3d38] leading-[1.6]">{children}</li>,
  strong: ({ children }) => <strong className="font-bold text-[#18181B]">{children}</strong>,
  code: ({ children }) => (
    <code className="font-mono text-[12px] bg-[#F5F4F0] rounded px-1 py-0.5">{children}</code>
  ),
};

export function AtlasMarkdown({ children }: { children: string }) {
  return <ReactMarkdown components={components}>{children}</ReactMarkdown>;
}
