## Módulo Gerador de Cards Sociais

### Objetivo
Criar uma área administrativa premium para composição e exportação client-side de cards institucionais em PNG, com preview em tempo real e aderência total ao design system do projeto.

### Arquivos criados e alterados
- `src/app/dashboard/cards/page.tsx`
- `src/components/cards/social-card-studio.tsx`
- `src/app/dashboard/page.tsx`
- `package.json`

### Estrutura da interface
- A rota protegida `/dashboard/cards` valida a sessão do Supabase no servidor antes de renderizar a tela.
- A experiência visual foi dividida em duas colunas:
  - coluna esquerda com formulário de configuração
  - coluna direita com preview em tempo real da arte

### Campos disponíveis
- `Título do card`
- `Subtítulo opcional`
- `Formato`
  - `Quadrado (Feed)`
  - `Vertical (Stories)`

### Preview em tempo real
- O preview usa fundo azul profundo luxuoso.
- A tipografia principal utiliza a fonte serifada do design system em prata.
- O contorno do card usa linha sutil em vermelho metálico.
- O preview respeita as proporções de exportação:
  - `1080x1080`
  - `1080x1920`

### Exportação
- Biblioteca utilizada:
  - `html-to-image`
- O botão `Exportar Arte` faz a captura do elemento visual do preview e força o download em PNG diretamente no navegador.
- O estado de loading utiliza pulsação em vermelho metálico para manter consistência com o restante do sistema.

### Acesso interno
- Foi adicionado um atalho para o módulo de cards no dashboard principal em `src/app/dashboard/page.tsx`.

### Validação
- `npm run check` executado com sucesso.
- `npm run lint` executado com sucesso.
