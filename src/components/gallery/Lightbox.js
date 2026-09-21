'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { prefersReducedMotion, trapTab, useBodyLock } from '@/lib/a11y';

/**
 * Full-screen viewer for one frame.
 *
 * Two arrangements of the same parts. On a phone the controls sit in the
 * bottom two corners, because that is the only part of the screen a thumb
 * reliably reaches. On a pointer screen they move to the vertical centre of
 * each side, where the eye expects them, and the chrome is held to a column
 * rather than sprawling across a 2000px display.
 *
 * The ground is opaque: a translucent backdrop leaves the site header and the
 * sheet ghosting through, which reads as a rendering fault rather than depth.
 *
 * It is portalled to `document.body` rather than rendered where it is called.
 * That is not tidiness — the dialog marks `#main` inert while it is open, and
 * rendering inside `#main` would make the dialog inert as well, which is
 * exactly the bug where none of its controls responded.
 *
 * Swipe is additive: horizontal pages, a downward pull dismisses, and the
 * buttons stay in the DOM as the accessible path.
 */

const SWIPE_COMMIT = 0.22; // of the wrapper width
const FLICK_X = 0.5; // px/ms
const DISMISS_PULL = 0.16; // of the wrapper height
const FLICK_Y = 0.6; // px/ms
const DEAD_ZONE = 10; // px before an axis is locked

export default function Lightbox({ images, index, onClose, onStep }) {
  const image = images[index];

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const wrapRef = useRef(null);

  const gesture = useRef({ startX: 0, startY: 0, startT: 0, dx: 0, dy: 0, axis: 'none', on: false });

  // The portal target only exists on the client.
  const [host, setHost] = useState(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHost(document.body));
    return () => cancelAnimationFrame(id);
  }, []);

  useBodyLock(true);

  const atStart = index === 0;
  const atEnd = index === images.length - 1;

  /* ── keyboard ─────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') return onClose();
      if (event.key === 'ArrowRight') return onStep(1);
      if (event.key === 'ArrowLeft') return onStep(-1);
      trapTab(event, [closeRef.current, prevRef.current, nextRef.current]);
    };

    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    // `aria-modal` alone does not stop Tab reaching the page behind.
    const main = document.getElementById('main');
    const footer = document.querySelector('footer');
    main?.setAttribute('inert', '');
    footer?.setAttribute('inert', '');

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      main?.removeAttribute('inert');
      footer?.removeAttribute('inert');
    };
  }, [onClose, onStep]);

  /* ── touch ────────────────────────────────────────────────────────── */
  const settle = useCallback((animate) => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (animate) {
      wrap.style.transition = 'transform 220ms var(--ease-out)';
      wrap.addEventListener('transitionend', () => (wrap.style.transition = ''), { once: true });
    }
    wrap.style.transform = '';
    if (dialogRef.current) dialogRef.current.style.opacity = '';
  }, []);

  const onTouchStart = (event) => {
    if (event.touches.length !== 1) {
      gesture.current.on = false;
      return;
    }
    const touch = event.touches[0];
    gesture.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startT: performance.now(),
      dx: 0,
      dy: 0,
      axis: 'none',
      on: true,
    };
  };

  const onTouchMove = (event) => {
    const g = gesture.current;
    if (!g.on) return;

    const touch = event.touches[0];
    g.dx = touch.clientX - g.startX;
    g.dy = touch.clientY - g.startY;

    if (g.axis === 'none') {
      if (Math.hypot(g.dx, g.dy) <= DEAD_ZONE) return; // a tap is not a drag
      g.axis = Math.abs(g.dx) > Math.abs(g.dy) ? 'x' : 'y';
    }

    if (prefersReducedMotion()) return;

    const wrap = wrapRef.current;
    if (!wrap) return;

    if (g.axis === 'x') {
      const damp = (atStart && g.dx > 0) || (atEnd && g.dx < 0) ? 0.35 : 1;
      wrap.style.transform = `translateX(${g.dx * damp}px)`;
      event.preventDefault();
    } else {
      const pull = Math.max(0, g.dy); // downward only
      wrap.style.transform = `translateY(${pull}px) scale(${1 - Math.min(pull / 1200, 0.12)})`;
      if (dialogRef.current) {
        dialogRef.current.style.opacity = String(Math.max(0.45, 1 - pull / 420));
      }
      event.preventDefault();
    }
  };

  const onTouchEnd = () => {
    const g = gesture.current;
    if (!g.on) return;
    g.on = false;

    const wrap = wrapRef.current;
    const dt = Math.max(1, performance.now() - g.startT);

    if (g.axis === 'x' && wrap) {
      const committed =
        Math.abs(g.dx) > SWIPE_COMMIT * wrap.offsetWidth || Math.abs(g.dx) / dt > FLICK_X;
      if (committed) {
        settle(false);
        onStep(g.dx < 0 ? 1 : -1);
        return;
      }
    }

    if (g.axis === 'y' && wrap) {
      const dismissed = g.dy > DISMISS_PULL * wrap.offsetHeight || g.dy / dt > FLICK_Y;
      if (dismissed) {
        onClose();
        return;
      }
    }

    settle(true);
  };

  const arrow =
    'inline-flex h-14 w-14 items-center justify-center text-paper transition-opacity ' +
    'active:opacity-60 disabled:opacity-25 lg:h-16 lg:w-16 lg:hover:opacity-70';

  /**
   * The backdrop closes on click, so every control has to stop the event
   * reaching it — otherwise paging forward also dismisses the dialog.
   */
  const control = (action) => (event) => {
    event.stopPropagation();
    action();
  };

  if (!host) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      data-lightbox=""
      onClick={onClose}
      className="on-navy fixed inset-0 z-[70] flex select-none flex-col bg-ink-deep px-[var(--spacing-gutter)]"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)',
        overscrollBehavior: 'contain',
      }}
    >
      {/* ── top row ──────────────────────────────────────────────────── */}
      <div
        className="mx-auto flex h-14 w-full max-w-[1400px] shrink-0 items-center justify-between"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="photo-index tabular">
          {String(index + 1).padStart(3, '0')}
          <span className="hidden lg:inline"> / {String(images.length).padStart(3, '0')}</span>
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={control(onClose)}
          className="t-label-lg -mr-4 inline-flex h-11 items-center justify-center px-4 text-paper transition-colors hover:text-brass"
        >
          Close
        </button>
      </div>

      {/* ── the frame, with the pointer-screen arrows beside it ──────── */}
      <div className="relative mx-auto flex w-full max-w-[1400px] min-h-0 flex-1 items-center justify-center gap-6">
        <button
          ref={prevRef}
          type="button"
          onClick={control(() => onStep(-1))}
          disabled={atStart}
          aria-disabled={atStart}
          aria-label="Previous frame"
          className={`${arrow} hidden shrink-0 lg:inline-flex`}
        >
          <ArrowLeft size={24} strokeWidth={1.5} />
        </button>

        <div
          ref={wrapRef}
          className="flex min-h-0 min-w-0 flex-1 items-center justify-center"
          style={{ touchAction: 'none' }}
          onClick={(event) => event.stopPropagation()}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={image.w}
            height={image.h}
            sizes="(max-width: 1024px) 92vw, 70vw"
            priority
            draggable={false}
            className="max-h-full w-auto max-w-full object-contain"
          />
        </div>

        <button
          ref={nextRef}
          type="button"
          onClick={control(() => onStep(1))}
          disabled={atEnd}
          aria-disabled={atEnd}
          aria-label="Next frame"
          className={`${arrow} hidden shrink-0 lg:inline-flex`}
        >
          <ArrowRight size={24} strokeWidth={1.5} />
        </button>
      </div>

      {/* ── bottom row ───────────────────────────────────────────────── */}
      <div
        className="mx-auto mt-3 flex h-14 w-full max-w-[1400px] shrink-0 items-center justify-between lg:h-10 lg:justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={control(() => onStep(-1))}
          disabled={atStart}
          aria-hidden="true"
          tabIndex={-1}
          className={`${arrow} -ml-[6px] lg:hidden`}
        >
          <ArrowLeft size={22} strokeWidth={1.5} />
        </button>

        <p className="photo-index tabular lg:hidden">
          {String(index + 1).padStart(3, '0')} / {String(images.length).padStart(3, '0')}
        </p>

        <p className="t-caption hidden max-w-[70ch] text-center text-paper-dim lg:block">
          {image.alt}
        </p>

        <button
          type="button"
          onClick={control(() => onStep(1))}
          disabled={atEnd}
          aria-hidden="true"
          tabIndex={-1}
          className={`${arrow} -mr-[6px] lg:hidden`}
        >
          <ArrowRight size={22} strokeWidth={1.5} />
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        Frame {index + 1} of {images.length} — {image.alt}
      </p>
    </div>,
    host
  );
}
