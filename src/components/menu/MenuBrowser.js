'use client';

import { useDeferredValue, useId, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import CategoryChips from './CategoryChips';
import MenuGroup from './MenuGroup';
import Reveal from '@/components/ui/Reveal';
import { SpecialLegend } from '@/components/ui/SpecialMark';

/**
 * The card, plus a way to find one thing on it.
 *
 * Search filters in place rather than navigating: categories that match keep
 * their heading and their matching rows, categories that do not simply are not
 * printed. The whole card is still in the initial HTML, so the 81 items remain
 * indexable and the JSON-LD still describes what the page shows.
 */

/** The one tinted field on the paper half of the card. */
const TONE = { lemonade: 'shade' };

/**
 * Cold Beverages carries a third more items than either neighbour, so on a
 * wide screen it gets a double column and splits internally — which is exactly
 * what the printed card does, and what stops the short columns ending in 400px
 * of dead paper.
 */
const WIDE = new Set(['cold']);

/**
 * Split a double column's categories into two stacks of roughly equal length.
 *
 * They used to be laid in a two-column grid, and a grid aligns rows: a short
 * category next to a long one left a hole the height of the difference —
 * 400px of blank paper between Ice Tea and Mocktails. Two independent stacks
 * have no rows to align, so each one closes up behind the category above it.
 *
 * The split is by weight, not by count, so the two stacks end at about the
 * same depth; the order stays the order the categories are in, read down the
 * first stack and then the second, the way a printed card is read.
 *
 * The admin's preview splits the same way — see `menu/shared.js` there.
 */
export function splitStacks(groups) {
  const weigh = (group) => 1 + (group.items?.length ?? 0);
  const total = groups.reduce((sum, group) => sum + weigh(group), 0);

  const left = [];
  const right = [];
  let filled = 0;

  for (const group of groups) {
    const weight = weigh(group);
    // Keep at least one category on each side, whatever the weights say.
    const room = filled + weight / 2 <= total / 2 || left.length === 0;
    const last = right.length === 0 && groups.indexOf(group) === groups.length - 1;

    if (room && !last) {
      left.push(group);
      filled += weight;
    } else {
      right.push(group);
    }
  }

  return [left, right];
}

const normalise = (value) => value.toLowerCase().trim();

function filterSections(sections, query) {
  if (!query) return sections;

  return sections
    .map((section) => {
      const groupMatches = normalise(section.title).includes(query);

      const groups = section.groups
        .map((group) => {
          // A category name that matches keeps all of its items.
          if (groupMatches || normalise(group.title).includes(query)) return group;

          const items = group.items.filter((item) => normalise(item.name).includes(query));
          return items.length ? { ...group, items } : null;
        })
        .filter(Boolean);

      return groups.length ? { ...section, groups } : null;
    })
    .filter(Boolean);
}

const countItems = (sections) =>
  sections.reduce((n, section) => n + section.groups.reduce((m, g) => m + g.items.length, 0), 0);

export default function MenuBrowser({ columns, barista, railGroups }) {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(normalise(query));
  const inputId = useId();

  const searching = deferred.length > 0;

  const shownColumns = useMemo(() => filterSections(columns, deferred), [columns, deferred]);
  const shownBarista = useMemo(
    () => (barista ? filterSections([barista], deferred)[0] ?? null : null),
    [barista, deferred]
  );

  const results = countItems(shownColumns) + (shownBarista ? countItems([shownBarista]) : 0);

  return (
    <>
      {/* ── search ──────────────────────────────────────────────────── */}
      <div className="shell pt-8">
        <div className="field flex items-center gap-3 border-b border-ink/30 pb-2 focus-within:border-stamp">
          <Search size={17} strokeWidth={1.5} className="shrink-0 text-pencil" aria-hidden="true" />

          <label htmlFor={inputId} className="sr-only">
            Search the menu
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Find a drink, a dish, a category…"
            autoComplete="off"
            className="min-w-0 flex-1 border-0 bg-transparent py-2 font-[family-name:var(--font-body)] text-[1.0625rem] text-ink outline-none placeholder:text-pencil/60 [&::-webkit-search-cancel-button]:hidden"
          />

          {searching ? (
            <>
              <span className="t-label tabular shrink-0 text-pencil">
                {String(results).padStart(2, '0')}{' '}
                {results === 1 ? 'result' : 'results'}
              </span>
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-pencil transition-colors hover:text-stamp"
              >
                <X size={17} strokeWidth={1.5} />
              </button>
            </>
          ) : null}
        </div>
      </div>

      {searching ? null : <CategoryChips groups={railGroups} />}

      {/* ── the card ─────────────────────────────────────────────────
          Three named columns, exactly as the printed card is set. Sections are
          real columns rather than a balanced multicol flow, so nothing can
          land beside something it has no business being beside. */}
      <div className="shell pt-10">
        {results === 0 && searching ? (
          <p className="t-lede measure italic text-pencil">
            Nothing on the card matches “{query.trim()}”. Try a shorter word — or ask us, we
            change things.
          </p>
        ) : (
          <div className="grid gap-x-[clamp(2rem,3.5vw,4rem)] gap-y-[var(--spacing-section-tight)] md:grid-cols-2 xl:grid-cols-4">
            {shownColumns.map((section) => {
              const wide = !searching && WIDE.has(section.id);

              return (
                <section
                  key={section.id}
                  className={`flex min-w-0 flex-col ${wide ? 'xl:col-span-2' : ''}`}
                >
                  <Reveal>
                    <h2 className="t-h2 letterpress">{section.title}</h2>
                    <div className="mt-4 border-t-2 border-ink" />
                  </Reveal>

                  {wide ? (
                    /*
                      Below xl the wrappers are `display: contents`, so the
                      categories are grid items of this one-column grid in
                      their own order. From xl each wrapper becomes a stack of
                      its own, side by side — and a short category no longer
                      waits for a tall neighbour's row to end.
                    */
                    <div className="mt-9 grid gap-x-[clamp(2rem,3vw,3.5rem)] gap-y-10 xl:grid-cols-2 xl:items-start">
                      {splitStacks(section.groups).map((stack, side) => (
                        <div key={side} className="contents xl:flex xl:flex-col xl:gap-10">
                          {stack.map((group) => (
                            <MenuGroup
                              key={group.id}
                              group={group}
                              family={group.family ?? 'ink'}
                              tone={TONE[group.id]}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-9 flex flex-col gap-10">
                      {section.groups.map((group) => (
                        <MenuGroup
                          key={group.id}
                          group={group}
                          family={group.family ?? 'ink'}
                          tone={TONE[group.id]}
                        />
                      ))}
                    </div>
                  )}

                  {/* A rule closes the column, the way a printed one does —
                      so the paper below it reads as finished, not abandoned. */}
                  <div className="mt-10 border-t border-ink/25" aria-hidden="true" />
                </section>
              );
            })}
          </div>
        )}

        {results > 0 ? (
          <div className="rule-hair mt-14 pt-5">
            <SpecialLegend />
          </div>
        ) : null}
      </div>

      {/* ── the second plate ─────────────────────────────────────────
          The six drinks that exist nowhere else, inverted and full width. */}
      {shownBarista ? (
        <section className="on-navy grain-dark mt-[var(--spacing-section)] bg-ink-deep text-paper">
          <div className="shell section--tight section">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                <h2 className="t-h2">{shownBarista.title}</h2>
                <p className="t-lede max-w-[42ch] italic text-paper-dim">{shownBarista.blurb}</p>
              </div>
              <div className="mt-5 border-t-2 border-brass" />
            </Reveal>

            <div className="mt-10 grid gap-x-[clamp(2rem,4vw,4.5rem)] gap-y-12 lg:grid-cols-2">
              {shownBarista.groups.map((group) => (
                <MenuGroup key={group.id} group={group} tone="plainNavy" />
              ))}
            </div>

            <div className="mt-12 border-t border-brass/40 pt-5">
              <SpecialLegend tone="paper" />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
