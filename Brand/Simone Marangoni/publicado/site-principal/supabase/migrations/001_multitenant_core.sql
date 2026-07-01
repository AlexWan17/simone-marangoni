create extension if not exists pgcrypto with schema extensions;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.tenants (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  tenant_id uuid not null,
  full_name text not null,
  role text not null check (role in ('super_admin', 'admin', 'advogada', 'assistente')),
  job_title text,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.leads (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null,
  full_name text not null,
  email text,
  phone text,
  case_type text,
  message text,
  status text not null default 'especulacao' check (
    status in (
      'especulacao',
      'novo',
      'em_analise',
      'contato_realizado',
      'proposta_enviada',
      'cliente_convertido',
      'encerrado',
      'descartado'
    )
  ),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  annotations text,
  lgpd_consent boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.articles (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null,
  title text not null,
  slug text not null,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  published_at timestamptz,
  category text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.config_perfil (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null unique,
  nome_profissional text not null,
  subtitulo_hero text,
  biografia text,
  logo_url text,
  whatsapp text,
  linkedin text,
  instagram text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists tenants_slug_idx on public.tenants (slug);
create index if not exists profiles_tenant_id_idx on public.profiles (tenant_id);
create index if not exists leads_tenant_id_idx on public.leads (tenant_id);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists articles_tenant_id_idx on public.articles (tenant_id);
create unique index if not exists articles_tenant_slug_idx on public.articles (tenant_id, slug);
create index if not exists articles_status_idx on public.articles (status);
create unique index if not exists config_perfil_tenant_id_idx on public.config_perfil (tenant_id);

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select tenant_id
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

drop trigger if exists set_tenants_updated_at on public.tenants;
create trigger set_tenants_updated_at
before update on public.tenants
for each row
execute function public.touch_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row
execute function public.touch_updated_at();

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row
execute function public.touch_updated_at();

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row
execute function public.touch_updated_at();

drop trigger if exists set_config_perfil_updated_at on public.config_perfil;
create trigger set_config_perfil_updated_at
before update on public.config_perfil
for each row
execute function public.touch_updated_at();

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.articles enable row level security;
alter table public.config_perfil enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.articles to anon;
grant select on public.config_perfil to anon;
grant select on public.tenants to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.articles to authenticated;
grant select, insert, update, delete on public.config_perfil to authenticated;

drop policy if exists tenants_select_same_tenant on public.tenants;
create policy tenants_select_same_tenant
on public.tenants
for select
to authenticated
using (id = public.current_tenant_id());

drop policy if exists profiles_select_same_tenant on public.profiles;
create policy profiles_select_same_tenant
on public.profiles
for select
to authenticated
using (tenant_id = public.current_tenant_id());

drop policy if exists profiles_insert_same_tenant on public.profiles;
create policy profiles_insert_same_tenant
on public.profiles
for insert
to authenticated
with check (
  id = auth.uid()
  and tenant_id = public.current_tenant_id()
);

drop policy if exists profiles_update_self_or_admin on public.profiles;
create policy profiles_update_self_or_admin
on public.profiles
for update
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and (
    id = auth.uid()
    or public.current_user_role() in ('super_admin', 'admin')
  )
)
with check (
  tenant_id = public.current_tenant_id()
  and (
    id = auth.uid()
    or public.current_user_role() in ('super_admin', 'admin')
  )
);

drop policy if exists leads_select_same_tenant on public.leads;
create policy leads_select_same_tenant
on public.leads
for select
to authenticated
using (tenant_id = public.current_tenant_id());

drop policy if exists leads_insert_same_tenant on public.leads;
create policy leads_insert_same_tenant
on public.leads
for insert
to authenticated
with check (tenant_id = public.current_tenant_id());

drop policy if exists leads_update_same_tenant on public.leads;
create policy leads_update_same_tenant
on public.leads
for update
to authenticated
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

drop policy if exists leads_delete_admin_only on public.leads;
create policy leads_delete_admin_only
on public.leads
for delete
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin', 'advogada')
);

drop policy if exists articles_public_select_published on public.articles;
create policy articles_public_select_published
on public.articles
for select
to anon
using (status = 'published');

drop policy if exists articles_select_same_tenant on public.articles;
create policy articles_select_same_tenant
on public.articles
for select
to authenticated
using (tenant_id = public.current_tenant_id());

drop policy if exists articles_insert_same_tenant on public.articles;
create policy articles_insert_same_tenant
on public.articles
for insert
to authenticated
with check (tenant_id = public.current_tenant_id());

drop policy if exists articles_update_same_tenant on public.articles;
create policy articles_update_same_tenant
on public.articles
for update
to authenticated
using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

drop policy if exists articles_delete_admin_only on public.articles;
create policy articles_delete_admin_only
on public.articles
for delete
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin', 'advogada')
);

drop policy if exists config_perfil_public_select on public.config_perfil;
create policy config_perfil_public_select
on public.config_perfil
for select
to anon
using (true);

drop policy if exists config_perfil_select_same_tenant on public.config_perfil;
create policy config_perfil_select_same_tenant
on public.config_perfil
for select
to authenticated
using (tenant_id = public.current_tenant_id());

drop policy if exists config_perfil_insert_same_tenant on public.config_perfil;
create policy config_perfil_insert_same_tenant
on public.config_perfil
for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin', 'advogada')
);

drop policy if exists config_perfil_update_same_tenant on public.config_perfil;
create policy config_perfil_update_same_tenant
on public.config_perfil
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

drop policy if exists config_perfil_delete_admin_only on public.config_perfil;
create policy config_perfil_delete_admin_only
on public.config_perfil
for delete
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin')
);

insert into public.tenants (id, name, slug, status)
values (
  '4a0fae57-c55d-4f68-9b43-7f50b5d7659e',
  'Simone Marangoni Platform',
  'simone-marangoni-platform',
  'active'
)
on conflict (slug) do update
set
  name = excluded.name,
  status = excluded.status,
  updated_at = timezone('utc', now());

insert into public.config_perfil (
  tenant_id,
  nome_profissional,
  subtitulo_hero,
  biografia,
  logo_url,
  whatsapp,
  linkedin,
  instagram
)
values (
  '4a0fae57-c55d-4f68-9b43-7f50b5d7659e',
  'Simone Marangoni',
  'Advocacia boutique com rigor estrategico, sofisticacao e presenca institucional premium.',
  'Estrutura inicial para o ecossistema digital da advocacia Simone Marangoni, com foco em posicionamento premium, conteudo organico e relacionamento qualificado com potenciais clientes.',
  '/images/logo-simone.png',
  null,
  null,
  null
)
on conflict (tenant_id) do update
set
  nome_profissional = excluded.nome_profissional,
  subtitulo_hero = excluded.subtitulo_hero,
  biografia = excluded.biografia,
  logo_url = excluded.logo_url,
  whatsapp = excluded.whatsapp,
  linkedin = excluded.linkedin,
  instagram = excluded.instagram,
  updated_at = timezone('utc', now());
