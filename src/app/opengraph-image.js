import { ImageResponse } from 'next/og';
import { site, address, hours } from '@/data/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${site.name} — ${site.tagline}`;

/**
 * Navy ground, cream type, a brass rule and a stamp-red word. Same two-ink
 * discipline as the site: no gradient, no glow.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0C1A31',
          color: '#F6EEE0',
          padding: '68px 72px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 20,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#B5822F',
          }}
        >
          <span>Binileaf Café</span>
          <span>Ahmedabad</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 82, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            Bini is the bean.
          </div>
          <div style={{ display: 'flex', fontSize: 82, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            Leaf is the chai.
          </div>
          <div style={{ display: 'flex', fontSize: 82, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            We&nbsp;<span style={{ color: '#C0452C' }}>refuse</span>&nbsp;to choose.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', height: 1, width: 180, background: '#B5822F', marginBottom: 26 }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 22,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#C6B8A1',
            }}
          >
            <span>
              {address.locality}, {address.city}
            </span>
            <span>Open daily {hours.display}</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
