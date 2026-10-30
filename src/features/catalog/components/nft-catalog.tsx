import { Link, useNavigate, useSearch } from "@tanstack/react-router";

import { MagnifyingGlass, CaretLeft, CaretRight } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { useNFTs } from "../hooks";
import type { NFTCategory, NFTSortOption } from "@/types/nft";

const categories = [
  "Art3d",
  "Art",
  "Subscriptions",
  "Collectibles",
  "Photography",
  "Generactive",
  "Gaming",
  "Music",
  "Utility",
] as const;

const categoryLabels: Record<NFTCategory, string> = {
  Art3d: "Arte 3D",
  Art: "Arte Digital",
  Subscriptions: "Assinaturas",
  Collectibles: "Colecionáveis",
  Photography: "Fotografia",
  Generactive: "Generativas",
  Gaming: "Jogos",
  Music: "Música",
  Utility: "Utilidade",
};

const formatPrice = (price: string) =>
  Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

export function NFTCatalog() {
  const navigate = useNavigate({ from: "/" });

  const { search, category, sort, page } = useSearch({
    from: "/",
  });

  const { data, isLoading, isError, refetch } = useNFTs({
    search: search || undefined,
    category,
    sort,
    page,
    limit: 9,
  });

  const changeCategory = (value: NFTCategory | "") => {
    void navigate({
      search: (previous) => ({
        ...previous,
        category: value || undefined,
        page: 1,
      }),
    });
  };

  const changeSort = (value: NFTSortOption) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        sort: value,
        page: 1,
      }),
    });
  };

  const changePage = (value: number) => {
    void navigate({
      search: (previous) => ({
        ...previous,
        page: value,
      }),
    });
  };

  const clearFilters = () => {
    void navigate({
      search: {
        search: "",
        category: undefined,
        sort: "recent",
        page: 1,
      },
    });
  };

  return (
    <main className="page-main text-zinc-100">
      <section className="mx-auto pt-2">
        <div className="grid items-center lg:grid-cols-2">
          <div>
            <p className="mb-2 mt-[43px] font-medium text-[14px] text-foreground">
              Bem-vindo à Kurio
            </p>

            <h1 className="w-[700px] text-[43px] font-bold leading-[70px] tracking-normal">
              SEJA DONO DO FUTURO
              <br />
              DA ARTE DIGITAL
            </h1>

            <p className="mt-1 max-w-xl font-normal text-sm leading-6 text-secondary">
              Descubra NFTs selecionados de criadores emergentes e consagrados.
              Colecione arte digital rara, apoie artistas e tenha uma parte da
              cultura da internet.
            </p>

            <div className="mt-8 flex flex-col items-baseline justify-between font-bold text-base leading-5">
              <Button
                onClick={() =>
                  document.getElementById("catalogo")?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                EXPLORAR
              </Button>

              <div className="mt-11 flex w-full justify-end">
                <div className="flex w-8 w-10 items-center justify-between">
                  <span className="size-2 rounded-full bg-[#D28A4C]" />
                  <span className="size-2 rounded-full bg-[#D28A4C]" />
                  <span className="size-2 rounded-full bg-[#D28A4C]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative ml-auto w-full max-w-[450px]">
            <img
              src="/images/nfts/Emerald-Ape.png"
              alt="Emerald Ape — arte digital da coleção Emerald Apes"
              className="aspect-square w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section
        id="explore"
        className="grid grid-cols-1 gap-8 lg:grid-cols-[310px_minmax(0,1fr)]"
      >
        <aside className="flex flex-col gap-6">
          <div className="rounded-xl p-5 bg-surface">
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Coleções
              </h3>

              <div className="space-y-3">
                {categories.map((item) => {
                  const count =
                    data?.items.filter((nft) => nft.category === item).length ??
                    0;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => changeCategory(item)}
                      className={`flex w-full items-center justify-between text-left text-sm transition ${
                        category === item
                          ? "text-violet-300"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span>{categoryLabels[item]}</span>
                      <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-6">
              <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-foreground">
                Faixa de preço
              </h3>

              <input
                type="range"
                min="0"
                max="10"
                defaultValue="5"
                aria-label="Faixa de preço"
                className="w-full accent-primary"
              />

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <span>0 ETH</span>
                <span>10 ETH</span>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-base font-bold text-ink transition"
              >
                Aplicar
              </button>
            </div>

            <div className="mt-7">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                Rede
              </h3>

              <div className="space-y-3">
                {["Ethereum", "Polygon", "Solana"].map((network) => (
                  <label
                    key={network}
                    className="flex cursor-pointer items-center justify-between text-sm text-zinc-400 transition hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="size-4 accent-violet-500"
                      />
                      {network}
                    </span>
                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-500">
                      —
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {data?.items[0] && (
            <div className="overflow-hidden rounded-xl bg-surface">
              <div className="p-5">
                <p className="text-2xl text-nowrap text-center leading-8 tracking-normal font-bold text-accent">
                  NFT EM DESTAQUE
                </p>
                <p className="mt-2 text-xl text-center leading-4 tracking-normal font-bold text-foreground">
                  OFERTA LIMITADA
                </p>
              </div>

              <img
                src={data.items[0].image}
                alt={data.items[0].name}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
            </div>
          )}
        </aside>

        <div>
          <div className="mb-8 flex flex-col gap-5 pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-5">
              {["Todos os NFTs", "Novos lançamentos", "Em alta"].map(
                (tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    className={`px-4 py-2.5 text-sm transition ${
                      index === 0
                        ? " text-accent border-b"
                        : "text-foreground hover:text-accent"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <label className="flex items-center gap-3 text-sm text-foreground">
              Ordenar por:
              <select
                value={sort}
                onChange={(event) =>
                  changeSort(event.target.value as NFTSortOption)
                }
                aria-label="Ordenar NFTs"
                className="h-10 bg-ink text-sm text-white outline-none focus:text-accent hover:text-accent"
              >
                <option value="recent">Listados recentes</option>
                <option value="popular">Listados populares</option>
                <option value="price_asc">Menor preço</option>
                <option value="price_desc">Maior preço</option>
              </select>
            </label>
          </div>

          {isLoading && (
            <div
              role="status"
              className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Card
                  key={index}
                  className="animate-pulse overflow-hidden bg-surface p-0"
                >
                  <div className="aspect-[4/3]" />
                  <CardContent className="space-y-3 p-5">
                    <div className="h-4 w-2/3 rounded" />
                    <div className="h-3 w-1/2 rounded" />
                    <div className="h-8 rounded" />
                  </CardContent>
                </Card>
              ))}
              <span className="sr-only">Carregando NFTs...</span>
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-6 py-12 text-center">
              <p className="font-medium text-red-300">
                Não foi possível carregar os NFTs.
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Verifique sua conexão e tente novamente.
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-5 rounded-lg bg-violet-500 px-5 py-2 text-sm font-medium text-white hover:bg-violet-400"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!isLoading && !isError && data?.items.length === 0 && (
            <div className="rounded-xl border border-white/10 px-6 py-16 text-center">
              <MagnifyingGlass
                size={32}
                className="mx-auto mb-3 text-zinc-500"
              />
              <h3 className="font-medium">Nenhum NFT encontrado</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Experimente mudar sua busca ou os filtros.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm text-violet-300 hover:text-violet-200"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {!isLoading && !isError && data && data.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3">
                {data.items.map((nft) => (
                  <Link
                    key={nft.id}
                    to="/nft/$nftId"
                    params={{ nftId: nft.id }}
                    className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400"
                    aria-label={`Ver detalhes de ${nft.name}`}
                  >
                    <Card className="group rounded-2xl overflow-hidden bg-surface py-0 transition duration-300 hover:-translate-y-1">
                      <div className="relative rounded-2xl aspect-[14/13] overflow-hidden">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          loading="lazy"
                          className="size-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>

                      <CardContent className="p-2">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-base font-medium text-foreground">
                              {nft.name}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="text-right">
                            <p className="mt-1 font-bold text-lg text-accent">
                              {formatPrice(nft.price)} ETH
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {data.pagination.totalPages > 1 && (
                <nav
                  aria-label="Paginação dos NFTs"
                  className="mt-10 flex items-center justify-center gap-5"
                >
                  <button
                    type="button"
                    aria-label="Página anterior"
                    disabled={page <= 1}
                    onClick={() => changePage(page - 1)}
                    className="flex size-10 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <CaretLeft size={18} />
                  </button>

                  <span className="text-sm text-zinc-400">
                    Página {page} de {data.pagination.totalPages}
                  </span>

                  <button
                    type="button"
                    aria-label="Próxima página"
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => changePage(page + 1)}
                    className="flex size-10 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <CaretRight size={18} />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
