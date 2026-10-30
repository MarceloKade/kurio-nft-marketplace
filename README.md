# KURIO — NFT Marketplace

Marketplace de NFTs desenvolvido como desafio técnico para a Jungle Gaming.

O projeto apresenta uma experiência de navegação por coleções digitais, consulta de detalhes de NFTs, gerenciamento do carrinho e estruturação do fluxo de checkout.

**Status:** Implementação parcial do escopo proposto.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS v4
- TanStack Router
- TanStack Query
- Zustand
- Axios
- MSW (Mock Service Worker)
- shadcn/ui
- Phosphor Icons

## Funcionalidades implementadas

- [x] Estrutura da aplicação com React e TypeScript.
- [x] Navegação com TanStack Router.
- [x] Header e navegação principal.
- [x] Catálogo de NFTs.
- [x] Busca e filtros do catálogo.
- [x] Página de detalhes de NFT.
- [x] Seleção de edições.
- [x] Controle de quantidade.
- [x] Gerenciamento do carrinho com Zustand.
- [x] Contador de itens no carrinho.
- [x] Página do carrinho.
- [x] Página de checkout.
- [x] Seleção de método de pagamento e rede.
- [x] Aplicação de código promocional.
- [x] Cálculo de subtotal, desconto, taxa de rede e total.
- [x] Página de confirmação do pedido.
- [x] Componentes reutilizáveis de interface.

## Rotas implementadas

| Rota                  | Descrição             |
| --------------------- | --------------------- |
| `/`                   | Catálogo de NFTs      |
| `/nft/$nftId`         | Detalhes de uma NFT   |
| `/cart`               | Carrinho de compras   |
| `/checkout`           | Finalização do pedido |
| `/order-confirmation` | Confirmação do pedido |

## Funcionalidades não implementadas

Devido ao prazo de desenvolvimento, algumas funcionalidades previstas no escopo original não foram concluídas:

- [ ] Página de cadastro de usuários.
- [ ] Página de login e autenticação.
- [ ] Perfil do colecionador.
- [ ] Gerenciamento e conexão de carteiras.
- [ ] Versão responsiva para dispositivos móveis.
- [ ] Implementação completa dos fluxos de tempo real com Socket.IO.
- [ ] Cobertura completa dos cenários de falha e recuperação.
- [ ] Testes automatizados de ponta a ponta com Playwright.

A automação de testes com Playwright fazia parte do planejamento técnico, mas não chegou a ser implementada dentro do prazo disponível.

A interface desenvolvida prioriza a experiência em telas desktop.

## Gerenciamento de estado e dados

- **Zustand:** gerenciamento do estado do carrinho.
- **TanStack Query:** gerenciamento de consultas e cache.
- **Axios:** comunicação HTTP.
- **MSW:** interceptação de requisições e simulação da API durante o desenvolvimento local.

## Interface

A interface utiliza Tailwind CSS v4 e componentes reutilizáveis baseados em shadcn/ui.

A tipografia principal é Roboto Mono.

## Instalação

Clone o repositório:

```bash
git clone https://github.com/MarceloKade/kurio-nft-marketplace.git
```

Acesse a pasta:

```bash
cd kurio-nft-marketplace
```

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

## Scripts

| Comando           | Descrição                                |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Inicia o ambiente de desenvolvimento     |
| `npm run build`   | Gera a versão de produção                |
| `npm run preview` | Executa uma prévia da versão de produção |
| `npx tsc -b`      | Verifica os tipos TypeScript             |

## Variáveis de ambiente

Consulte o arquivo `.env.example`, caso disponível, para verificar as variáveis necessárias para execução da aplicação.

## Limitações conhecidas

**Ambiente de produção:** não foi possível concluir a configuração do MSW para interceptar as requisições na aplicação publicada pela Vercel. Por esse motivo, os dados do catálogo podem não ser carregados na versão hospedada.

A simulação da API funciona no ambiente de desenvolvimento local.

## Demonstração

**Repositório:** [kurio-nft-marketplace](https://github.com/MarceloKade/kurio-nft-marketplace)

**Aplicação publicada:** [KURIO — Vercel](https://kurio-nft-marketplace-blush.vercel.app/)

## Considerações finais

O desenvolvimento priorizou a construção das páginas principais do marketplace, a navegação pelo catálogo, a consulta de NFTs e o fluxo de compra.

Algumas funcionalidades previstas no desafio não foram concluídas dentro do prazo estabelecido. As limitações estão documentadas para apresentar com transparência o estado atual da aplicação.
