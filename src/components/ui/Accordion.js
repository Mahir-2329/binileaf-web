'use client';

import { useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * A ruled ledger, not a stack of boxes: hairline rows, a plus that becomes a
 * minus, and a panel that opens on grid-template-rows so the height animates
 * without being measured.
 */
export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  const baseId = useId();

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;

        return (
          <div key={item.q} className="acc__row">
            <h3>
              <button
                type="button"
                id={buttonId}
                className="acc__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="acc__q">{item.q}</span>
                <span className="mt-1 shrink-0 text-pencil" aria-hidden="true">
                  {isOpen ? <Minus size={24} strokeWidth={1} /> : <Plus size={24} strokeWidth={1} />}
                </span>
              </button>
            </h3>

            <div className="acc__panel" data-open={isOpen} id={panelId} role="region" aria-labelledby={buttonId}>
              <div>
                <p className="t-body max-w-[58ch] pb-7 text-pencil">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
