import Link from 'next/link';
import InstagramMark from '@/components/art/InstagramMark';
import { footerNav, contact, address, hours, site } from '@/data/site';
import { WordmarkImage } from './Wordmark';
import { mediaSrc } from '@/lib/media';
import { CoffeeSack } from '@/components/art/Illustrations';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-navy grain-dark border-t-[3px] border-brass bg-ink-deep text-paper">
      <div className="shell py-[clamp(3.5rem,7vw,6rem)]">
        <div className="grid-page gap-y-12">
          {/* ── identity ─────────────────────────────────────────────── */}
          <div className="col-span-full md:col-span-6 lg:col-span-4">
            <WordmarkImage src={mediaSrc('/media/brand/wordmark-text.png')} width={180} />
            <address className="t-small mt-7 not-italic leading-[1.85] text-paper-dim">
              Ground Floor, Kruti Apartment,
              <br />
              Block-A, {address.locality},
              <br />
              {address.city} {address.postalCode}
            </address>
            <CoffeeSack size={96} className="mt-10 text-ink-wash" />
          </div>

          {/* ── site ─────────────────────────────────────────────────── */}
          <nav className="col-span-full md:col-span-2 lg:col-span-2 lg:col-start-6" aria-label="Footer">
            <h2 className="t-label text-brass">Site</h2>
            <ul className="mt-5 leading-[2]">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="t-small block w-fit py-[7px] transition-colors hover:text-brass">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── hours ────────────────────────────────────────────────── */}
          <div className="col-span-full md:col-span-2 lg:col-span-3 lg:col-start-8">
            <h2 className="t-label text-brass">Hours</h2>
            <p className="mt-5 font-[family-name:var(--font-display)] text-[1.25rem] font-medium leading-[1.5]">
              Mon — Sun
              <br />
              <span className="tabular whitespace-nowrap">{hours.display}</span>
            </p>
          </div>

          {/* ── reach ────────────────────────────────────────────────── */}
          <div className="col-span-full md:col-span-2 lg:col-span-2 lg:col-start-11">
            <h2 className="t-label text-brass">Reach</h2>
            <a
              href={`tel:${contact.phone}`}
              className="link-rule mt-4 block w-fit py-[5px] font-[family-name:var(--font-display)] text-[1.5rem] font-medium transition-colors hover:text-brass"
            >
              {contact.phoneDisplay}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="t-small link-rule mt-2 block w-fit py-[5px] text-paper-dim transition-colors hover:text-brass"
            >
              {contact.email}
            </a>
            <a
              href="https://www.instagram.com/binileafofficial/"
              target="_blank"
              rel="noreferrer"
              className="t-small mt-2 flex w-fit items-center gap-2 py-[9px] transition-colors hover:text-brass"
            >
              <InstagramMark size={16} />
              @binileafofficial
            </a>
            <a
              href={address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn--sm btn--outlineInverse mt-6 w-fit"
            >
              Get directions
            </a>
          </div>
        </div>

        {/* ── bottom bar ───────────────────────────────────────────── */}
        <div className="mt-16 flex flex-col items-center gap-3 border-t border-ink-wash pt-7 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="t-label text-paper-dim">
            © {year} {site.name}
          </p>
          <Link href="/franchise" className="t-label inline-block py-[7px] text-paper-dim transition-colors hover:text-brass">
            Franchise enquiries
          </Link>
        </div>
      </div>
    </footer>
  );
}
