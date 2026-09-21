'use client';

import { useState, useTransition } from 'react';
import { ArrowRight } from 'lucide-react';
import Field, { RadioPair } from './Field';
import { Stamp } from '@/components/ui/Primitives';
import { submitEnquiry } from '@/server/actions';

/**
 * One form component for both the contact and franchise pages — the fields
 * differ, the mechanics do not. Submitting calls the `submitEnquiry` server
 * function directly: it validates and writes to Neon on the server, and the
 * browser never talks to an endpoint of ours.
 *
 * The submit is handled rather than handed to `<form action>` on purpose — an
 * action-driven form is reset by React once it settles, which would empty the
 * fields a person still has to correct.
 *
 * On success the form is replaced in place by a RECEIVED stamp. No modal.
 */

const REASONS = ['General', 'Bulk order', 'Private event', 'Feedback', 'Franchise'];

export default function EnquiryForm({ kind = 'contact' }) {
  const isFranchise = kind === 'franchise';

  const [values, setValues] = useState({ hasProperty: '' });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  function onSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setErrors({});

    startTransition(async () => {
      let result;

      try {
        result = await submitEnquiry(kind, formData);
      } catch {
        setMessage('Could not reach us just now. Please call instead.');
        return;
      }

      if (!result.ok) {
        setErrors(result.errors ?? {});
        setMessage(result.error ?? '');
        return;
      }

      setMessage(result.message);
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-7 py-6" role="status">
        <Stamp lines={['Received']} />
        <p className="t-lede measure italic text-pencil">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 …"
          error={errors.phone}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={errors.email}
        />

        {isFranchise ? (
          <>
            <Field label="City of interest" name="city" autoComplete="address-level2" />
            <RadioPair
              label="Do you have a space of your own?"
              name="hasProperty"
              value={values.hasProperty}
              onChange={(value) => setValues((c) => ({ ...c, hasProperty: value }))}
              options={[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'Not yet' },
              ]}
            />
          </>
        ) : (
          <Field label="Reason" name="reason" as="select" options={REASONS} />
        )}

        <Field
          label="Message"
          name="message"
          as="textarea"
          className="md:col-span-2"
          error={errors.message}
          placeholder={
            isFranchise
              ? 'Tell us about the location you have in mind, and a little about yourself.'
              : 'Anything you want us to know.'
          }
        />

        {/* Honeypot — hidden from people, irresistible to bots. */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="mt-10 border-t border-ink/15 pt-8">
        {message ? (
          <p className="field__error mb-6">{message}</p>
        ) : null}

        <button type="submit" className="btn btn--primary" disabled={pending}>
          {pending ? 'Sending…' : 'Send'}
          <ArrowRight size={15} strokeWidth={1.5} />
        </button>
      </div>
    </form>
  );
}
