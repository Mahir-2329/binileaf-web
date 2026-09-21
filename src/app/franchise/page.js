import Image from 'next/image';
import { Check } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { SectionHeader, Stamp } from '@/components/ui/Primitives';
import Accordion from '@/components/ui/Accordion';
import EnquiryForm from '@/components/forms/EnquiryForm';
import JsonLd from '@/components/seo/JsonLd';

import { getContent, getFaqs, getPlacement } from '@/server/repo';
import { pageMeta, breadcrumbSchema, faqSchema } from '@/lib/seo';
import { contact } from '@/data/site';

/**
 * Rebuilt on demand when the admin writes (see /api/revalidate); this window
 * is only the safety net for a ping that never arrived.
 */
export const revalidate = 900;

export const metadata = pageMeta({
  title: 'Franchise',
  description:
    'Open a Binileaf Café. The franchise package covers interior design and branding, menu training, product sourcing, POS tooling, marketing support and our exclusive coffee and tea blends.',
  path: '/franchise',
});

const STEPS = [
  {
    title: 'Tell us where',
    body: 'Send the form below with the city and, if you have one, the site. We read every enquiry ourselves.',
  },
  {
    title: 'A long phone call',
    body: 'We talk through the model honestly — what it costs, what it takes to run, and what a bad month looks like.',
  },
  {
    title: 'The site visit',
    body: 'We come and see the space, walk the street, and tell you whether we think it will work.',
  },
  {
    title: 'Build and fit-out',
    body: 'Interiors, branding, equipment and the counter layout, handled to the same drawings as our own room.',
  },
  {
    title: 'Open',
    body: 'Two weeks of training on the machine and the kitchen, then you open. We stay on the phone after that.',
  },
];

export default async function FranchisePage() {
  const [franchise, faqs, hero] = await Promise.all([
    getContent('franchise'),
    getFaqs(),
    getPlacement('franchise.hero'),
  ]);
  const franchiseFaqs = faqs.filter((faq) => /franchise|open|contact/i.test(faq.q));

  return (
    <>
      <JsonLd
        id="ld-franchise-crumbs"
        data={breadcrumbSchema([{ name: 'Franchise', href: '/franchise' }])}
      />
      <JsonLd id="ld-franchise-faq" data={faqSchema()} />

      {/* ── hero ───────────────────────────────────────────────────── */}
      <section className="on-navy grain-dark relative overflow-x-clip bg-ink-deep text-paper">
        <div className="shell flex min-h-[64svh] flex-col justify-end pb-[clamp(3rem,6vw,5rem)] pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))]">
          <div className="grid-page items-end">
            <div className="col-span-full lg:col-span-7">
              <p className="t-label text-brass">{franchise.kicker}</p>
              <h1 className="t-h1 mt-6 max-w-[14ch]">{franchise.heading}</h1>
              <p className="t-lede mt-10 max-w-[46ch] italic text-paper-dim">{franchise.lede}</p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <a href="#enquire" className="btn btn--stamp">
                  Enquire
                </a>
                <a
                  href={`tel:${contact.phone}`}
                  className="t-label-lg text-paper-dim transition-colors hover:text-brass"
                >
                  or call {contact.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="col-span-full mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0">
              <div className="photo scrim scrim--flat relative aspect-[4/5] lg:-mr-[calc(var(--spacing-gutter)+2rem)]">
                <Image
                  src={hero.src}
                  alt={hero.alt || 'Inside a Binileaf café'}
                  width={1600}
                  height={2000}
                  sizes="(max-width: 1024px) 100vw, 32vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── the proposition ────────────────────────────────────────── */}
      <section className="shell section">
        <Reveal>
          <SectionHeader
            number="01"
            title="What you would be taking on."
            deck="Not a kiosk, and not a chain. A small room that has to be genuinely liked by the people who live around it."
            meta="The proposition"
          />
        </Reveal>

        <Reveal delay={70} className="mt-12">
          <ul className="grid gap-x-12 gap-y-0 lg:grid-cols-2">
            {franchise.reasons.map((reason) => (
              <li key={reason.title} className="ledger-row py-8">
                <h3 className="t-h3">{reason.title}</h3>
                <p className="t-body mt-3 max-w-[54ch] text-pencil">{reason.body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── five steps ─────────────────────────────────────────────── */}
      <section className="shell section">
        <Reveal>
          <SectionHeader number="02" title="How it goes." deck="Five steps from the first message to the day you open. Costs, territory and timelines are talked through on the call — honestly, and in full." meta="Five steps" />
        </Reveal>

        <ol className="mt-14">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.title}
              delay={Math.min(i, 5) * 60}
              className="grid-page items-start py-8 lg:py-10"
            >
              <span
                className={`hidden leading-none text-paper-shade lg:col-span-2 lg:block lg:text-[length:var(--text-display)] ${
                  i % 2 === 0 ? '' : 'lg:col-start-6'
                }`}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div
                className={`col-span-full lg:mt-3 ${
                  i % 2 === 0 ? 'lg:col-span-4 lg:col-start-3' : 'lg:col-span-5 lg:col-start-8'
                }`}
              >
                <h3 className="t-h3 flex items-baseline gap-4">
                  <span className="t-label tabular text-stamp lg:hidden" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {step.title}
                </h3>
                <p className="t-body mt-3 max-w-[52ch] text-pencil">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ── what's included ────────────────────────────────────────── */}
      <section className="on-navy grain-dark bg-ink-deep text-paper">
        <div className="shell section--tight section">
          <Reveal>
            <SectionHeader number="03" title="What is in the box." meta="Included" />
          </Reveal>

          <Reveal delay={70} className="mt-12">
            <ul className="grid gap-x-12 lg:grid-cols-2">
              {franchise.included.map((line) => (
                <li key={line} className="ledger-row flex items-start gap-4 py-6">
                  <Check size={15} strokeWidth={1.5} className="mt-[6px] shrink-0 text-brass" />
                  <span className="t-body">{line}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── faq ────────────────────────────────────────────────────── */}
      {franchiseFaqs.length ? (
        <section className="shell section">
          <Reveal>
            <SectionHeader number="04" title="Before you write in." meta="Questions" />
          </Reveal>
          <Reveal delay={70} className="mt-12 max-w-[72ch]">
            <Accordion items={franchiseFaqs} />
          </Reveal>
        </section>
      ) : null}

      {/* ── enquiry ────────────────────────────────────────────────── */}
      <section id="enquire" className="bg-paper-shade scroll-mt-[calc(var(--header-h)+32px)]">
        <div className="shell section">
          <div className="grid-page items-start">
            <Reveal className="col-span-full lg:col-span-4">
              <h2 className="t-h2 letterpress">Tell us your story.</h2>
              <p className="t-body mt-5 max-w-[38ch] text-pencil">
                The more you tell us about the place and the people, the more useful our first
                call will be.
              </p>
              <a
                href={`tel:${contact.phone}`}
                className="mt-8 block font-[family-name:var(--font-display)] text-[1.75rem] font-medium transition-colors hover:text-stamp"
              >
                {contact.phoneDisplay}
              </a>
              <Stamp lines={['We reply', 'in 3 days']} className="mt-10" />
            </Reveal>

            <Reveal delay={90} className="col-span-full mt-14 lg:col-span-7 lg:col-start-6 lg:mt-0">
              <EnquiryForm kind="franchise" />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
