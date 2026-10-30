import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash,
} from "@phosphor-icons/react";

import { useNavigate } from "@tanstack/react-router";

import { useCartStore } from "@/features/cart/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const navigate = useNavigate();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          search={{
            search: "",
            category: undefined,
            sort: "recent",
            page: 1,
          }}
          className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Voltar ao catálogo
        </Link>

        <div className="mb-8 flex items-center gap-3">
          <ShoppingBag size={28} className="text-violet-400" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Meu carrinho
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {totalItems} {totalItems === 1 ? "item" : "itens"} selecionados
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <Card className="border-white/10 bg-white/[0.03] py-0">
            <CardContent className="flex flex-col items-center px-6 py-16 text-center">
              <ShoppingBag
                size={48}
                weight="light"
                className="mb-4 text-zinc-500"
              />

              <h2 className="text-lg font-semibold">Seu carrinho está vazio</h2>

              <p className="mt-2 max-w-sm text-sm text-zinc-400">
                Explore o catálogo e encontre NFTs para adicionar à sua coleção.
              </p>

              <Link
                to="/"
                search={{
                  search: "",
                  category: undefined,
                  sort: "recent",
                  page: 1,
                }}
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-violet-500 px-5 text-sm font-medium text-white transition hover:bg-violet-600"
              >
                Explorar NFTs
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <section className="space-y-4">
              {items.map(({ nft, quantity }) => (
                <Card
                  key={nft.id}
                  className="border-white/10 bg-white/[0.03] py-0"
                >
                  <CardContent className="flex gap-4 p-4 sm:gap-6">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="size-24 shrink-0 rounded-lg object-cover sm:size-32"
                    />

                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <p className="text-xs text-violet-300">
                          {nft.collection}
                        </p>

                        <h2 className="mt-1 truncate font-semibold">
                          {nft.name}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                          {nft.price} ETH por unidade
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${nft.name}`}
                            disabled={quantity <= 1}
                            onClick={() => updateQuantity(nft.id, quantity - 1)}
                            className="flex size-8 items-center justify-center rounded-md border border-white/10 transition hover:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-5 text-center text-sm">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${nft.name}`}
                            disabled={quantity >= nft.availableQuantity}
                            onClick={() => updateQuantity(nft.id, quantity + 1)}
                            className="flex size-8 items-center justify-center rounded-md border border-white/10 transition hover:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-violet-300">
                            {(Number(nft.price) * quantity).toFixed(3)} ETH
                          </p>

                          <button
                            type="button"
                            aria-label={`Remover ${nft.name} do carrinho`}
                            onClick={() => removeItem(nft.id)}
                            className="text-zinc-500 transition hover:text-red-400"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </section>

            <aside>
              <Card className="border-white/10 bg-white/[0.03] py-0 lg:sticky lg:top-8">
                <CardContent className="p-5">
                  <h2 className="text-lg font-semibold">Resumo do pedido</h2>

                  <div className="mt-6 flex justify-between text-sm text-zinc-400">
                    <span>Itens</span>
                    <span>{totalItems}</span>
                  </div>

                  <div className="mt-4 flex justify-between text-sm text-zinc-400">
                    <span>Subtotal</span>
                    <span>{totalPrice.toFixed(3)} ETH</span>
                  </div>

                  <div className="my-5 border-t border-white/10" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">Total</span>
                    <span className="text-xl font-bold text-violet-300">
                      {totalPrice.toFixed(3)} ETH
                    </span>
                  </div>

                  <Button
                    className="mt-6 w-full"
                    onClick={() => navigate({ to: "/checkout" })}
                  >
                    Finalizar compra
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
