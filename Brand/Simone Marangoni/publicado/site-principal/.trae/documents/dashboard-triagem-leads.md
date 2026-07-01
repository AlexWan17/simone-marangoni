## Dashboard de Triagem de Leads

### Objetivo
Transformar o `/dashboard` em uma central administrativa boutique para leitura e triagem operacional dos leads persistidos no Supabase.

### Arquivos criados/alterados
- `middleware.ts`
- `src/lib/supabase/middleware.ts`
- `src/app/dashboard/page.tsx`
- `src/app/actions/update-lead-status.ts`
- `src/components/leads/lead-status-actions.tsx`
- `supabase/migrations/002_lead_status_workflow.sql`

### Reforco de seguranca
- O `matcher` do middleware cobre explicitamente:
  - `/dashboard`
  - `/dashboard/:path*`
  - `/admin`
  - `/admin/:path*`
- Se `supabase.auth.getUser()` não retornar usuário válido, o acesso ao `/dashboard` é redirecionado imediatamente para `/login`.
- O próprio `dashboard` também revalida a sessão no servidor antes de consultar os dados.

### Estrategia de leitura dos leads
- A sessão do usuário é validada com o client SSR.
- Após a validação, a leitura da tabela `leads` é feita no servidor com client admin para garantir disponibilidade imediata da central de triagem.
- A consulta é filtrada pelo `DEFAULT_TENANT_ID`.

### Colunas exibidas
- Nome
- E-mail
- WhatsApp
- Mensagem
- Data de entrada
- Status

### Regra de negocio dos status
- Status visuais e acionáveis na triagem:
  - `especulacao`
  - `em_atendimento`
  - `concluido`
- A migration `002_lead_status_workflow.sql` amplia o `check constraint` do banco para suportar o fluxo operacional solicitado.

### Atualizacao de status
- Implementada via Server Action `updateLeadStatus`.
- A action aceita apenas os status permitidos na triagem.
- Após atualizar, a rota `/dashboard` é revalidada para refletir a mudança imediatamente.

### Validacao
- `supabase db push --include-all --yes` executado com sucesso para a migration dos novos status.
- `npm run check` executado com sucesso.
- `npm run lint` executado com sucesso.
