import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { address, contact, hours } from '@/data/site';
import { frameStyle } from '@/lib/frame';

/**
 * The imprint — how a printed broadside signs itself off.
 *
 * Three ruled cells (where, when, how to reach us) beside a photograph of the
 * frontage, so somebody who has read the page knows what to look for from the
 * road. This is the whole of "visit" on the home page; /contact carries the
 * map and the form.
 */
export default function Imprint({ placements }) {
  const photo = placements['home.imprint.photo'];

  return (
    <section className="bg-paper-shade">
      <div className="shell section">
        <Reveal className="grid-page items-end">
          <h2 className="t-h2 letterpress col-span-full lg:col-span-6">Come and sit down.</h2>
          <p className="t-lede col-span-full mt-4 max-w-[40ch] italic text-pencil lg:col-span-5 lg:col-start-8 lg:mt-0">
            Ground floor, in the University Area. Open every day, late enough for a second round.
          </p>
        </Reveal>

        <div className="grid-page mt-14 items-start">
          <Reveal className="col-span-full lg:col-span-6">
            <dl className="border-t border-ink">
              <div className="ledger-row flex flex-wrap gap-x-10 gap-y-3 py-7">
                <dt className="t-label w-[68px] shrink-0 text-pencil">Where</dt>
                <dd className="min-w-0 flex-1">
                  <address className="t-body not-italic leading-[1.6]">
                    Ground Floor, Kruti Apartment,
                    <br />
                    Block-A, {address.locality},
                    <br />
                    {address.city} {address.postalCode}
                  </address>
                </dd>
              </div>

              <div className="ledger-row flex flex-wrap gap-x-10 gap-y-3 py-7">
                <dt className="t-label w-[68px] shrink-0 text-pencil">When</dt>
                <dd className="min-w-0 flex-1">
                  <p className="font-[family-name:var(--font-display)] text-[1.375rem] font-medium leading-[1.45]">
                    {hours.daysDisplay}
                    <br />
                    <span className="tabular whitespace-nowrap">{hours.display}</span>
                  </p>
                </dd>
              </div>

              <div className="ledger-row flex flex-wrap gap-x-10 gap-y-3 py-7">
                <dt className="t-label w-[68px] shrink-0 text-pencil">Reach</dt>
                <dd className="min-w-0 flex-1">
                  <a
                    href={`tel:${contact.phone}`}
                    className="link-rule inline-block py-[5px] font-[family-name:var(--font-display)] text-[1.5rem] font-medium transition-colors hover:text-stamp"
                  >
                    {contact.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="t-small mt-2 block text-pencil transition-colors hover:text-stamp"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>
            </dl>

            <Button href={address.mapsUrl} className="mt-9">
              Get directions
            </Button>
          </Reveal>

          <Reveal delay={90} className="col-span-full mt-12 lg:col-span-5 lg:col-start-8 lg:mt-0">
            <div className="photo aspect-[4/5]">
              <Image
                src={photo.src}
                alt={photo.alt || 'The Binileaf shopfront at dusk'}
                width={photo.w}
                height={photo.h}
                sizes="(max-width: 1024px) 100vw, 38vw"
                style={frameStyle(photo)}
              />
            </div>
            <p className="photo-index mt-4">Look for the neon — University Area, Ahmedabad</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
