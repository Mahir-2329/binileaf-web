import Image from 'next/image';
import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/Primitives';
import { GhostLink } from '@/components/ui/Button';
import { gallery } from '@/data/gallery';
import { frameStyle } from '@/lib/frame';

/**
 * 06 — A contact-sheet strip that starts at the page gutter and runs off the
 * right edge of the viewport. Scroll-snapped, one aspect ratio throughout so
 * the row of frames reads as a strip of film rather than a ragged collage.
 */
const SLOTS = [1, 2, 3, 4, 5, 6].map((n) => `home.room.${n}`);
const total = String(gallery.length).padStart(3, '0');

export default function TheRoom({ placements }) {
  return (
    <section className="section shell overflow-x-clip">
      <Reveal>
        <SectionHeader
          title="Wood, plants, and a corner that is always taken."
          deck="Wire chairs, a wall of prints we argued about for weeks, and bamboo screens that do most of the work on a hot afternoon."
          meta={`${total} frames`}
          action={<GhostLink href="/gallery">See the whole sheet</GhostLink>}
        />
      </Reveal>

      <Reveal
        className="no-scrollbar mt-14 flex snap-x snap-proximity gap-[var(--spacing-grid)] overflow-x-auto pb-4"
        style={{ marginRight: 'calc(50% - 50vw)', paddingRight: 'var(--spacing-gutter)' }}
      >
        {SLOTS.map((slot, i) => {
          const frame = placements[slot];

          return (
            <Link
              key={slot}
              href="/gallery"
              className="w-[66vw] shrink-0 snap-start sm:w-[40vw] lg:w-[23vw]"
            >
              <div className="photo-frame">
                <div className="photo aspect-[4/5]">
                  <Image
                    src={frame.src}
                    alt={frame.alt || 'Inside Binileaf Café'}
                    width={frame.w}
                    height={frame.h}
                    sizes="(max-width: 640px) 66vw, (max-width: 1024px) 40vw, 23vw"
                    style={frameStyle(frame)}
                  />
                </div>
              </div>
              <p className="photo-index mt-3">
                {String(i + 1).padStart(3, '0')} / {total}
              </p>
            </Link>
          );
        })}
      </Reveal>
    </section>
  );
}
