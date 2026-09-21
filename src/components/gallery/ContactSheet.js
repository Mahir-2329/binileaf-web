'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { galleryCategories } from '@/data/gallery';
import Lightbox from './Lightbox';

/**
 * A contact sheet.
 *
 * Which means: one grid, every frame the same size, printed to the same crop —
 * the way a roll actually comes back from the lab. Masonry is the opposite of
 * that, and a "feature" frame blown up to the sheet width is a magazine move,
 * not a sheet. The frames are small on purpose: the sheet is where you find a
 * photograph, the lightbox is where you look at one.
 */

const INITIAL = { mobile: 18, desktop: 30 };
const STEP = { mobile: 18, desktop: 30 };

export default function ContactSheet({ images }) {
  const [filter, setFilter] = useState('all');
  const [openIndex, setOpenIndex] = useState(null);
  const [shown, setShown] = useState(INITIAL.mobile);
  const [step, setStepSize] = useState(STEP.mobile);

  useEffect(() => {
    const apply = () => {
      const wide = window.matchMedia('(min-width: 1024px)').matches;
      setShown((current) => Math.max(current, wide ? INITIAL.desktop : INITIAL.mobile));
      setStepSize(wide ? STEP.desktop : STEP.mobile);
    };
    const id = requestAnimationFrame(apply);
    return () => cancelAnimationFrame(id);
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? images : images.filter((image) => image.tags?.includes(filter))),
    [images, filter]
  );

  const onScreen = visible.slice(0, shown);
  const total = String(images.length).padStart(3, '0');

  const close = useCallback(() => {
    setOpenIndex((current) => {
      if (current !== null) {
        requestAnimationFrame(() => document.querySelector(`[data-frame="${current}"]`)?.focus());
      }
      return null;
    });
  }, []);

  const stepBy = useCallback(
    (delta) =>
      setOpenIndex((current) =>
        current === null ? current : Math.max(0, Math.min(visible.length - 1, current + delta))
      ),
    [visible.length]
  );

  const changeFilter = (id) => {
    setFilter(id);
    setShown(step === STEP.desktop ? INITIAL.desktop : INITIAL.mobile);
  };

  const showMore = () => {
    const from = shown;
    setShown(from + step);
    requestAnimationFrame(() => document.querySelector(`[data-frame="${from}"]`)?.focus());
  };

  return (
    <>
      {/* ── filters ─────────────────────────────────────────────────── */}
      <div
        className="sticky z-30 -mx-[var(--spacing-gutter)] border-b border-ink/15 bg-paper"
        style={{ top: 'var(--header-h)' }}
      >
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-[var(--spacing-gutter)] py-2 [scroll-padding-inline:var(--spacing-gutter)]">
          {galleryCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="chip shrink-0 snap-center"
              aria-pressed={filter === category.id}
              onClick={() => changeFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── the sheet ───────────────────────────────────────────────── */}
      <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {onScreen.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              data-frame={i}
              onClick={() => setOpenIndex(i)}
              className="block w-full text-left"
              aria-label={`Open frame ${i + 1}: ${image.alt}`}
            >
              <div className="photo-frame">
                <div className="photo aspect-square">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.w}
                    height={image.h}
                    sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, (max-width: 1280px) 23vw, 18vw"
                  />
                </div>
              </div>
              <span className="photo-index mt-2 block">
                {String(i + 1).padStart(3, '0')}
                <span className="hidden sm:inline"> / {total}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className="t-lede mt-16 italic text-pencil">Nothing filed under that yet.</p>
      ) : shown < visible.length ? (
        <div className="mt-12 flex items-center justify-between gap-4">
          <button type="button" onClick={showMore} className="btn btn--secondary justify-start">
            Show {Math.min(step, visible.length - shown)} more
          </button>
          <span className="photo-index tabular">
            {String(shown).padStart(3, '0')} / {String(visible.length).padStart(3, '0')}
          </span>
        </div>
      ) : (
        <div className="rule-hair mt-12 pt-5">
          <p className="t-caption">That is the whole sheet.</p>
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        {Math.min(shown, visible.length)} of {visible.length} frames shown
      </p>

      {openIndex !== null ? (
        <Lightbox images={visible} index={openIndex} onClose={close} onStep={stepBy} />
      ) : null}
    </>
  );
}
