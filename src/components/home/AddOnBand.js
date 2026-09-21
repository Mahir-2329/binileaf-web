import { cx } from '@/lib/utils';

/**
 * The interruption: one full-bleed band in the second ink. Lives on the menu
 * page, where the add-ons actually are. No button — it is a statement.
 */
export default function AddOnBand({ compact = false }) {
  return (
    <section
      className={cx(
        'bg-stamp text-paper',
        compact ? 'py-[clamp(1.75rem,3.5vw,2.75rem)]' : 'py-[clamp(2.5rem,5vw,4rem)]'
      )}
    >
      <div className="shell">
        <div className="grid-page items-end gap-y-6">
          <h2 className={cx('col-span-full lg:col-span-6', compact ? 't-h3' : 't-h2')}>
            Add a shot. Add a scoop.
          </h2>

          <p className="t-body col-span-full italic text-paper/85 lg:col-span-5 lg:col-start-8">
            Either one goes into anything already on your table, and nobody will ask why.
          </p>
        </div>
      </div>
    </section>
  );
}
