## Provisionamento Supabase

### Projeto remoto
- Nome: `simone-marangoni-platform`
- Project ref: `oiavwbtmenlvdruiuqeg`
- Diretório local vinculado com `supabase link`

### Arquivos gerados
- `.env.local` com `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` e `SUPABASE_PROJECT_REF`
- `supabase/config.toml` inicializado pelo CLI
- `supabase/migrations/001_multitenant_core.sql` criado e aplicado no banco remoto

### Estrutura aplicada no banco
- `tenants`
- `profiles`
- `leads`
- `articles`
- `config_perfil`

### Regras implantadas
- RLS habilitado em todas as tabelas de negócio
- Funções de apoio: `current_tenant_id()` e `current_user_role()`
- Policies para isolamento por `tenant_id` em contexto autenticado
- Leitura pública apenas para:
  - `articles` com `status = 'published'`
  - `config_perfil` para dados institucionais

### Seeds aplicados
- Tenant inicial `simone-marangoni-platform`
- Registro inicial em `config_perfil` com identidade institucional base

### Validação
- `supabase db push --include-all --yes` executado com sucesso
- `supabase gen types typescript --linked --schema public` confirmou as tabelas e funções criadas
- `npm run check` executado com sucesso no frontend

### Observação sobre o logotipo
- O projeto já possui a pasta `public/images/` preparada e o frontend foi ajustado para tentar carregar `logo-simone.png` com fallback elegante.
- O arquivo binário do logotipo anexado na conversa não ficou exposto ao workspace por ferramenta direta nesta sessão, então o caminho visual está preparado, mas a gravação física do PNG depende do arquivo ser disponibilizado localmente.
