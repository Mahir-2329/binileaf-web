import ContactSheet from '@/components/gallery/ContactSheet';
import Reveal from '@/components/ui/Reveal';
import JsonLd from '@/components/seo/JsonLd';
import { TwoInCups } from '@/components/art/Illustrations';

import { getGallery } from '@/server/repo';
import { pageMeta, imageGallerySchema, breadcrumbSchema } from '@/lib/seo';

/**
 * Rebuilt on demand when the admin writes (see /api/revalidate); this window
 * is only the safety net for a ping that never arrived.
 */
export const revalidate = 600;

export const metadata = pageMeta({
  title: 'Gallery',
  description:
    'Photographs of Binileaf Café in the University Area of Ahmedabad — the room, the drinks, the food and the shopfront at night. All shot on site.',
  path: '/gallery',
});

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <>
      <JsonLd id="ld-gallery" data={imageGallerySchema(images)} />
      <JsonLd
        id="ld-gallery-crumbs"
        data={breadcrumbSchema([{ name: 'Gallery', href: '/gallery' }])}
      />

      <div className="shell pb-10 pt-[calc(var(--header-h)+clamp(3rem,7vw,6rem))]">
        <Reveal className="grid-page">
          <div className="col-span-full lg:col-span-7">
            <div className="deco-rule" />
            <h1 className="t-h1 letterpress mt-8">Gallery</h1>
            <p className="t-label mt-7 text-pencil">
              {String(images.length).padStart(3, '0')} frames · University Area, Ahmedabad · Shot on site
            </p>
            <p className="t-lede mt-7 max-w-[52ch] italic text-pencil">
              An index of a room, not a portfolio. Phone shots, mostly — taken across
              afternoons and closing time, in whatever light the bamboo screens let in.
            </p>
          </div>

          <div className="col-span-full hidden justify-end lg:col-span-3 lg:col-start-10 lg:flex">
            <TwoInCups size={180} className="text-paper-shade" />
          </div>
        </Reveal>
      </div>

      <div className="shell pb-[var(--spacing-section)]">
        <ContactSheet images={images} />
      </div>
    </>
  );
}
