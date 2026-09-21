import Button, { GhostLink } from '@/components/ui/Button';
import { Stamp } from '@/components/ui/Primitives';
import { CoffeeSack } from '@/components/art/Illustrations';
import { nav, contact } from '@/data/site';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

/**
 * A misprint, not an error screen. Same two inks, same rules — a stamped
 * NOT IN PRINT across a page that otherwise looks like every other one.
 */
export default function NotFound() {
  return (
    <section className="on-navy grain-dark flex min-h-[min(88svh,760px)] flex-col justify-center bg-ink-deep text-paper">
      <div className="shell w-full py-[var(--spacing-section)]">
        <div className="grid-page items-center">
          <div className="col-span-full lg:col-span-7">
            <p className="t-label text-brass">Error 404</p>

            <h1 className="t-h1 mt-6 text-paper">
              This page never
              <br />
              went to print.
            </h1>

            <p className="t-lede mt-8 max-w-[44ch] italic text-paper-dim">
              Whatever you were after is not at this address. The card, the room and the way
              here are all still where you left them.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-4">
              <Button href="/" variant="inverse">
                Back to the front
              </Button>
              <GhostLink href="/menu" tone="paper">
                See the menu
              </GhostLink>
            </div>

            <div className="mt-12 border-t border-ink-wash pt-6">
              <p className="t-label text-paper-dim">Or go straight to</p>
              <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
                {nav
                  .filter((item) => item.href !== '/')
                  .map((item) => (
                    <li key={item.href}>
                      <GhostLink href={item.href} tone="paper">
                        {item.label}
                      </GhostLink>
                    </li>
                  ))}
                <li>
                  <GhostLink href={`tel:${contact.phone}`} tone="paper">
                    {contact.phoneDisplay}
                  </GhostLink>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-span-full mt-16 flex items-center gap-10 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:justify-end">
            <Stamp lines={['Not in', 'print']} tone="paper" className="shrink-0" />
            <CoffeeSack size={120} className="hidden shrink-0 text-ink-wash sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
