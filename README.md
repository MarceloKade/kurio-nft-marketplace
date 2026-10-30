# KURIO — NFT Marketplace

Marketplace de NFTs desenvolvido como desafio técnico para a Jungle Gaming.

O projeto contempla a experiência principal de navegação pelo catálogo, visualização de NFTs, gerenciamento do carrinho e estruturação do fluxo de checkout.

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
- MSW
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
- [x] Estrutura da página de checkout.
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

Devido ao prazo de desenvolvimento, algumas partes do escopo original não foram concluídas:

- Autenticação e login.
- Cadastro de usuários.
- Perfil do colecionador.
- Gerenciamento de carteiras.
- Versão responsiva para dispositivos móveis.
- Implementação completa dos fluxos de tempo real.
- Cobertura completa dos cenários de falha.
- Testes automatizados de ponta a ponta.

A aplicação foi desenvolvida priorizando a experiência em telas desktop.

## Gerenciamento de estado e dados

- **Zustand:** gerenciamento do estado do carrinho.
- **TanStack Query:** gerenciamento de consultas e cache.
- **Axios:** comunicação HTTP.
- **MSW:** interceptação de requisições e utilização de mocks durante o desenvolvimento.

## Interface

A interface utiliza Tailwind CSS v4 e componentes reutilizáveis baseados em shadcn/ui.

A tipografia principal é Roboto Mono.

## Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Acesse o projeto:

```bash
cd nft-marketplace
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

Consulte o arquivo `.env.example`, caso disponível, para verificar as variáveis necessárias.

## Demonstração

**Repositório:** <https://github.com/MarceloKade/kurio-nft-marketplace>

**Aplicação publicada:** <URL_DO_DEPLOY>

## Considerações finais

O projeto representa uma implementação parcial do desafio. As funcionalidades desenvolvidas priorizam a navegação pelo marketplace, a consulta de NFTs e o fluxo de compra.

Algumas funcionalidades previstas no escopo original não foram concluídas dentro do prazo, conforme descrito nesta documentação.
