import Image from 'next/image';
import Button, { GhostLink } from '@/components/ui/Button';
import { CropMarks } from '@/components/ui/Primitives';
import { DownArrow } from '@/components/art/Illustrations';

/**
 * 01 — Hero.
 *
 * Desktop is the asymmetric 7/5: type left, a portrait photo in the right
 * column, whole. On a phone that second photograph is deleted outright — the
 * hero already *is* a full-bleed photograph, and laying a picture on a picture
 * was what pushed the whole section past the fold.
 *
 * The three sentences keep their hard breaks, because the break is the joke;
 * the type is sized so none of them can wrap instead.
 *
 * Both photographs come from `media_placements`, so the café can swap either
 * from the admin without a deploy.
 */
export default function Hero({ placements }) {
  const background = placements['home.hero.background'];
  const portrait = placements['home.hero.portrait'];

  return (
    <section
      className="on-navy grain-dark relative flex min-h-[min(88svh,760px)] flex-col justify-end overflow-hidden overflow-x-clip bg-ink-deep text-paper lg:min-h-[min(92svh,860px)]"
    >
      {/* The hero's only photograph on a phone. */}
      <div className="scrim hero-scrim absolute inset-0">
        <Image
          src={background.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '50% 45%' }}
        />
      </div>

      <div className="shell relative z-10 w-full pb-[calc(var(--spacing-gutter)+8px)] pt-[calc(var(--header-h)+56px)] lg:pb-[clamp(2rem,4vw,3rem)] lg:pt-[calc(var(--header-h)+clamp(1.5rem,4vw,3rem))]">
        <div className="grid-page items-center">
          <div className="col-span-full lg:col-span-7">
            {/* Block spans rather than <br>: `text-wrap: balance` applies per
                block box, so each sentence is left alone instead of rebalanced. */}
            <h1 className="t-display text-[length:clamp(2.25rem,0.4625rem+7.94vw,5.2rem)] leading-[0.92] tracking-[-0.028em] text-paper lg:text-[length:clamp(2.75rem,1rem+6.6vw,6.25rem)] lg:leading-[0.90] lg:tracking-[-0.025em]">
              <span className="block">Bini is the bean.</span>
              <span className="block">Leaf is the chai.</span>
              <span className="block">
                We <span className="text-stamp">refuse</span> to choose.
              </span>
            </h1>

            {/* The hero's second composition line. The hours live in the
                header, the footer and the contact page; a third copy stamped
                over the photograph was covering the drinks it sat on. */}
            <div className="mt-7 flex items-center gap-4 lg:mt-10">
              <span className="h-px w-[88px] shrink-0 bg-brass lg:w-[120px]" aria-hidden="true" />
            </div>

            {/* One action, one link — two equal slabs give no hierarchy. */}
            <div className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 lg:mt-10">
              <Button
                href="/menu"
                variant="inverse"
                className="w-full justify-start sm:w-auto sm:justify-center"
              >
                See the menu
              </Button>

              <GhostLink href="/about" tone="paper" className="sm:hidden">
                Our story
              </GhostLink>
              <Button href="/about" variant="outlineInverse" className="hidden sm:inline-flex">
                Our story
              </Button>
            </div>
          </div>

          {/* Desktop only. */}
          <div className="col-span-full hidden lg:col-span-4 lg:col-start-9 lg:block">
            {/*
              The frame sits inside the column instead of bleeding off the
              right gutter. The café swaps this photograph from the admin, and
              half of whatever it picked was falling off the edge of the page.
            */}
            <div className="crop relative">
              <div className="photo relative aspect-[3/4] ring-1 ring-paper/20">
                <Image
                  src={portrait.src}
                  alt={portrait.alt || 'Inside Binileaf Café'}
                  fill
                  priority
                  sizes="32vw"
                  className="object-cover object-center"
                />
              </div>
              <CropMarks tone="brass" />
            </div>
          </div>
        </div>

        <div className="mt-10 hidden justify-end lg:flex">
          <DownArrow className="hero__arrow text-brass" size={26} />
        </div>
      </div>
    </section>
  );
}
