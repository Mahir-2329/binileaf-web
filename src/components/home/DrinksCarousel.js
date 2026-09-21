'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CropMarks } from '@/components/ui/Primitives';
import { scrollBehavior } from '@/lib/a11y';

/**
 * A coverflow-style carousel for small screens.
 *
 * Cards sit in a scroll-snapped track inside a perspective container. On
 * scroll we measure each card's distance from the centre of the viewport and
 * drive rotateY / translateZ / scale from it, so the depth tracks the finger
 * rather than running on a timer. Everything is read in one rAF pass and the
 * whole effect is dropped under `prefers-reduced-motion`.
 */

const MAX_ROTATE = 18;  // degrees at one card's distance — 26° visibly squeezed the 4:5 photo
const MAX_DEPTH = 90;   // px; perspective already shrinks the neighbour, so this is halved
const MAX_SCALE = 0.04; // the explicit shrink on top of perspective
const CLAMP = 1.25;     // card-widths past which the transform carries no information
const MIN_OPACITY = 0.55;

export default function DrinksCarousel({ items, tone = 'paper' }) {
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const frame = useRef(0);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setMotion(!query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  const paint = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const centre = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Infinity;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;

      const cardCentre = card.offsetLeft + card.offsetWidth / 2;
      const delta = (cardCentre - centre) / card.offsetWidth; // in card-widths
      const clamped = Math.max(-CLAMP, Math.min(CLAMP, delta));
      const distance = Math.abs(clamped);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = i;
      }

      const inner = card.firstElementChild;
      if (!inner) return;

      if (!motion) {
        inner.style.transform = '';
        inner.style.opacity = '';
        return;
      }

      inner.style.transform =
        `rotateY(${(-clamped * MAX_ROTATE).toFixed(2)}deg) ` +
        `translateZ(${(-distance * MAX_DEPTH).toFixed(1)}px) ` +
        `scale(${(1 - distance * MAX_SCALE).toFixed(3)})`;
      inner.style.opacity = String(Math.max(MIN_OPACITY, 1 - distance * 0.45));
    });

    if (nearest !== indexRef.current) {
      indexRef.current = nearest;
      setIndex(nearest);
    }
  }, [motion]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(paint);
    };

    paint();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      cancelAnimationFrame(frame.current);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [paint]);

  const step = (delta) => {
    const card = cardRefs.current[Math.max(0, Math.min(items.length - 1, index + delta))];
    const track = trackRef.current;
    if (!card || !track) return;
    track.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2,
      behavior: scrollBehavior(),
    });
  };

  const onNavy = tone === 'navy';

  return (
    <div className="md:hidden">
      <div
        ref={trackRef}
        className="no-scrollbar -mx-[var(--spacing-gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[calc((100vw-min(72vw,312px))/2)] py-6"
        style={{
          perspective: motion ? '900px' : undefined,
          perspectiveOrigin: '50% 46%',
        }}
        role="group"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Barista Special drinks"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') step(1);
          if (event.key === 'ArrowLeft') step(-1);
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.name}
            ref={(node) => {
              cardRefs.current[i] = node;
            }}
            className="w-[72vw] max-w-[312px] shrink-0 snap-center"
          >
            <div
              className="origin-center will-change-transform"
              style={{ transformStyle: 'preserve-3d', transition: 'opacity 200ms linear' }}
            >
              <Link href="/menu#barista-special" className="block">
                <div className="crop crop--brass relative">
                  <div className="photo aspect-[4/5]">
                    <Image
                      src={item.image}
                      alt={`${item.name} at Binileaf Café`}
                      width={1444}
                      height={1805}
                      sizes="(max-width: 434px) 72vw, 312px"
                    />
                  </div>
                  <CropMarks tone="brass" />
                </div>

                <div className="mt-5 border-t border-brass pt-4">
                  <h3 className="t-h3">{item.name}</h3>
                </div>

                <p className={`t-small mt-2 italic ${onNavy ? 'text-paper-dim' : 'text-pencil'}`}>{item.note}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="photo-index tabular shrink-0">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>

        <span className={`mx-4 h-px flex-1 ${onNavy ? 'bg-paper/20' : 'bg-ink/15'}`} aria-hidden="true">
          <span
            className="block h-px bg-stamp"
            style={{
              width: `${((index + 1) / items.length) * 100}%`,
              transition: 'width var(--dur-base) var(--ease-out)',
            }}
          />
        </span>

        <div className="-mr-3 flex items-center gap-1">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous drink"
            disabled={index === 0}
            className={`inline-flex h-12 w-12 items-center justify-center ${onNavy ? 'text-paper' : 'text-ink'} active:opacity-60 disabled:opacity-25`}
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next drink"
            disabled={index === items.length - 1}
            className={`inline-flex h-12 w-12 items-center justify-center ${onNavy ? 'text-paper' : 'text-ink'} active:opacity-60 disabled:opacity-25`}
          >
            <ArrowRight size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
