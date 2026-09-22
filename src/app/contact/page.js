import Image from 'next/image';
import Link from 'next/link';

import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/Primitives';
import EnquiryForm from '@/components/forms/EnquiryForm';
import InstagramMark from '@/components/art/InstagramMark';
import { TwoInCups } from '@/components/art/Illustrations';
import JsonLd from '@/components/seo/JsonLd';

import { getPlacements } from '@/server/repo';
import { pageMeta, breadcrumbSchema, faqSchema } from '@/lib/seo';
import { address, contact, hours, amenities } from '@/data/site';
import { frameStyle } from '@/lib/frame';

/**
 * Rebuilt on demand when the admin writes (see /api/revalidate); this window
 * is only the safety net for a ping that never arrived.
 */
export const revalidate = 900;

export const metadata = pageMeta({
  title: 'Visit',
  description:
    'Binileaf Café is on the ground floor of Kruti Apartment, Block-A, University Area, Ahmedabad 380015. Open every day, 10:30 AM to 12:30 AM. Call 87586 85932.',
  path: '/contact',
});

/** Photograph slots this page fills from `media_placements`. */
const STRIP = [1, 2, 3, 4, 5, 6].map((n) => `contact.strip.${n}`);

const MAP_SRC =
  'https://www.google.com/maps?q=' +
  encodeURIComponent(
    'Binileaf Cafe, Kruti Apartment, Block A, University Area, Ahmedabad, Gujarat 380015'
  ) +
  '&output=embed';

function InfoBlock({ label, children }) {
  return (
    <div className="ledger-row py-7">
      <p className="t-label text-pencil">{label}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function ContactPage() {
  const placements = await getPlacements();

  return (
    <>
      <JsonLd
        id="ld-contact-crumbs"
        data={breadcrumbSchema([{ name: 'Visit', href: '/contact' }])}
      />
      <JsonLd id="ld-contact-faq" data={faqSchema()} />

      {/* ── head + map ─────────────────────────────────────────────── */}
      <div className="shell overflow-x-clip pb-[var(--spacing-section-tight)] pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))]">
        <div className="grid-page items-start">
          <Reveal className="col-span-full lg:col-span-5">
            <div className="deco-rule" />
            <h1 className="t-h1 letterpress mt-8">Visit</h1>
            <p className="t-lede mt-7 max-w-[40ch] italic text-pencil">
              Right in the heart of the University Area. Drop in, take a seat, and let the
              room do the rest.
            </p>

            <div className="mt-10 border-t border-ink">
              <InfoBlock label="Address">
                <address className="t-body not-italic leading-[1.7]">
                  Ground Floor, Kruti Apartment,
                  <br />
                  Block-A, {address.locality},
                  <br />
                  {address.city}, {address.region} {address.postalCode}
                </address>
              </InfoBlock>

              <InfoBlock label="Hours">
                <p className="font-[family-name:var(--font-display)] text-[1.5rem] font-medium">
                  {hours.daysDisplay}
                  <br />
                  <span className="tabular">{hours.display}</span>
                </p>
              </InfoBlock>

              <InfoBlock label="Phone">
                <a
                  href={`tel:${contact.phone}`}
                  className="block font-[family-name:var(--font-display)] text-[clamp(2rem,4vw,2.75rem)] font-medium leading-none transition-colors hover:text-stamp"
                >
                  {contact.phoneDisplay}
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="t-small mt-4 block text-pencil transition-colors hover:text-stamp"
                >
                  {contact.email}
                </a>
              </InfoBlock>

              <InfoBlock label="Instagram">
                <a
                  href="https://www.instagram.com/binileafofficial/"
                  target="_blank"
                  rel="noreferrer"
                  className="t-body inline-flex items-center gap-3 transition-colors hover:text-stamp"
                >
                  <InstagramMark size={18} />
                  @binileafofficial
                </a>
              </InfoBlock>
            </div>
          </Reveal>

          <Reveal delay={90} className="col-span-full mt-14 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <div className="relative">
              <div className="aspect-[4/3] border border-ink lg:-mr-[calc(var(--spacing-gutter))] lg:aspect-[3/4]">
                <iframe
                  title="Binileaf Café on Google Maps"
                  src={MAP_SRC}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full"
                  style={{
                    border: 0,
                    filter: 'grayscale(1) sepia(0.32) saturate(0.75) contrast(1.06) brightness(1.02)',
                  }}
                />
              </div>
            </div>

            <Button href={address.mapsUrl} variant="secondary" className="mt-8">
              Open in Google Maps
            </Button>
          </Reveal>
        </div>
      </div>

      {/* ── good to know ───────────────────────────────────────────── */}
      <section className="bg-paper-shade">
        <div className="shell section--tight section">
          <Reveal>
            <SectionHeader
              number="01"
              title="Good to know."
              deck="The practical bits, so you are not guessing before you walk in."
              meta="Before you come"
            />
          </Reveal>

          <Reveal delay={70} className="mt-12">
            <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((item) => (
                <li key={item} className="ledger-row py-5">
                  <span className="t-body">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── write to us ────────────────────────────────────────────── */}
      <section className="shell section">
        <div className="grid-page items-start">
          <Reveal className="col-span-full lg:col-span-4">
            <h2 className="t-h2 letterpress">Write to us.</h2>
            <p className="t-body mt-5 max-w-[38ch] text-pencil">
              Feedback, a bulk order, a private evening, or just to tell us the chai was
              better last Tuesday. All of it reaches the same six people.
            </p>
            <TwoInCups size={190} className="mt-12 hidden text-paper-shade lg:block" />
          </Reveal>

          <Reveal delay={90} className="col-span-full mt-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
            <EnquiryForm kind="contact" />
          </Reveal>
        </div>
      </section>

      {/* ── instagram strip ────────────────────────────────────────── */}
      <section className="shell section--tight overflow-x-clip pb-[var(--spacing-section)]">
        <Reveal className="flex items-baseline justify-between gap-6">
          <h2 className="t-h3">Lately, on Instagram</h2>
          <a
            href="https://www.instagram.com/binileafofficial/"
            target="_blank"
            rel="noreferrer"
            className="ghost"
          >
            <span className="ghost__label">@binileafofficial</span>
          </a>
        </Reveal>

        <Reveal
          delay={70}
          className="no-scrollbar mt-10 flex snap-x snap-proximity gap-[var(--spacing-grid)] overflow-x-auto pb-4"
          style={{ marginRight: 'calc(50% - 50vw)', paddingRight: 'var(--spacing-gutter)' }}
        >
          {STRIP.map((slot) => {
            const frame = placements[slot];

            return (
              <Link
                key={slot}
                href="/gallery"
                className="w-[52vw] shrink-0 snap-start sm:w-[32vw] lg:w-[18vw]"
              >
                <div className="photo-frame">
                  <div className="photo aspect-square">
                    <Image
                      src={frame.src}
                      alt={frame.alt || 'At Binileaf Café'}
                      width={frame.w}
                      height={frame.h}
                      sizes="(max-width: 640px) 52vw, (max-width: 1024px) 32vw, 18vw"
                      style={frameStyle(frame)}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </Reveal>
      </section>
    </>
  );
}
