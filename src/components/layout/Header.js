'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import InstagramMark from '@/components/art/InstagramMark';
import { nav, contact, address, hours } from '@/data/site';
import { WordmarkImage, WordmarkInk, WordmarkMark, WordmarkMarkInk } from './Wordmark';
import MenuToggle from './MenuToggle';
import { cx } from '@/lib/utils';
import { trapTab, useBodyLock } from '@/lib/a11y';

/**
 * Sticky header. On the home page it starts transparent over the navy hero
 * and swaps to paper once you have scrolled past it; everywhere else it is
 * paper from the first frame. While the drawer is open the header belongs to
 * the drawer — same navy — so the two read as one surface.
 *
 * The header holds exactly two things on a phone: the mark and the trigger —
 * the wordmark takes over from 640px up. A third target across 360px would
 * crowd the one element that must not shrink; the call-to-action lives in the
 * bottom action bar instead.
 */

const DRAWER_FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Header({ brand }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const drawerRef = useRef(null);

  useBodyLock(open);

  // Only the home page starts transparent, and only until the hero scrolls by.
  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => setScrolled(window.scrollY > 80);
    const id = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('scroll', onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      // The close button lives in the header, outside the drawer, so it has to
      // be appended by hand — otherwise it is unreachable by keyboard.
      const inDrawer = [...(drawerRef.current?.querySelectorAll(DRAWER_FOCUSABLE) ?? [])];
      trapTab(event, [...inDrawer, triggerRef.current]);
    };

    document.addEventListener('keydown', onKeyDown);
    drawerRef.current?.querySelector('[data-drawer-first]')?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const onPaper = !open && (!isHome || scrolled);

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-[260ms]',
          onPaper
            ? 'border-b border-ink/15 bg-paper text-ink'
            : open
              ? 'on-navy border-b border-ink-wash bg-ink-deep text-paper'
              : 'on-navy border-b border-transparent text-paper'
        )}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        {/* A transparent header still needs a ground: a short scrim keeps the
            nav legible over whatever the hero photograph happens to be. */}
        {!onPaper && !open ? (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[260%]"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(180deg, color-mix(in oklab, var(--color-ink-deep) 92%, transparent) 0%, color-mix(in oklab, var(--color-ink-deep) 55%, transparent) 46%, transparent 100%)',
            }}
          />
        ) : null}

        <div className="shell relative flex h-[68px] items-center justify-between lg:h-[84px]">
          <Link
            href="/"
            className="inline-flex h-11 items-center"
            aria-label="Binileaf — home"
          >
            {/* On a phone the drawn wordmark has to hold its own next to the
                trigger; the cat-and-cup mark says the same thing in a third of
                the width, so the small screens get the mark and the wordmark
                comes back from 640px up. */}
            <span className="sm:hidden" aria-hidden="true">
              {onPaper ? (
                <WordmarkMarkInk width={26} />
              ) : (
                <WordmarkMark src={brand.mark} width={26} priority />
              )}
            </span>
            <span className="hidden sm:block" aria-hidden="true">
              {onPaper ? <WordmarkInk width={126} /> : <WordmarkImage src={brand.wordmark} width={126} priority />}
            </span>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex xl:gap-11" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={`tel:${contact.phone}`}
              className="t-label-lg transition-colors hover:text-stamp"
            >
              {contact.phoneDisplay}
            </a>
            <span
              className={cx('h-4 w-px', onPaper ? 'bg-ink/25' : 'bg-paper/30')}
              aria-hidden="true"
            />
            <a
              href="https://www.instagram.com/binileafofficial/"
              target="_blank"
              rel="noreferrer"
              aria-label="Binileaf on Instagram"
              className="transition-colors hover:text-stamp"
            >
              <InstagramMark size={18} />
            </a>
            <a
              href={address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className={cx('btn btn--sm', onPaper ? 'btn--secondary' : 'btn--outlineInverse')}
            >
              Directions
            </a>
          </div>

          <MenuToggle
            ref={triggerRef}
            open={open}
            tone={onPaper ? 'ink' : 'paper'}
            onClick={() => setOpen((v) => !v)}
            aria-controls="site-drawer"
          />
        </div>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      <div
        id="site-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className={cx(
          'on-navy fixed inset-0 z-40 flex flex-col overflow-y-auto overscroll-contain bg-ink-deep pt-[var(--header-h)] transition-[transform,visibility] duration-[260ms] lg:hidden',
          open ? 'visible translate-x-0' : 'invisible pointer-events-none translate-x-full'
        )}
        style={{ transitionTimingFunction: 'var(--ease-out)' }}
        aria-hidden={!open}
        inert={!open || undefined}
      >
        <div className="grain-dark flex min-h-full flex-col">
          <div
            className="shell flex flex-1 flex-col pt-6"
            style={{ paddingBottom: 'calc(48px + env(safe-area-inset-bottom, 0px))' }}
          >
            <ul>
              {nav.map((item, i) => (
                <li key={item.href} className="border-t border-ink-wash last:border-b">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    {...(i === 0 ? { 'data-drawer-first': '' } : {})}
                    className="flex items-baseline gap-4 py-[18px]"
                    style={{
                      transitionDelay: open ? `${i * 50}ms` : '0ms',
                      opacity: open ? 1 : 0,
                      transform: open ? 'none' : 'translateY(8px)',
                      transitionProperty: 'opacity, transform',
                      transitionDuration: '360ms',
                    }}
                  >
                    <span className="t-label text-paper-dim tabular">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="drawer-row">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-12">
              <div className="rule-brass pt-6" />
              <p className="t-small text-paper-dim">
                {address.street}
                <br />
                {address.locality}, {address.city} {address.postalCode}
              </p>
              <p className="t-small mt-3 text-paper-dim">
                {hours.daysDisplay} · {hours.display}
              </p>
              <a
                href={`tel:${contact.phone}`}
                className="link-rule mt-5 block w-fit py-[7px] font-[family-name:var(--font-display)] text-[1.5rem] font-medium text-paper"
              >
                {contact.phoneDisplay}
              </a>
              <a
                href="https://www.instagram.com/binileafofficial/"
                target="_blank"
                rel="noreferrer"
                className="t-label-lg mt-2 flex w-fit items-center gap-2 py-[11px] text-brass"
              >
                <InstagramMark size={15} />
                @binileafofficial
              </a>
              <a
                href={address.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn--sm btn--outlineInverse mt-6 w-full justify-start"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
