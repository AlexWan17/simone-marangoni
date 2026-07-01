## Expansão do ERP Jurídico Operacional

### Objetivo
Consolidar o painel administrativo como uma central de operação jurídica avançada, com navegação persistente, gestão processual, módulo de consulta assistida por IA e atalhos operacionais.

### Layout com sidebar fixa
- Arquivo principal:
  - `src/app/dashboard/layout.tsx`
- Componentes de apoio:
  - `src/components/dashboard/dashboard-sidebar.tsx`
  - `src/components/dashboard/dashboard-nav-link.tsx`
- Módulos presentes no menu:
  - Central de Leads
  - Artigos & SEO
  - Gerador de Cards
  - Processos (e-SAJ/e-Proc)
  - Oráculo IA Jurídico
  - Links Úteis

### Módulo de processos
- Migration criada e aplicada:
  - `supabase/migrations/004_management_processes.sql`
- Tabela criada:
  - `public.processos`
- Campos contemplados:
  - `id`
  - `tenant_id`
  - `numero_processo`
  - `nome_cliente`
  - `pasta_interna`
  - `sistema_origem`
  - `status`
  - `resumo_andamento`
  - `historico_movimentacoes`
- Tela operacional:
  - `src/app/dashboard/processos/page.tsx`
- Ação placeholder de sincronização:
  - `src/app/actions/sync-process-notices.ts`
  - `src/components/processos/sync-process-button.tsx`
- Ficha de mesa para impressão:
  - `src/app/dashboard/processos/[id]/ficha/page.tsx`
  - `src/components/processos/print-sheet-button.tsx`

### Módulo Oráculo IA Jurídico
- Tela do painel:
  - `src/app/dashboard/oraculo/page.tsx`
- Chat premium:
  - `src/components/oraculo/oracle-chat.tsx`
- Endpoint preparado para integração futura com LLM:
  - `src/app/api/oraculo/route.ts`
- Atalhos rápidos implementados:
  - `Analisar Risco de Contestação`
  - `Revisar Cláusula Contratual`
  - `Estruturar Tese de Direito Digital`

### Módulo Links Úteis
- Tela do painel:
  - `src/app/dashboard/links/page.tsx`
- Atalhos externos disponíveis:
  - JusBrasil
  - e-SAJ
  - e-Proc

### Ajustes globais
- Estilo print A4 registrado em:
  - `src/app/globals.css`

### Validação
- `supabase db push --include-all --yes` executado com sucesso para `004_management_processes.sql`
- `npm run check` executado com sucesso
- `npm run lint` executado com sucesso
