import 'server-only';

/**
 * Validation for the contact and franchise forms.
 *
 * Kept apart from the action itself because a `'use server'` module may only
 * export async functions — and because this is the one piece worth reading on
 * its own when the rules change.
 */

const MAX = { name: 80, email: 120, phone: 20, city: 80, message: 2000 };

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v) => /^[+]?[\d\s-]{7,15}$/.test(v);

const text = (value) => String(value ?? '').trim();

export function validate(body) {
  const errors = {};
  const clean = {};

  const name = text(body.name);
  if (name.length < 2) errors.name = 'Please tell us your name.';
  else if (name.length > MAX.name) errors.name = 'That name is too long.';
  else clean.name = name;

  const email = text(body.email);
  if (!isEmail(email)) errors.email = 'That email address does not look right.';
  else if (email.length > MAX.email) errors.email = 'That email address is too long.';
  else clean.email = email;

  const phone = text(body.phone);
  if (phone && !isPhone(phone)) errors.phone = 'That phone number does not look right.';
  else clean.phone = phone;

  const message = text(body.message);
  if (message.length > MAX.message) errors.message = 'Please keep it under 2000 characters.';
  else clean.message = message;

  clean.city = text(body.city).slice(0, MAX.city);
  clean.hasProperty = ['yes', 'no'].includes(body.hasProperty) ? body.hasProperty : '';
  clean.kind = body.kind === 'franchise' ? 'franchise' : 'contact';

  // What the contact form's select was set to. It is a field of its own, not a
  // `[Bulk order]` glued to the front of the message — the café reads that
  // message, and sorting by what it is about is the admin's job, not the
  // reader's.
  const reason = text(body.reason);
  clean.topic = reason && clean.kind === 'contact' ? reason.slice(0, 40) : '';

  return { clean, errors, ok: Object.keys(errors).length === 0 };
}
