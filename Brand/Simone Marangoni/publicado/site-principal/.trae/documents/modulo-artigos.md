## Refatoração do Dashboard e Módulo de Artigos

### Dashboard compacto
- A listagem de leads em `src/app/dashboard/page.tsx` foi convertida para um formato compacto.
- Cada lead aparece fechado por padrão em uma linha resumida.
- O conteúdo da mensagem jurídica só é exibido após clique para expansão via `details/summary`.
- Foram adicionadas abas por status com filtro server-side:
  - `novo`
  - `em_atendimento`
  - `concluido`
  - `especulacao`

### Ações de triagem
- As ações por lead continuam server-side e agora ficam dentro do painel expandido.
- O componente responsável é `src/components/leads/lead-status-actions.tsx`.
- A action responsável é `src/app/actions/update-lead-status.ts`.

### Banco de dados do blog/SEO
- Nova migration:
  - `supabase/migrations/003_article_categories.sql`
- Tabela criada:
  - `public.categories`
- Categorias padrão injetadas:
  - `Direito Digital`
  - `Franchising`

### Módulo interno de artigos
- Listagem administrativa:
  - `src/app/dashboard/artigos/page.tsx`
- Cadastro de artigo:
  - `src/app/dashboard/artigos/novo/page.tsx`
- Formulário premium:
  - `src/components/articles/article-form.tsx`
- Server Action de criação:
  - `src/app/actions/create-article.ts`

### Regras editoriais
- `slug` é gerado automaticamente a partir do título, com possibilidade de ajuste manual.
- Status disponíveis no cadastro:
  - `draft`
  - `published`
- Em caso de `published`, o campo `published_at` é preenchido automaticamente na criação.

### Rotas públicas de conteúdo
- Listagem pública:
  - `src/app/artigos/page.tsx`
- Página individual:
  - `src/app/artigos/[slug]/page.tsx`
- A rota dinâmica já gera metadata com foco em SEO a partir do título e do conteúdo do artigo.

### Validação
- Migration de categorias aplicada com sucesso no banco remoto.
- `npm run check` executado com sucesso.
- `npm run lint` executado com sucesso.
