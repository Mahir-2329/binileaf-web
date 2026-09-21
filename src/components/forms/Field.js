'use client';

import { useId } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { cx } from '@/lib/utils';

/**
 * Underline fields only — no boxes, no radius. The label is always visible;
 * placeholders are for format hints, never as a label substitute.
 */
export default function Field({
  label,
  name,
  type = 'text',
  as = 'input',
  required,
  error,
  hint,
  options,
  className,
  ...rest
}) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  const controlProps = {
    id,
    name,
    required,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    className: 'field__control',
    ...rest,
  };

  return (
    <div className={cx('field', error && 'field--error', className)}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required ? (
          <span className="field__req" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {as === 'textarea' ? (
        <textarea {...controlProps} />
      ) : as === 'select' ? (
        <div className="relative">
          <select {...controlProps}>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-pencil"
          />
        </div>
      ) : (
        <input type={type} {...controlProps} />
      )}

      {error ? (
        <p className="field__error" id={`${id}-error`}>
          <AlertCircle size={13} strokeWidth={1.5} />
          {error}
        </p>
      ) : hint ? (
        <p className="t-caption mt-2" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** A radio pair set as two underline-free boxes, matching the chip vocabulary. */
export function RadioPair({ label, name, value, onChange, options, required }) {
  return (
    <fieldset className="field">
      <legend className="field__label">
        {label}
        {required ? (
          <span className="field__req" aria-hidden="true">
            *
          </span>
        ) : null}
      </legend>
      <div className="mt-1 flex gap-2">
        {options.map((option) => (
          <label key={option.value} className="chip cursor-pointer" aria-pressed={value === option.value}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(event) => onChange(event.target.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
