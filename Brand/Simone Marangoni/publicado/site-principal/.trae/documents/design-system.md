## 1. Princípios Visuais
- O visual deve transmitir luxo, autoridade, discrição e precisão.
- O design evita exageros gráficos e aposta em contraste, tipografia e acabamento.
- O vermelho metálico aparece apenas como assinatura visual de tensão e imponência.

## 2. Paleta Base
| Token | Uso | Valor inicial sugerido |
|------|-----|------------------------|
| `background` | Fundo principal | `#081225` |
| `background-soft` | Superfícies secundárias | `#0D1A31` |
| `foreground` | Texto principal prata | `#D7DCE5` |
| `foreground-soft` | Texto secundário | `#A8B0BF` |
| `accent` | Vermelho metálico | `#9E1F2D` |
| `accent-soft` | Hover e brilho discreto | `#C44B57` |
| `border` | Bordas e divisórias | `rgba(215, 220, 229, 0.16)` |
| `line-impact` | Linha fina de destaque | `rgba(158, 31, 45, 0.72)` |

## 3. Tipografia
- Títulos: serifada sofisticada com presença editorial.
- Corpo e interface: sans moderna, legível e contida.
- Hierarquia: poucos tamanhos, alto controle de peso e tracking cuidadoso.

## 4. Componentes-Chave
- Botões: fundo contido, borda fina, hover elegante com brilho sutil no acento.
- Cards: superfícies escuras, raio discreto, divisória vermelha mínima e sombra suave.
- Inputs: acabamento premium, borda prata suave e foco com detalhe vermelho controlado.
- Navegação: limpa, espaçada e com feedback visual preciso.

## 5. Regras de Uso do Vermelho Metálico
- Aplicar apenas em bordas finas, linhas divisórias, hover e estados selecionados.
- Não usar como fundo dominante de seções.
- Não competir com o texto principal prata.
- Sempre priorizar elegância e parcimônia.

## 6. Classes Reutilizáveis
- `metallic-border`: aplica a borda fina principal do escritório com `border: 1px solid var(--line-impact)` e dupla leitura sutil via `box-shadow` interno e externo. Usar em containers de contato, blocos de destaque e superfícies premium que precisem conversar diretamente com a identidade boutique.
- `metallic-cta`: aplica a borda fina vermelho metálico em botões e chamadas de ação, mantendo o preenchimento contido e o destaque visual no contorno. Usar em CTAs principais como contato direto, atendimento especializado e ações de conversão.
- Implementação atual em `src/app/globals.css`:

```css
.metallic-border {
  border: 1px solid var(--line-impact);
  box-shadow:
    inset 0 0 0 1px rgba(196, 75, 87, 0.08),
    0 0 0 1px rgba(158, 31, 45, 0.12);
}

.metallic-cta {
  border: 1px solid var(--line-impact);
  box-shadow: inset 0 0 0 1px rgba(196, 75, 87, 0.08);
}
```

- Regra de replicação para o subdomínio do cartão virtual: preservar exatamente os tokens `line-impact`, `accent` e `accent-soft`, sem engrossar a borda e sem transformar o vermelho em preenchimento dominante.

## 7. Diretrizes de Motion
- Animações discretas e lentas, com sensação de sofisticação.
- Nada de efeitos agressivos ou chamativos.
- Transições curtas em hover, foco e entrada de blocos principais.
