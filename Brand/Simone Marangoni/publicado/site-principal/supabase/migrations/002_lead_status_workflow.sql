alter table public.leads
drop constraint if exists leads_status_check;

alter table public.leads
add constraint leads_status_check check (
  status in (
    'especulacao',
    'novo',
    'em_analise',
    'em_atendimento',
    'contato_realizado',
    'proposta_enviada',
    'cliente_convertido',
    'concluido',
    'encerrado',
    'descartado'
  )
);
