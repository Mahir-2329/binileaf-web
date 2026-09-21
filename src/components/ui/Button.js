import Link from 'next/link';
import { cx } from '@/lib/utils';

/**
 * Buttons are printed, not rendered: no radius, no blur. Depth comes from a
 * zero-blur offset in the second ink when the button lifts on hover.
 * Visual detail lives in globals.css under `.btn`.
 */

const isExternal = (href = '') => /^(https?:|tel:|mailto:)/.test(href);

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const classes = cx('btn', `btn--${variant}`, size === 'sm' && 'btn--sm', className);

  if (!href) {
    return (
      <button className={classes} {...rest}>
        {children}
      </button>
    );
  }

  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/**
 * The ghost variant: a label over a hairline that goes stamp red and nudges
 * right on hover. Every "see more" on the site is one of these.
 */
export function GhostLink({ href, children, className, tone = 'ink', ...rest }) {
  const classes = cx('ghost', tone === 'paper' && 'ghost--paper', className);

  if (!href) {
    return (
      <button className={classes} {...rest}>
        <span className="ghost__label">{children}</span>
      </button>
    );
  }

  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...rest}
      >
        <span className="ghost__label">{children}</span>
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      <span className="ghost__label">{children}</span>
    </Link>
  );
}
