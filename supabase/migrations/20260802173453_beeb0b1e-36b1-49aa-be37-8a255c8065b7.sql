-- ─── enums ───
do $$ begin
  create type request_status as enum ('NEW','CONTACTED','INTERESTED','CONVERTED','LOST');
exception when duplicate_object then null; end $$;

-- ─── product categories ───
create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  icon_name text,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.product_categories to anon;
grant select, insert, update, delete on public.product_categories to authenticated;
grant all on public.product_categories to service_role;

alter table public.product_categories enable row level security;

create policy "public read product categories" on public.product_categories
  for select to anon, authenticated using (true);
create policy "managers write product categories" on public.product_categories
  for all to authenticated
  using (public.has_min_role(auth.uid(), 'manager'))
  with check (public.has_min_role(auth.uid(), 'manager'));

create trigger trg_product_categories_updated_at before update on public.product_categories
  for each row execute function public.set_updated_at();

-- ─── extend products ───
alter table public.products
  add column if not exists category_id uuid references public.product_categories(id) on delete set null,
  add column if not exists gallery_images jsonb not null default '[]'::jsonb,
  add column if not exists benefits jsonb not null default '[]'::jsonb,
  add column if not exists hardware_specs jsonb not null default '[]'::jsonb,
  add column if not exists price_note text,
  add column if not exists show_request_button boolean not null default true,
  add column if not exists meta_title text,
  add column if not exists meta_desc text;

-- ─── product requests (leads) ───
create table if not exists public.product_requests (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  phone text not null,
  message text,
  status request_status not null default 'NEW',
  assigned_to uuid references public.profiles(id) on delete set null,
  notes text,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant insert on public.product_requests to anon;
grant select, insert, update on public.product_requests to authenticated;
grant all on public.product_requests to service_role;

alter table public.product_requests enable row level security;

create policy "anyone can submit a product request" on public.product_requests
  for insert to anon, authenticated with check (true);
create policy "staff read product requests" on public.product_requests
  for select to authenticated using (public.has_min_role(auth.uid(), 'staff'));
create policy "staff update product requests" on public.product_requests
  for update to authenticated
  using (public.has_min_role(auth.uid(), 'staff'))
  with check (public.has_min_role(auth.uid(), 'staff'));

create trigger trg_product_requests_updated_at before update on public.product_requests
  for each row execute function public.set_updated_at();

create index if not exists idx_product_requests_product on public.product_requests(product_id);
create index if not exists idx_product_requests_status on public.product_requests(status);

-- ─── admin activity log ───
create table if not exists public.admin_activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  actor_name text,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  detail jsonb,
  created_at timestamptz not null default now()
);

grant select, insert on public.admin_activity_log to authenticated;
grant all on public.admin_activity_log to service_role;

alter table public.admin_activity_log enable row level security;

create policy "admins read activity log" on public.admin_activity_log
  for select to authenticated using (public.has_min_role(auth.uid(), 'admin'));
create policy "staff write activity log" on public.admin_activity_log
  for insert to authenticated with check (public.has_min_role(auth.uid(), 'staff'));

create index if not exists idx_activity_created on public.admin_activity_log(created_at desc);

-- ─── product-tagged FAQs ───
alter table public.faqs
  add column if not exists product_id uuid references public.products(id) on delete set null;

-- ─── seed categories ───
insert into public.product_categories (name, slug, icon_name, description, sort_order) values
  ('Attendance & Access Hardware','attendance-access-hardware','Fingerprint','Biometric devices, auto check-in/out terminals and access control units built in-house.',1),
  ('Business Software','business-software','LayoutDashboard','Hostel, attendance and operations platforms that run day-to-day work.',2),
  ('Web Development','web-development','Globe','Corporate sites, portals and dashboards engineered for speed and SEO.',3),
  ('App Development','app-development','Smartphone','Native and cross-platform mobile apps for staff, students and customers.',4),
  ('Custom Solutions','custom-solutions','Wrench','Bespoke systems scoped around a workflow that off-the-shelf tools cannot cover.',5)
on conflict (name) do nothing;

-- map existing products to categories
update public.products set category_id = c.id
from public.product_categories c
where public.products.category_id is null
  and ((public.products.kind = 'HARDWARE' and c.slug = 'attendance-access-hardware')
    or (public.products.kind = 'SOFTWARE' and c.slug = 'business-software')
    or (public.products.kind = 'WEB_APP' and c.slug = 'web-development')
    or (public.products.kind = 'MOBILE_APP' and c.slug = 'app-development'));

-- ─── seed extra products ───
insert into public.products
  (name, display_name, slug, kind, tagline, description, icon_name, features, benefits, hardware_specs, price_note, sort_order, is_published, is_featured, category_id)
values
  ('Auto Check-in / Check-out Device','Auto Check-in / Check-out Device','auto-check-in-out-device','HARDWARE',
   'Touchless entry and exit logging for gates, hostels and factory floors.',
   'A wall-mounted terminal that records every entry and exit automatically using RFID cards or face recognition, then syncs to your attendance dashboard in real time. Works offline and uploads the moment connectivity returns.',
   'DoorOpen',
   '["RFID card and face recognition modes","Offline buffering with automatic sync","Real-time gate log on the dashboard","Guardian SMS on student check-out","Tamper alert and audit trail"]'::jsonb,
   '["Removes manual gate registers","Instant answers to who is inside right now","Exportable logs for audits"]'::jsonb,
   '[{"label":"Display","value":"5\" capacitive touch"},{"label":"Recognition","value":"Face + RFID 13.56 MHz"},{"label":"Capacity","value":"10,000 users / 200,000 logs"},{"label":"Connectivity","value":"Wi-Fi, Ethernet, optional 4G"},{"label":"Power","value":"12V DC with battery backup"}]'::jsonb,
   'Quoted per gate after a site survey.', 5, true, true,
   (select id from public.product_categories where slug = 'attendance-access-hardware')),
  ('Website Development','Website Development','website-development','WEB_APP',
   'Fast, SEO-ready corporate sites and portals built to your brand.',
   'We design and build marketing sites, customer portals and internal dashboards with a CMS your own team can run. Every build ships with performance budgets, structured data and analytics wired in.',
   'Globe',
   '["Custom design system, not a template","Editable CMS for every section","SEO, structured data and sitemaps","Analytics and lead tracking","Hosting and maintenance options"]'::jsonb,
   '["Pages that load in under two seconds","Content changes without a developer","Search visibility from day one"]'::jsonb,
   '[]'::jsonb,
   'Fixed-price packages after a scoping call.', 6, true, false,
   (select id from public.product_categories where slug = 'web-development')),
  ('Mobile App Development','Mobile App Development','mobile-app-development','MOBILE_APP',
   'Android and iOS apps for your staff, students and customers.',
   'From a student hostel app to a field-force attendance app, we ship cross-platform mobile products with offline support, push notifications and a shared backend with your existing systems.',
   'Smartphone',
   '["Android and iOS from one codebase","Offline-first data sync","Push notifications","Biometric login","Store submission handled for you"]'::jsonb,
   '["One codebase, both platforms","Works in low-connectivity sites","Connects to your existing dashboards"]'::jsonb,
   '[]'::jsonb,
   'Scoped per feature set.', 7, true, false,
   (select id from public.product_categories where slug = 'app-development'))
on conflict (slug) do nothing;

-- ─── seed demo requests ───
insert into public.product_requests (product_id, name, phone, message, status, notes, created_at)
select p.id, v.name, v.phone, v.message, v.status::request_status, v.notes, now() - v.ago
from (values
  ('hostel-management-system','Rakibul Hasan','01712345678','We run a 400-bed hostel and need billing plus gate logs.','NEW',null,interval '3 hours'),
  ('fingerprint-attendance-system','Nusrat Jahan','01819876543','Need 6 devices for our garments unit.','CONTACTED','Called 2 Aug — sending quotation.',interval '1 day'),
  ('auto-check-in-out-device','Mahmudul Karim','01911223344','Interested in face recognition at the main gate.','INTERESTED','Site survey booked.',interval '3 days'),
  ('website-development','Shahana Akter','01633445566','Corporate site with Bangla and English.','CONVERTED','Contract signed.',interval '9 days'),
  ('mobile-app-development','Tanvir Ahmed','01555667788',null,'LOST','Went with an in-house team.',interval '20 days')
) as v(slug,name,phone,message,status,notes,ago)
join public.products p on p.slug = v.slug
where not exists (select 1 from public.product_requests r where r.phone = v.phone);