/**
 * The only decorative art on this site. Redrawn in the spirit of the line
 * illustrations on Binileaf's printed menu card: single-weight stroke, no
 * fill, open ends. Colour is inherited from the parent's `color`.
 *
 * Rules: never filled, never animated, never inside a card or circle, never
 * more than one per section.
 */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  vectorEffect: 'non-scaling-stroke',
};

function Svg({ children, size = 160, className, label }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : 'true'}
      {...base}
    >
      {children}
    </svg>
  );
}

/** A sack of beans, tied at the neck, beans spilling at the foot. */
export function CoffeeSack(props) {
  return (
    <Svg {...props}>
      <path d="M62 62c-6 14-10 33-10 52 0 24 4 42 9 52 3 6 9 9 18 9h42c9 0 15-3 18-9 5-10 9-28 9-52 0-19-4-38-10-52" />
      <path d="M62 62c8-5 20-8 38-8s30 3 38 8" />
      <path d="M62 62c0 6 17 11 38 11s38-5 38-11" />
      <path d="M74 48c6-4 15-6 26-6s20 2 26 6" />
      <path d="M74 48v14M126 48v14" />
      <path d="M84 96c6 5 14 8 22 8s16-3 22-8" />
      <path d="M92 118c3 3 7 5 12 5" />
      <ellipse cx="48" cy="168" rx="11" ry="7" transform="rotate(-18 48 168)" />
      <path d="M43 166c3 2 7 3 10 3" />
      <ellipse cx="164" cy="160" rx="11" ry="7" transform="rotate(22 164 160)" />
      <path d="M159 158c3 2 7 3 10 3" />
      <ellipse cx="34" cy="146" rx="9" ry="6" transform="rotate(12 34 146)" />
    </Svg>
  );
}

/** A hand coming in from the left, holding a cup by the rim. */
export function HandWithCup(props) {
  return (
    <Svg {...props}>
      <path d="M72 86h66c3 0 5 2 5 5 0 26-8 44-17 52-4 4-9 6-14 6h-14c-5 0-10-2-14-6-9-8-17-26-17-52 0-3 2-5 5-5Z" />
      <path d="M143 96h10c9 0 16 7 16 16s-7 16-16 16h-6" />
      <path d="M70 100c-8 0-14 5-14 12 0 6 4 10 10 12" />
      <path d="M56 112c-6-2-12 1-14 6-2 6 1 12 7 14l18 6" />
      <path d="M49 132c-6 0-10 4-10 9s4 9 10 9h14" />
      <path d="M53 150c-5 1-8 5-7 10 1 4 5 7 10 7h22" />
      <path d="M96 62c4-6 2-12-1-16M112 58c4-6 2-12-1-16M128 62c4-6 2-12-1-16" />
    </Svg>
  );
}

/** Two people sitting inside oversized cups, mid-conversation. */
export function TwoInCups(props) {
  return (
    <Svg {...props}>
      <path d="M22 118h58c2 0 4 2 4 4 0 22-7 38-15 45-3 3-7 4-11 4H44c-4 0-8-1-11-4-8-7-15-23-15-45 0-2 2-4 4-4Z" />
      <path d="M84 126h8c7 0 13 6 13 13s-6 13-13 13h-5" />
      <circle cx="52" cy="76" r="15" />
      <path d="M40 112c0-12 5-20 12-20s12 8 12 20" />
      <path d="M64 100c8-4 14-10 17-18" />
      <path d="M116 118h58c2 0 4 2 4 4 0 22-7 38-15 45-3 3-7 4-11 4h-14c-4 0-8-1-11-4-8-7-15-23-15-45 0-2 2-4 4-4Z" />
      <path d="M112 126h-8c-7 0-13 6-13 13s6 13 13 13h5" />
      <circle cx="146" cy="76" r="15" />
      <path d="M134 112c0-12 5-20 12-20s12 8 12 20" />
      <path d="M134 100c-8-4-14-10-17-18" />
      <path d="M88 48c3-5 8-8 12-8s9 3 12 8" />
      <path d="M96 34c2-3 5-5 8-5" />
    </Svg>
  );
}

/** A croissant: a curved body, four seam lines, and two tapered tips. */
export function Croissant(props) {
  return (
    <Svg {...props}>
      <path d="M100 66c-27 0-49 13-59 31-5 9-4 17 3 20 6 3 12 0 16-6" />
      <path d="M100 66c27 0 49 13 59 31 5 9 4 17-3 20-6 3-12 0-16-6" />
      <path d="M60 111c7 13 22 21 40 21s33-8 40-21" />
      <path d="M100 66c-9 7-14 18-14 31 0 14 5 27 14 35 9-8 14-21 14-35 0-13-5-24-14-31Z" />
      <path d="M86 92c-10-2-20 2-27 10M114 92c10-2 20 2 27 10" />
      <path d="M73 126c-9 7-19 8-25 3-5-5-3-13 5-18" />
      <path d="M127 126c9 7 19 8 25 3 5-5 3-13-5-18" />
      <path d="M100 132c0 4 1 8 3 11M100 132c0 4-1 8-3 11" />
    </Svg>
  );
}

/** A hand-drawn down arrow for the hero. Not a chevron, not a mouse. */
export function DownArrow({ size = 28, className }) {
  return (
    <svg
      viewBox="0 0 24 44"
      width={size}
      height={size * (44 / 24)}
      className={className}
      aria-hidden="true"
      {...base}
      strokeWidth={1.5}
    >
      <path d="M12 2c-1 9 1 19 0 30" />
      <path d="M4 30c3 3 6 7 8 11 2-4 5-8 8-11" />
    </svg>
  );
}

/** A small bean or leaf glyph, used as an inline separator. */
export function BeanLeafGlyph({ size = 14, variant = 'bean', className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...base}
      strokeWidth={1.6}
    >
      {variant === 'bean' ? (
        <>
          <ellipse cx="12" cy="12" rx="6.5" ry="9.5" transform="rotate(35 12 12)" />
          <path d="M8 16c2.5-2.5 5.5-5.5 8-8" />
        </>
      ) : (
        <>
          <path d="M20 4c0 9-5 15-13 16-1-8 4-15 13-16Z" />
          <path d="M20 4 7 20" />
        </>
      )}
    </svg>
  );
}
