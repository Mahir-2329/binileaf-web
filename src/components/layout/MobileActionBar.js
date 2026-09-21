'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MapPin, Phone } from 'lucide-react';
import { address, contact } from '@/data/site';

/**
 * The phone's call to action.
 *
 * The header holds two things and cannot hold a third across 360px, so the
 * two things you can actually do at a café live here instead: call, or get
 * directions. Nothing else — navigation belongs to the drawer, and there is
 * no ordering to link to.
 *
 * It appears only after the first screen (the hero and every page head carry
 * their own intent), hides behind any open overlay, and hides over the footer,
 * which already says the same two things — so no page needs bottom clearance.
 */

/** Franchise leads on its own ENQUIRE button and phone line; a second, different
 *  phone CTA underneath it would just be noise. */
const HIDDEN_ON = new Set(['/franchise']);

export default function MobileActionBar() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const atFooter = useRef(false);

  const hidden = HIDDEN_ON.has(pathname);

  useEffect(() => {
    if (hidden) return;

    const footer = document.querySelector('footer');

    const update = () => {
      const pastFirstScreen = window.scrollY > window.innerHeight * 0.6;
      setShown(pastFirstScreen && !atFooter.current);
    };

    const observer = footer
      ? new IntersectionObserver(
          ([entry]) => {
            atFooter.current = entry.isIntersecting;
            update();
          },
          { rootMargin: '0px 0px -120px 0px' }
        )
      : null;

    observer?.observe(footer);
    window.addEventListener('scroll', update, { passive: true });
    const id = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(id);
      observer?.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <nav
      className="action-bar on-navy lg:hidden"
      aria-label="Quick actions"
      data-shown={shown ? 'true' : 'false'}
    >
      <a href={`tel:${contact.phone}`} className="action-bar__half">
        <Phone size={16} strokeWidth={1.5} />
        Call
      </a>
      <a
        href={address.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="action-bar__half"
      >
        <MapPin size={16} strokeWidth={1.5} />
        Directions
      </a>
    </nav>
  );
}
