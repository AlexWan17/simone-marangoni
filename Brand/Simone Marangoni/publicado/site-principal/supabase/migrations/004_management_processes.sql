create table if not exists public.processos (
  id uuid primary key default extensions.gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  numero_processo text not null,
  nome_cliente text not null,
  pasta_interna text,
  sistema_origem text not null,
  status text not null default 'ativo',
  resumo_andamento text,
  historico_movimentacoes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint processos_sistema_origem_check check (
    sistema_origem in ('e-SAJ', 'e-Proc', 'PJe')
  ),
  constraint processos_status_check check (
    status in ('ativo', 'arquivado')
  )
);

create unique index if not exists processos_tenant_numero_idx
on public.processos (tenant_id, numero_processo);

create index if not exists processos_tenant_status_idx
on public.processos (tenant_id, status);

drop trigger if exists set_processos_updated_at on public.processos;
create trigger set_processos_updated_at
before update on public.processos
for each row
execute function public.touch_updated_at();

alter table public.processos enable row level security;

grant select, insert, update, delete on public.processos to authenticated;

drop policy if exists processos_select_same_tenant on public.processos;
create policy processos_select_same_tenant
on public.processos
for select
to authenticated
using (tenant_id = public.current_tenant_id());

drop policy if exists processos_insert_same_tenant on public.processos;
create policy processos_insert_same_tenant
on public.processos
for insert
to authenticated
with check (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin', 'advogada')
);

drop policy if exists processos_update_same_tenant on public.processos;
create policy processos_update_same_tenant
on public.processos
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

drop policy if exists processos_delete_admin_only on public.processos;
create policy processos_delete_admin_only
on public.processos
for delete
to authenticated
using (
  tenant_id = public.current_tenant_id()
  and public.current_user_role() in ('super_admin', 'admin')
);
