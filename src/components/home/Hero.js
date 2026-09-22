import Image from 'next/image';
import Button, { GhostLink } from '@/components/ui/Button';
import { DownArrow } from '@/components/art/Illustrations';
import { frameStyle } from '@/lib/frame';

/**
 * 01 — Hero.
 *
 * One photograph, full bleed, and the three sentences centred on it. There
 * used to be a second picture in a right-hand column; a picture laid on a
 * picture is two subjects fighting over the same plate, and taking it away
 * gives the type the middle of the page at every width.
 *
 * Centred across, but not down: on a phone the block sits at the foot of the
 * photograph, where a thumb is and where the room above it can be seen.
 * Centring it there left a third of the picture empty under the buttons.
 *
 * The three sentences keep their hard breaks, because the break is the joke;
 * the type is sized so none of them can wrap instead.
 *
 * The photograph comes from `media_placements`, so the café can swap it — and
 * now frame it — from the admin without a deploy.
 */
export default function Hero({ placements }) {
  const background = placements['home.hero.background'];

  return (
    <section className="on-navy grain-dark relative flex min-h-[min(84svh,720px)] flex-col justify-end overflow-hidden overflow-x-clip bg-ink-deep text-paper lg:min-h-[min(92svh,860px)] lg:justify-center">
      <div className="scrim hero-scrim absolute inset-0">
        <Image
          src={background.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          // The café can reframe this from "Where they appear"; until it does,
          // the crop the design shipped with.
          style={frameStyle(background, { y: 45 })}
        />
      </div>

      <div className="shell relative z-10 w-full pb-[calc(var(--spacing-gutter)+8px)] pt-[calc(var(--header-h)+56px)] lg:pb-[clamp(2rem,4vw,3rem)] lg:pt-[calc(var(--header-h)+clamp(1.5rem,4vw,3rem))]">
        <div className="mx-auto flex max-w-[min(100%,72rem)] flex-col items-center text-center">
          {/* Block spans rather than <br>: `text-wrap: balance` applies per
              block box, so each sentence is left alone instead of rebalanced. */}
          <h1 className="t-display text-[length:clamp(2.25rem,0.4625rem+7.94vw,5.2rem)] leading-[0.92] tracking-[-0.028em] text-paper lg:text-[length:clamp(2.75rem,1rem+6.6vw,6.25rem)] lg:leading-[0.90] lg:tracking-[-0.025em]">
            <span className="block">Bini is the bean.</span>
            <span className="block">Leaf is the chai.</span>
            <span className="block">
              We <span className="text-stamp">refuse</span> to choose.
            </span>
          </h1>

          {/* The hero's second composition line, now on the centre axis. */}
          <span className="mt-6 h-px w-[88px] bg-brass lg:mt-10 lg:w-[120px]" aria-hidden="true" />

          {/* One action, one link — two equal slabs give no hierarchy. */}
          <div className="mt-6 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center lg:mt-10">
            <Button href="/menu" variant="inverse" className="w-full justify-center sm:w-auto">
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

        <div className="mt-12 hidden justify-center lg:flex">
          <DownArrow className="hero__arrow text-brass" size={26} />
        </div>
      </div>
    </section>
  );
}
