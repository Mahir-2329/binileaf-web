import Image from 'next/image';
import { cx } from '@/lib/utils';

/**
 * The logo is a drawn wordmark — a 70s-style face nothing on Google Fonts
 * matches — so we use the artwork rather than typesetting a substitute.
 *
 * The source PNG is white on transparent, which only works on navy. For paper
 * grounds we use the same file as a CSS mask and fill it with `currentColor`,
 * so one asset gives us both inks and stays crisp at any size.
 *
 * Media URLs are opaque tokens the server mints, so the artwork arrives from
 * outside: the masks read `--mask-*`, set once on `<html>`, and the `<Image>`
 * variants take a `src` — this file no longer knows where anything lives.
 */

const RATIO = 205 / 1200; // trimmed wordmark
const MARK_RATIO = 588 / 405; // the cat-and-cup mark is taller than it is wide

export function WordmarkImage({ src, width = 160, className, priority = false }) {
  return (
    <Image
      src={src}
      alt="Binileaf"
      width={width}
      height={Math.round(width * RATIO)}
      priority={priority}
      className={className}
      style={{ width, height: 'auto' }}
    />
  );
}

/** Ink (or any currentColor) version of the same artwork, via mask-image. */
export function WordmarkInk({ width = 132, className, label = 'Binileaf' }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cx('block bg-current', className)}
      style={{
        width,
        height: Math.round(width * RATIO),
        WebkitMaskImage: 'var(--mask-wordmark)',
        maskImage: 'var(--mask-wordmark)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'left center',
        maskPosition: 'left center',
      }}
    />
  );
}

/** The cat-and-cup mark on its own. Decorative by default. */
export function WordmarkMark({ src, width = 44, className, alt = '', priority = false }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={Math.round(width * MARK_RATIO)}
      aria-hidden={alt ? undefined : 'true'}
      priority={priority}
      className={className}
      style={{ width, height: 'auto' }}
    />
  );
}

/** Ink version of the mark — same mask trick as the wordmark. */
export function WordmarkMarkInk({ width = 30, className, label = 'Binileaf' }) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cx('block bg-current', className)}
      style={{
        width,
        height: Math.round(width * MARK_RATIO),
        WebkitMaskImage: 'var(--mask-mark)',
        maskImage: 'var(--mask-mark)',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'left center',
        maskPosition: 'left center',
      }}
    />
  );
}
