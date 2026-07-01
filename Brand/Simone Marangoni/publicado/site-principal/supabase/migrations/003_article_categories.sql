create table if not exists public.categories (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null,
  name text not null,
  slug text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists categories_tenant_slug_idx
on public.categories (tenant_id, slug);

create index if not exists categories_tenant_id_idx
on public.categories (tenant_id);

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.touch_updated_at();

alter table public.categories enable row level security;

grant select on public.categories to anon;
grant select, insert, update, delete on public.categories to authenticated;

drop policy if exists categories_public_select on public.categories;
create policy categories_public_select
on public.categories
for select
to anon
using (true);

drop policy if exists categories_select_same_tenant on public.categories;
create policy categories_select_same_tenant
on public.categories
for select
to authenticated
using (tenant_id = public.current_tenant_id());

drop policy if exists categories_insert_same_tenant on public.categories;
create policy categories_insert_same_tenant
on public.categories
for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin', 'advogada')
);

drop policy if exists categories_update_same_tenant on public.categories;
create policy categories_update_same_tenant
on public.categories
for update
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin', 'advogada')
)
with check (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin', 'advogada')
);

drop policy if exists categories_delete_admin_only on public.categories;
create policy categories_delete_admin_only
on public.categories
for delete
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin')
);

insert into public.categories (tenant_id, name, slug)
values
  ('4a0fae57-c55d-4f68-9b43-7f50b5d7659e', 'Direito Digital', 'direito-digital'),
  ('4a0fae57-c55d-4f68-9b43-7f50b5d7659e', 'Franchising', 'franchising')
on conflict (tenant_id, slug) do update
set
  name = excluded.name,
  updated_at = timezone('utc', now());
