-- ════════════════════════════════════════════════════════════════════════
-- Binileaf — Neon Postgres schema
--
-- Idempotent: safe to run repeatedly. Designed so a future admin portal can
-- add, hide, reprice and promote things without a deploy:
--   * every content table has `is_active` + `position` + `updated_at`
--   * menu items carry description, photo, availability and dietary tags
--   * `offers` covers discounts, combos and announcements with a live window
--   * `settings` is a free-form key/value store for anything not yet modelled
-- ════════════════════════════════════════════════════════════════════════

create extension if not exists "pgcrypto";

-- Keeps `updated_at` honest without the application having to remember.
create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ──────────────────────────────────────────────────────────────── media ────
-- One row per image, bytes included. `path` is what the browser requests; the
-- route handler at src/app/media/[...path] looks the row up and streams `data`
-- back, so nothing is served from /public. Swapping to a CDN later means
-- pointing `path` elsewhere and leaving everything else alone.
create table if not exists media (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  path        text not null,
  width       integer not null check (width > 0),
  height      integer not null check (height > 0),
  alt         text not null default '',
  caption     text,
  credit      text,
  category    text not null default 'misc',
  tags        text[] not null default '{}',
  orientation text generated always as (
                case
                  when width > height then 'landscape'
                  when width < height then 'portrait'
                  else 'square'
                end
              ) stored,
  has_alpha   boolean not null default false,
  bytes        integer,
  content_type text not null default 'image/webp',
  data         bytea,
  checksum     text,
  source       text,
  in_gallery  boolean not null default false,
  is_active   boolean not null default true,
  position    integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- `create table if not exists` will not widen a table that already exists, so
-- every column added after the first release is also stated as an ALTER.
alter table media add column if not exists caption      text;
alter table media add column if not exists credit       text;
alter table media add column if not exists is_active    boolean not null default true;
alter table media add column if not exists updated_at   timestamptz not null default now();
alter table media add column if not exists content_type text not null default 'image/webp';
alter table media add column if not exists data         bytea;
alter table media add column if not exists checksum     text;

alter table menu_groups add column if not exists family     text not null default 'ink';
alter table menu_groups add column if not exists media_slug text;
alter table menu_items  add column if not exists slug          text;
alter table menu_items  add column if not exists description   text;
alter table menu_items  add column if not exists compare_price integer;
alter table menu_items  add column if not exists is_new        boolean not null default false;
alter table menu_items  add column if not exists is_vegetarian boolean not null default true;
alter table menu_items  add column if not exists contains_egg  boolean not null default false;
alter table menu_items  add column if not exists allergens     text[] not null default '{}';
alter table menu_items  add column if not exists tags          text[] not null default '{}';
alter table menu_items  add column if not exists media_slug    text;
alter table menu_items  add column if not exists is_available  boolean not null default true;
alter table faqs        add column if not exists topic         text not null default 'general';

-- ── nothing is ever erased ────────────────────────────────────────────────
-- Every "delete" in the admin is `deleted_at = now(), is_active = false`. The
-- row stays: the audit log points at it, an enquiry may quote it, and a café
-- that deletes the wrong thing at 11pm can have it back. Readers that already
-- filter `is_active` therefore need no change; the admin's own lists, which
-- deliberately show retired rows, filter `deleted_at is null` instead.
alter table media          add column if not exists deleted_at timestamptz;
alter table menu_sections  add column if not exists deleted_at timestamptz;
alter table menu_groups    add column if not exists deleted_at timestamptz;
alter table menu_items     add column if not exists deleted_at timestamptz;
alter table menu_item_variants add column if not exists deleted_at timestamptz;
alter table offers         add column if not exists deleted_at timestamptz;
alter table faqs           add column if not exists deleted_at timestamptz;
alter table enquiries      add column if not exists deleted_at timestamptz;

-- A slug is only taken while the row that has it is still live, so deleting
-- "Hot Coffee" and making it again works. `media.slug` keeps its plain unique
-- constraint because four foreign keys point at it.
alter table menu_sections drop constraint if exists menu_sections_slug_key;
alter table menu_groups   drop constraint if exists menu_groups_slug_key;
alter table menu_items    drop constraint if exists menu_items_slug_key;
alter table offers        drop constraint if exists offers_slug_key;
drop index if exists menu_items_slug_key;

create unique index if not exists menu_sections_slug_live on menu_sections (slug) where deleted_at is null;
create unique index if not exists menu_groups_slug_live   on menu_groups (slug)   where deleted_at is null;
create unique index if not exists menu_items_slug_live    on menu_items (slug)    where deleted_at is null;
create unique index if not exists offers_slug_live        on offers (slug)        where deleted_at is null;

create index if not exists media_live_idx         on media (deleted_at);
create index if not exists menu_items_live_idx    on menu_items (group_id, position) where deleted_at is null;
create index if not exists menu_groups_live_idx   on menu_groups (section_id, position) where deleted_at is null;
alter table enquiries   add column if not exists topic         text;
alter table enquiries   add column if not exists notes         text;
alter table enquiries   add column if not exists updated_at    timestamptz not null default now();
alter table content_blocks add column if not exists label      text;

create index if not exists media_category_idx on media (category);
create index if not exists media_gallery_idx  on media (in_gallery, position);
create index if not exists media_tags_idx     on media using gin (tags);
create index if not exists media_path_idx     on media (path);

drop trigger if exists media_touch on media;
create trigger media_touch before update on media
  for each row execute function touch_updated_at();

-- ───────────────────────────────────────────────────────────────── menu ────

create table if not exists menu_sections (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  title      text not null,
  kicker     text,
  blurb      text,
  media_slug text references media (slug) on delete set null,
  position   integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_groups (
  id         uuid primary key default gen_random_uuid(),
  section_id uuid not null references menu_sections (id) on delete cascade,
  slug       text not null unique,
  title      text not null,
  note       text,
  -- 'bean' rules in brass, 'leaf' in green, 'ink' plain: the bean/leaf split.
  family     text not null default 'ink' check (family in ('bean', 'leaf', 'ink')),
  media_slug text references media (slug) on delete set null,
  position   integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists menu_items (
  id            uuid primary key default gen_random_uuid(),
  group_id      uuid not null references menu_groups (id) on delete cascade,
  slug          text unique,
  name          text not null,
  description   text,
  price         integer not null check (price >= 0),
  -- Set when the item is on offer; the card shows it struck through.
  compare_price integer check (compare_price is null or compare_price > price),
  is_star       boolean not null default false,
  is_new        boolean not null default false,
  is_vegetarian boolean not null default true,
  contains_egg  boolean not null default false,
  allergens     text[] not null default '{}',
  tags          text[] not null default '{}',
  note          text,
  media_slug    text references media (slug) on delete set null,
  -- `is_active` hides an item for good; `is_available` is the daily 86 list.
  is_active     boolean not null default true,
  is_available  boolean not null default true,
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Sizes, temperatures, milk swaps — anything that reprices one item.
create table if not exists menu_item_variants (
  id           uuid primary key default gen_random_uuid(),
  item_id      uuid not null references menu_items (id) on delete cascade,
  label        text not null,
  price_delta  integer not null default 0,
  is_default   boolean not null default false,
  is_active    boolean not null default true,
  position     integer not null default 0
);

create index if not exists menu_groups_section_idx on menu_groups (section_id, position);
create index if not exists menu_items_group_idx    on menu_items (group_id, position);
create index if not exists menu_items_star_idx     on menu_items (is_star) where is_star;
create index if not exists menu_items_tags_idx     on menu_items using gin (tags);
create index if not exists variants_item_idx       on menu_item_variants (item_id, position);

drop trigger if exists menu_sections_touch on menu_sections;
create trigger menu_sections_touch before update on menu_sections
  for each row execute function touch_updated_at();

drop trigger if exists menu_groups_touch on menu_groups;
create trigger menu_groups_touch before update on menu_groups
  for each row execute function touch_updated_at();

drop trigger if exists menu_items_touch on menu_items;
create trigger menu_items_touch before update on menu_items
  for each row execute function touch_updated_at();

-- ─────────────────────────────────────────────────────────────── offers ────
-- Discounts, combos, happy hours and plain announcements share one table:
-- they differ only in `kind` and in how the value is expressed.
create table if not exists offers (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  kind         text not null default 'announcement'
                 check (kind in ('discount', 'combo', 'happy_hour', 'announcement')),
  title        text not null,
  subtitle     text,
  body         text,
  code         text,
  value_type   text not null default 'none' check (value_type in ('percent', 'flat', 'none')),
  value        integer check (value is null or value >= 0),
  -- Which part of the menu it applies to, e.g.
  -- {"groups": ["hot-coffee"], "items": ["golden-drift"], "min_spend": 500}
  applies_to   jsonb not null default '{}'::jsonb,
  -- Where it should surface: {"home_band": true, "menu_top": false}
  placement    jsonb not null default '{}'::jsonb,
  media_slug   text references media (slug) on delete set null,
  starts_at    timestamptz,
  ends_at      timestamptz,
  -- Optional recurring window, e.g. {"days": [1,2,3], "from": "16:00", "to": "19:00"}
  schedule     jsonb,
  priority     integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint offers_window check (ends_at is null or starts_at is null or ends_at > starts_at)
);

create index if not exists offers_live_idx on offers (is_active, priority desc, starts_at, ends_at);

drop trigger if exists offers_touch on offers;
create trigger offers_touch before update on offers
  for each row execute function touch_updated_at();

/** Offers that should be showing right now, best first. */
create or replace view live_offers as
  select *
  from offers
  where is_active
    and deleted_at is null
    and (starts_at is null or starts_at <= now())
    and (ends_at   is null or ends_at   >= now())
  order by priority desc, created_at desc;

-- ────────────────────────────────────────────────────────────────── faq ────
create table if not exists faqs (
  id         uuid primary key default gen_random_uuid(),
  question   text not null,
  answer     text not null,
  topic      text not null default 'general',
  position   integer not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists faqs_touch on faqs;
create trigger faqs_touch before update on faqs
  for each row execute function touch_updated_at();

-- ────────────────────────────────────────────────────────────── content ────
-- Long-form copy (story, values, franchise, quick facts) as addressable JSON
-- blocks, so text can be edited without a deploy.
create table if not exists content_blocks (
  key        text primary key,
  label      text,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Anything not worth its own table yet: hours overrides, banner text, flags.
create table if not exists settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

drop trigger if exists settings_touch on settings;
create trigger settings_touch before update on settings
  for each row execute function touch_updated_at();

-- ──────────────────────────────────────────────────────────── enquiries ────
create table if not exists enquiries (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null default 'contact' check (kind in ('contact', 'franchise')),
  name         text not null,
  email        text not null,
  phone        text,
  city         text,
  has_property text check (has_property in ('yes', 'no', '')),
  topic        text,
  message      text,
  status       text not null default 'new' check (status in ('new', 'read', 'replied', 'spam')),
  notes        text,
  user_agent   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists enquiries_created_idx on enquiries (created_at desc);
create index if not exists enquiries_status_idx  on enquiries (status, created_at desc);

drop trigger if exists enquiries_touch on enquiries;
create trigger enquiries_touch before update on enquiries
  for each row execute function touch_updated_at();

-- ═══════════════════════════════════════════════════════════════ admin ════
-- Everything below exists so the café can run the site without a deploy.
-- The admin app (../admin) is a second Next.js app on this same database.

create table if not exists admin_users (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  name           text,
  -- scrypt, stored as `scrypt$<N>$<r>$<p>$<salt-hex>$<key-hex>`
  password_hash  text not null,
  role           text not null default 'owner' check (role in ('owner', 'editor')),
  otp_code       text,
  otp_expires_at timestamptz,
  otp_attempts   integer not null default 0,
  last_login_at  timestamptz,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists admin_users_touch on admin_users;
create trigger admin_users_touch before update on admin_users
  for each row execute function touch_updated_at();

-- ── where each photograph appears ─────────────────────────────────────────
-- One row per image slot on the site. Pages read these instead of hard-coding
-- a path, so swapping the hero photograph is an edit rather than a deploy.
create table if not exists media_placements (
  key        text primary key,
  label      text not null,
  page       text not null,
  hint       text,
  aspect     text,
  media_slug text references media (slug) on delete set null,
  position   integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists placements_page_idx on media_placements (page, position);

drop trigger if exists placements_touch on media_placements;
create trigger placements_touch before update on media_placements
  for each row execute function touch_updated_at();

-- ── a record of who changed what ──────────────────────────────────────────
create table if not exists audit_log (
  id         uuid primary key default gen_random_uuid(),
  actor      text,
  action     text not null,
  entity     text not null,
  entity_id  text,
  detail     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_created_idx on audit_log (created_at desc);
