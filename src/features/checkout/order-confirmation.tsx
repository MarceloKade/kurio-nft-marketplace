import { ArrowSquareOut, X } from "@phosphor-icons/react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOrder } from "@/features/checkout/hooks";

const NETWORK_FEE = 0.005;
const MOCK_WALLET = "0x71C...9A42";

function formatETH(value: number) {
  return `${value.toFixed(3)} ETH`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function OrderConfirmation() {
  const { orderId } = useParams({
    from: "/order-confirmation/$orderId",
  });

  const navigate = useNavigate();
  const { data, isPending, isError } = useOrder(orderId);
  const order = data?.order;

  if (isPending || isError || !order) {
    return (
      <main className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto bg-black/70 p-4 text-zinc-100 backdrop-blur-sm sm:p-6">
        {isPending ? (
          <p className="text-sm text-zinc-400">
            Carregando os detalhes do pedido...
          </p>
        ) : (
          <Card className="w-full max-w-md border-zinc-800 bg-zinc-900">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <h1 className="text-xl font-semibold">Pedido não encontrado</h1>

              <p className="text-sm text-zinc-400">
                Não foi possível carregar os detalhes desta transação.
              </p>

              <Link
                to="/"
                search={{
                  search: "",
                  category: undefined,
                  sort: "recent",
                  page: 1,
                }}
                className="inline-flex h-9 items-center justify-center rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
              >
                Voltar ao catálogo
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    );
  }

  const subtotal = order.items.reduce(
    (total, item) => total + Number(item.unitPrice) * item.quantity,
    0,
  );

  const total = subtotal + NETWORK_FEE;

  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 text-zinc-100 backdrop-blur-sm sm:p-6">
      <div className="my-auto w-full max-w-3xl py-4">
        <Card className="relative overflow-hidden border-zinc-800 bg-zinc-900 text-zinc-100 shadow-2xl">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Fechar confirmação"
            className="absolute right-3 top-3 z-10 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            onClick={() =>
              navigate({
                to: "/",
                search: {
                  search: "",
                  category: undefined,
                  sort: "recent",
                  page: 1,
                },
              })
            }
          >
            <X size={20} />
          </Button>

          <CardContent className="p-0">
            <header className="px-5 pb-8 pt-12 text-center sm:px-8">
              <p className="mb-3 text-xs font-semibold tracking-[0.35em] text-violet-400">
                THANK YOU
              </p>

              <h1 className="text-2xl font-semibold sm:text-3xl">
                Seus NFTs agora estão na sua carteira
              </h1>
            </header>

            <section className="grid grid-cols-2 divide-x divide-y divide-zinc-800 border-y border-zinc-800 sm:grid-cols-4 sm:divide-y-0">
              <div className="p-4 sm:p-5">
                <p className="mb-2 text-xs text-zinc-500">ID da transação</p>
                <p className="break-all text-sm font-medium" title={order.id}>
                  {order.id}
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <p className="mb-2 text-xs text-zinc-500">Data</p>
                <p className="text-sm font-medium">
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="p-4 sm:p-5">
                <p className="mb-2 text-xs text-zinc-500">Total</p>
                <p className="text-sm font-medium">{formatETH(total)}</p>
              </div>

              <div className="p-4 sm:p-5">
                <p className="mb-2 text-xs text-zinc-500">Carteira</p>
                <p className="text-sm font-medium">{MOCK_WALLET}</p>
              </div>
            </section>

            <section className="p-5 sm:p-7">
              <h2 className="mb-6 text-lg font-semibold">
                Detalhes da transação
              </h2>

              <div className="mb-3 grid grid-cols-[minmax(0,1fr)_70px_100px] gap-3 text-xs text-zinc-500 sm:grid-cols-[minmax(0,1fr)_100px_120px]">
                <span>NFTs</span>
                <span className="text-right">Edições</span>
                <span className="text-right">Subtotal</span>
              </div>

              <div className="border-y border-zinc-800">
                {order.items.map((item) => {
                  const itemSubtotal = Number(item.unitPrice) * item.quantity;

                  return (
                    <div
                      key={item.nftId}
                      className="grid grid-cols-[minmax(0,1fr)_70px_100px] items-center gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_100px_120px]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="size-14 shrink-0 rounded-md object-cover sm:size-16"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-zinc-500">
                            ID: {item.nftId}
                          </p>
                        </div>
                      </div>

                      <p className="text-right text-sm text-zinc-400">
                        {item.quantity}
                      </p>

                      <p className="text-right text-sm font-medium">
                        {formatETH(itemSubtotal)}
                      </p>
                    </div>
                  );
                })}

                <div className="space-y-4 py-5">
                  <div className="flex items-center justify-center gap-4">
                    <span className="text-sm text-zinc-400">Taxa de rede</span>
                    <span className="text-sm">{formatETH(NETWORK_FEE)}</span>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-semibold text-violet-400">
                      {formatETH(total)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <footer className="px-5 pb-8 text-center sm:px-7">
              <p className="mx-auto max-w-2xl text-sm leading-6 text-zinc-400">
                Transação confirmada na Ethereum. A propriedade foi transferida
                para sua carteira conectada e registrada na rede.
              </p>

              <a
                href="https://etherscan.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-9 items-center justify-center gap-2 rounded-md border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-800"
              >
                Ver no Etherscan
                <ArrowSquareOut size={16} />
              </a>

              <div className="mt-4">
                <Link
                  to="/"
                  search={{
                    search: "",
                    category: undefined,
                    sort: "recent",
                    page: 1,
                  }}
                  className="text-sm text-zinc-500 transition-colors hover:text-violet-400"
                >
                  Voltar ao catálogo
                </Link>
              </div>
            </footer>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
