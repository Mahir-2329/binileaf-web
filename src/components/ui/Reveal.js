'use client';

import { useEffect, useRef } from 'react';

/**
 * One IntersectionObserver for the whole document. Elements opt in with
 * `data-reveal`; the observer flips `data-revealed` once and unobserves.
 * All the actual animation lives in globals.css, keyed off the attribute.
 */

let observer = null;

function getObserver() {
  if (observer || typeof window === 'undefined') return observer;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.dataset.revealed = 'true';
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -12% 0px' }
  );

  return observer;
}

export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Anything already on screen at mount should not wait for a scroll.
    const io = getObserver();
    if (!io) return;
    io.observe(node);
    return () => io.unobserve(node);
  }, []);

  return ref;
}

/**
 * Wrapper that reveals its children on scroll.
 * `delay` staggers siblings; `as` keeps the markup semantic.
 */
export default function Reveal({ as: Tag = 'div', delay = 0, className, style, children, ...rest }) {
  const ref = useReveal();

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={delay ? { ...style, '--reveal-delay': `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
