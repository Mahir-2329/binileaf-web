'use client';

import { useEffect, useRef, useState } from 'react';
import { scrollBehavior } from '@/lib/a11y';

/**
 * Mobile wayfinding for the menu: a chip rail pinned under the header that
 * keeps the category you are reading centred.
 *
 * Rendered outside `.shell` and outside the page grid on purpose — a sticky
 * element is bounded by its containing block, and inside an `items-start` grid
 * item it would have no travel and unstick on the first pixel of scroll.
 */
export default function CategoryChips({ groups }) {
  const [active, setActive] = useState(groups[0]?.id);
  const railRef = useRef(null);
  const userScrolledAt = useRef(0);

  useEffect(() => {
    const targets = groups.map((group) => document.getElementById(group.id)).filter(Boolean);
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-24% 0px -66% 0px', threshold: 0 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [groups]);

  // Centre the active chip — unless the reader is dragging the rail right now,
  // in which case the auto-centre would be fighting them.
  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.querySelector(`[data-chip="${active}"]`);
    if (!rail || !chip) return;
    if (performance.now() - userScrolledAt.current < 1200) return;

    const offset = chip.offsetLeft - rail.clientWidth / 2 + chip.clientWidth / 2;
    rail.scrollTo({ left: Math.max(0, offset), behavior: scrollBehavior() });
  }, [active]);

  const note = () => {
    userScrolledAt.current = performance.now();
  };

  /** Smooth is asked for here rather than set on `html`, so navigating
   *  between pages stays instant. */
  const jumpTo = (event, id) => {
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    setActive(id);
    target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div
      className="sticky z-30 border-b border-ink/15 bg-paper lg:hidden"
      style={{ top: 'var(--header-h)' }}
      data-menu-rail
    >
      <nav
        ref={railRef}
        aria-label="Menu categories"
        onPointerDown={note}
        onTouchStart={note}
        className="no-scrollbar flex gap-2 overflow-x-auto px-[var(--spacing-gutter)] py-2 [scroll-padding-inline:var(--spacing-gutter)]"
      >
        {groups.map((group) => (
          <a
            key={group.id}
            data-chip={group.id}
            href={`#${group.id}`}
            onClick={(event) => jumpTo(event, group.id)}
            className="chip shrink-0 snap-center"
            aria-current={active === group.id ? 'true' : undefined}
          >
            {group.title}
          </a>
        ))}
      </nav>
    </div>
  );
}
