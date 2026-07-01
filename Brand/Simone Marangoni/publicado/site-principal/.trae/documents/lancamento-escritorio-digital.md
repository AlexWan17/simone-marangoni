## Consolidação do Lançamento do Escritório Digital

### Branding público
- Foi criado um header público reutilizável em `src/components/layout/public-site-header.tsx`.
- O header posiciona o logotipo ao lado do nome `SIMONE MARANGONI`, com protagonismo visual em tipografia serifada e caixa alta.
- As páginas públicas atualizadas foram:
  - `src/app/page.tsx`
  - `src/app/artigos/page.tsx`
  - `src/app/artigos/[slug]/page.tsx`

### Home reestruturada
- A Home foi reescrita com copy institucional real e foco em conversão.
- O conteúdo foi reorganizado para atender com clareza:
  - clientes corporativos
  - famílias e sucessões
  - pacientes e segurados
  - demandas ligadas a neurodivergências
- As sete frentes oficiais passaram a orientar a navegação e a comunicação.
- Foi adicionada a seção `Artigos e Orientações Recentes`, conectada ao Supabase, exibindo os 3 artigos publicados mais recentes.

### Frentes oficiais de atuação
- Base única criada em `src/lib/content/practice-areas.ts`.
- Categorias oficiais contempladas:
  - `Franchising & Expansão de Negócios`
  - `Advocacia Corporativa & Riscos Empresariais`
  - `Direito de Família & Sucessões`
  - `Direito das Neurodivergências (TEA, TDAH, TOD)`
  - `Direito Médico & Defesa do Paciente`
  - `Direito Previdenciário & Proteção Social`
  - `Direito do Trabalho Estratégico`

### Gestão dinâmica de categorias
- Server Actions criadas em `src/app/actions/manage-categories.ts`.
- Tela administrativa criada em `src/app/dashboard/artigos/categorias/page.tsx`.
- Componente de gestão criado em `src/components/articles/category-manager.tsx`.
- Funcionalidades entregues:
  - visualizar categorias
  - adicionar categoria
  - editar categoria
  - sincronizar categorias oficiais
- Sincronização inicial executada no banco com o script:
  - `scripts/sync-official-categories.mjs`

### Alertas jurídicos dinâmicos
- Rota criada:
  - `src/app/dashboard/alertas/page.tsx`
- Fetcher server-side criado:
  - `src/lib/rss/legal-alerts.ts`
- Fontes reais utilizadas:
  - feed RSS do STJ
  - feed RSS do ConJur
- O painel lista os 10 alertas mais recentes, ordenados por data, com link direto para leitura completa.

### Navegação do dashboard
- A sidebar foi atualizada para incluir o módulo `Alertas Jurídicos`.
- O fluxo editorial também ganhou atalhos para gerenciamento de categorias.

### Validação
- `npm run check` executado com sucesso.
- `npm run lint` executado com sucesso.
