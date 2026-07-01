alter table public.processos
drop constraint if exists processos_sistema_origem_check;

alter table public.processos
add constraint processos_sistema_origem_check check (
  sistema_origem in ('e-SAJ', 'e-Proc', 'PJe', 'Outro')
);
