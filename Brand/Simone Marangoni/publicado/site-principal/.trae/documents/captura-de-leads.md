## Captura de Leads (Home)

### Objetivo
Capturar solicitações de análise estratégica diretamente na Home com UI premium e inserir os dados na tabela `public.leads` do Supabase, com `status = 'novo'` e `tenant_id` padrão do escritório.

### Arquivos criados/alterados
- Componente de formulário:
  - `src/components/leads/lead-capture-form.tsx`
- Server Action (inserção no banco):
  - `src/app/actions/create-lead.ts`
- Helper server-side do Supabase (service role):
  - `src/lib/supabase/admin.ts`
- Seção na Home:
  - `src/app/page.tsx`

### Campos enviados ao banco
- `tenant_id`: `DEFAULT_TENANT_ID`
- `full_name`: Nome completo
- `email`: E-mail profissional
- `phone`: WhatsApp (com máscara client-side)
- `message`: Resumo do desafio jurídico
- `status`: sempre `novo`
- `lgpd_consent`: sempre `true` quando enviado

### Variáveis de ambiente necessárias
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- `DEFAULT_TENANT_ID`

### Feedback para o usuário
- Loading: botão com estado pulsante em vermelho metálico durante o envio.
- Sucesso: mensagem exibida no formulário após inserção.
- Erro: mensagem genérica sem vazar detalhes internos.
