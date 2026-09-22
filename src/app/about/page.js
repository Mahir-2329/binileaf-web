import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import Button, { GhostLink } from '@/components/ui/Button';
import { SectionHeader, Stamp } from '@/components/ui/Primitives';
import JsonLd from '@/components/seo/JsonLd';

import { getContent, getPlacements } from '@/server/repo';
import { pageMeta, breadcrumbSchema } from '@/lib/seo';
import { founders, site, address } from '@/data/site';
import { frameStyle } from '@/lib/frame';

/**
 * Rebuilt on demand when the admin writes (see /api/revalidate); this window
 * is only the safety net for a ping that never arrived.
 */
export const revalidate = 900;

export const metadata = pageMeta({
  title: 'Our Story',
  description:
    'Binileaf Café was started in 2025 by six school friends in Ahmedabad. "Bini" is the coffee bean, "Leaf" is the tea leaf — a café that refuses to pick a side.',
  path: '/about',
});

/** Photograph slots this page fills from `media_placements`. */
const STRIP = ['about.strip.1', 'about.strip.2', 'about.strip.3', 'about.strip.4'];

/** Renders the **bold** spans our copy uses, without pulling in a markdown lib. */
function Paragraph({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);

  return (
    <p className="t-body measure">
      {parts.map((part, i) => {
        if (part.startsWith('**')) return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        if (part.startsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>;
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export default async function AboutPage() {
  const [story, values, placements] = await Promise.all([
    getContent('story'),
    getContent('values'),
    getPlacements(),
  ]);

  return (
    <>
      <JsonLd
        id="ld-about-crumbs"
        data={breadcrumbSchema([{ name: 'Our Story', href: '/about' }])}
      />

      {/* ── head ───────────────────────────────────────────────────── */}
      <div className="shell pb-14 pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))]">
        <Reveal className="grid-page">
          <div className="col-span-full lg:col-span-8">
            <div className="deco-rule" />
            <p className="t-label mt-8 text-stamp">{story.kicker}</p>
            <h1 className="t-h1 letterpress mt-6">{story.heading}</h1>
          </div>
          <div className="col-span-full lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="t-lede italic text-pencil">{story.lede}</p>
          </div>
        </Reveal>
      </div>

      {/* ── full-bleed photo ───────────────────────────────────────── */}
      <Reveal className="shell">
        <figure>
          <div className="photo scrim scrim--flat relative aspect-[16/9]">
            <Image
              src={placements['about.hero'].src}
              alt={placements['about.hero'].alt || 'Inside Binileaf Café'}
              width={1600}
              height={900}
              sizes="100vw"
              style={frameStyle(placements['about.hero'])}
              priority
            />
          </div>
          <figcaption className="photo-index mt-4">
            Binileaf — {address.locality}, {address.city}
          </figcaption>
        </figure>
      </Reveal>

      {/* ── origin story ───────────────────────────────────────────── */}
      <section className="shell section">
        <div className="grid-page items-start">
          <Reveal className="col-span-full lg:col-span-5">
            <div className="dropcap space-y-[1.1em]">
              {story.paragraphs.map((text) => (
                <Paragraph key={text.slice(0, 28)} text={text} />
              ))}
            </div>
          </Reveal>

          <Reveal delay={90} className="col-span-full mt-14 lg:col-span-5 lg:col-start-7 lg:mt-0">
            <div className="relative">
              <div className="photo photo-paste photo-paste--alt aspect-[4/5]">
                <Image
                  src={placements['about.pasted'].src}
                  alt={placements['about.pasted'].alt || 'The Binileaf signboard above the entrance'}
                  width={1600}
                  height={2000}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  style={frameStyle(placements['about.pasted'])}
                />
              </div>
              <Stamp
                lines={['Est.', 'Ahmedabad']}
                className="absolute -bottom-8 left-2 bg-paper lg:-left-4"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── pull quote ─────────────────────────────────────────────── */}
      <section className="bg-paper-shade">
        <div className="shell section--tight section">
          <Reveal className="grid-page">
            <blockquote className="side-rule-stamp col-span-full lg:col-span-9">
              <p className="font-[family-name:var(--font-display)] text-[length:var(--text-h2)] font-medium italic leading-[1.1] tracking-[-0.012em]">
                {story.quote.text}
              </p>
              <footer className="t-label mt-7 text-pencil">— {story.quote.attribution}</footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ── the six ────────────────────────────────────────────────── */}
      <section className="shell section">
        <Reveal>
          <SectionHeader
            number="02"
            title="Who's who."
            deck="Six of us, from the same school. Roles get swapped depending on who is behind the counter that evening."
            meta="The founders"
          />
        </Reveal>

        <Reveal delay={70} className="mt-14">
          <ul className="grid gap-x-12 sm:grid-cols-2">
            {founders.map((person) => {
              const initials = person.name
                .split(' ')
                .map((part) => part[0])
                .join('');

              return (
                <li key={person.name} className="ledger-row flex items-center gap-6 py-7">
                  <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-full border border-ink font-[family-name:var(--font-display)] text-[1.25rem] font-medium">
                    {initials}
                  </span>
                  <div>
                    <h3 className="t-h3">{person.name}</h3>
                    <p className="t-label mt-2 text-pencil">Founder</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      {/* ── what we hold to ────────────────────────────────────────── */}
      <section className="bg-paper-shade">
        <div className="shell section">
          <Reveal>
            <SectionHeader number="03" title="What we hold to." meta="Four things" />
          </Reveal>

          <Reveal delay={70} className="mt-12">
            <ol>
              {values.map((value, i) => (
                <li key={value.id} className="ledger-row py-9 last:border-b last:border-ink/15">
                  <div className="grid-page">
                    <span className="t-label col-span-full text-stamp tabular lg:col-span-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="t-h3 col-span-full mt-3 lg:col-span-4 lg:col-start-2 lg:mt-0">
                      {value.title}
                    </h3>
                    <p className="t-body col-span-full mt-4 max-w-[58ch] text-pencil lg:col-span-6 lg:col-start-7 lg:mt-0">
                      {value.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ── room strip ─────────────────────────────────────────────── */}
      <section className="shell section--tight section overflow-x-clip">
        <Reveal
          className="no-scrollbar flex snap-x snap-proximity gap-[var(--spacing-grid)] overflow-x-auto pb-4"
          style={{ marginRight: 'calc(50% - 50vw)', paddingRight: 'var(--spacing-gutter)' }}
        >
          {STRIP.map((slot) => {
            const frame = placements[slot];

            return (
            <figure key={slot} className="w-[66vw] shrink-0 snap-start sm:w-[40vw] lg:w-[23vw]">
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
            </figure>
            );
          })}
        </Reveal>
      </section>

      {/* ── cta ────────────────────────────────────────────────────── */}
      <section className="shell pb-[var(--spacing-section)]">
        <Reveal className="grid-page items-end">
          <h2 className="t-h2 letterpress col-span-full lg:col-span-6">
            Come argue with us about it.
          </h2>
          <div className="col-span-full flex flex-wrap items-center gap-4 lg:col-span-5 lg:col-start-8">
            <Button href="/menu">See the menu</Button>
            <GhostLink href="/contact">Find us</GhostLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
