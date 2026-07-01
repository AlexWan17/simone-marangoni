## Estrutura de Autenticacao

### Objetivo
Implementar acesso premium ao painel interno com autenticação por e-mail e senha usando Supabase Auth, mantendo proteção automática das rotas administrativas.

### Arquivos criados
- `src/lib/supabase/server.ts`
- `src/lib/supabase/middleware.ts`
- `src/app/actions/login.ts`
- `src/components/auth/login-form.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/dashboard/page.tsx`
- `middleware.ts`

### Fluxo de login
1. A rota `/login` renderiza a interface premium centralizada.
2. O formulário envia os dados para a Server Action `loginAction`.
3. A action usa `signInWithPassword` no Supabase.
4. Em caso de erro, a tela exibe feedback visual elegante.
5. Em caso de sucesso, o usuário é redirecionado para `/dashboard`.

### Protecao de rotas
- Rotas protegidas:
  - `/admin`
  - `/dashboard`
- Regra 1:
  - Se o usuário não estiver autenticado e tentar acessar `/admin` ou `/dashboard`, o middleware redireciona para `/login`.
- Regra 2:
  - Se o usuário já estiver autenticado e tentar abrir `/login`, o middleware redireciona para `/dashboard`.

### Componentes e comportamento visual
- Inputs com fundo azul profundo e tipografia prata.
- Botão principal com borda fina em vermelho metálico.
- Estado de loading pulsante no botão durante validação da senha.
- Feedback textual de erro em caso de credenciais inválidas.

### Validacao tecnica
- `npm run check` executado com sucesso.
- `npm run lint` executado sem erros após ajuste do componente de marca.
