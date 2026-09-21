'use server';

import { headers } from 'next/headers';
import { createEnquiry } from './repo';
import { validate } from './enquiry';

/**
 * Server Functions — the only way the browser writes anything here.
 *
 * There is deliberately no route under `/api`: an action is dispatched as a
 * POST to the page it was rendered on, so the site exposes no endpoint of its
 * own to read, enumerate or replay. The work still happens on the server, so
 * the validation below is the real gate, not the form's markup.
 */

export async function submitEnquiry(kind, formData) {
  const body = Object.fromEntries(formData.entries());
  body.kind = kind;

  // Honeypot: real people never fill a field they cannot see.
  if (String(body.website ?? '').trim() !== '') {
    return { ok: true, message: 'Thanks — we have your details.' };
  }

  const { clean, errors, ok } = validate(body);
  if (!ok) return { ok: false, errors };

  try {
    const userAgent = (await headers()).get('user-agent') ?? '';
    await createEnquiry({ ...clean, userAgent });
  } catch (error) {
    console.error('[binileaf] could not store enquiry:', error.message);
    return {
      ok: false,
      error: 'We could not save that just now. Please call us on 87586 85932.',
    };
  }

  return {
    ok: true,
    message:
      clean.kind === 'franchise'
        ? 'Thanks — we have your details. One of us will call you within two working days.'
        : 'Thanks for writing in. We read every message and will get back to you shortly.',
  };
}
