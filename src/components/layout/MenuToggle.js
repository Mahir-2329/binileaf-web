'use client';

import { cx } from '@/lib/utils';

/**
 * The mobile nav trigger.
 *
 * Three ruled lines of unequal length — the same rule vocabulary the menu card
 * uses — with the middle one in the second ink. Opening folds the outer two
 * into an X and retracts the red rule to nothing, so the mark reads as the
 * page being ruled off rather than as a generic hamburger.
 *
 * The button is a 44px hit area with no box — the three rules are the mark,
 * and a border around them only competed with the wordmark opposite.
 */
export default function MenuToggle({ open, onClick, tone = 'ink', ...rest }) {
  const onNavy = tone === 'paper';
  const line = onNavy ? 'bg-paper' : 'bg-ink';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="relative -mr-3 inline-flex min-h-11 min-w-11 items-center justify-center px-3 lg:hidden"
      {...rest}
    >
      <span className="relative block h-[14px] w-[22px]" aria-hidden="true">
        {/* top rule — full width, folds down into the X */}
        <span
          className={cx('absolute left-0 h-[1.5px] transition-all duration-[260ms]', line)}
          style={{
            top: open ? 6 : 0,
            width: 22,
            transform: open ? 'rotate(45deg)' : 'none',
            transitionTimingFunction: 'var(--ease-out)',
          }}
        />

        {/* middle rule — the second ink, retracts to nothing */}
        <span
          className="absolute left-0 top-[6px] h-[1.5px] bg-stamp transition-all duration-[260ms]"
          style={{
            width: open ? 0 : 13,
            opacity: open ? 0 : 1,
            transitionTimingFunction: 'var(--ease-out)',
          }}
        />

        {/* bottom rule — short at rest, extends as it folds up */}
        <span
          className={cx('absolute left-0 h-[1.5px] transition-all duration-[260ms]', line)}
          style={{
            top: open ? 6 : 12,
            width: open ? 22 : 17,
            transform: open ? 'rotate(-45deg)' : 'none',
            transitionTimingFunction: 'var(--ease-out)',
          }}
        />
      </span>
    </button>
  );
}
