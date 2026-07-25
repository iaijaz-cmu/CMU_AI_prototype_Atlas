import { useEffect, useRef, type DependencyList } from 'react';

/** Keeps scroll pinned to the latest message (bottom), ChatGPT-style. */
export function useChatScroll(deps: DependencyList) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, deps);

  return { bottomRef, containerRef };
}
