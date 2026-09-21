import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/** A square of ink with a cream B. No rounding — the site has no radius. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#152B4F',
          color: '#F6EEE0',
          fontSize: 44,
          fontWeight: 700,
          fontFamily: 'Georgia, serif',
          letterSpacing: '-0.02em',
        }}
      >
        B
      </div>
    ),
    size
  );
}
