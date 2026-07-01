## Refino de UX, Rotas e Alertas

### Correção de rotas de categorias
- A rota principal de gerenciamento permanece em:
  - `src/app/dashboard/artigos/categorias/page.tsx`
- Foi criada uma rota alias para evitar erro 404 em acessos antigos ou divergentes:
  - `src/app/dashboard/artigos/categories/page.tsx`
- A alias redireciona automaticamente para `/dashboard/artigos/categorias`.

### Alertas jurídicos por tema
- O painel de alertas foi refatorado em:
  - `src/app/dashboard/alertas/page.tsx`
- O fetcher de RSS foi expandido em:
  - `src/lib/rss/legal-alerts.ts`
- Agora o módulo aceita filtro temático por query, com foco em:
  - Franquias
  - Neurodivergências / TEA
  - Família
  - Direito Médico
  - Previdenciário
- O ranking continua limitado aos 10 resultados mais recentes dentro do tema selecionado.

### Home mais compacta e orientada a conversão
- A Home foi condensada em:
  - `src/app/page.tsx`
- O formulário longo deixou de ser o foco principal da Landing Page.
- Os CTAs principais passaram a apontar para:
  - `https://cartao.simonemarangoni.adv.br`
- O mesmo link foi aplicado:
  - no header público
  - nos cards das frentes de atuação
  - nos blocos principais de contato

### Header público com CTA
- O componente atualizado é:
  - `src/components/layout/public-site-header.tsx`
- Foi incluído um CTA de destaque:
  - `Falar com a Dra. Simone`

### Validação
- `npm run check` executado com sucesso
- `npm run lint` executado com sucesso
