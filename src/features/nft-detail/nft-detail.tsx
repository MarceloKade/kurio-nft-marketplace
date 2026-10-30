import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowUpRight,
  EnvelopeSimple,
  Heart,
  LinkedinLogo,
  Minus,
  Plus,
  Star,
  TwitterLogo,
} from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/features/cart/cart-store";
import { useNFT, useNFTs } from "@/features/catalog/hooks";

function formatPrice(price: string) {
  return Number(price).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

const editions = ["1/1", "1/10", "1/50", "ABERTA"];

export function NFTDetail() {
  const { nftId } = useParams({ from: "/nft/$nftId" });
  const navigate = useNavigate();

  const { data: nft, isLoading, isError, refetch } = useNFT(nftId);
  const { data: catalog } = useNFTs({ limit: 100 });

  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [carouselPage, setCarouselPage] = useState(0);
  const [selectedEdition, setSelectedEdition] = useState(editions[2]);

  const collectionNFTs = useMemo(() => {
    if (!catalog?.items || !nft) return [];

    return catalog.items.filter(
      (item) => item.collection === nft.collection && item.id !== nft.id,
    );
  }, [catalog?.items, nft]);

  const maxCarouselStart = Math.max(0, collectionNFTs.length - 5);

  const carouselOffsets = [
    0,
    Math.floor(maxCarouselStart / 2),
    maxCarouselStart,
  ];

  const visibleNFTs = collectionNFTs.slice(
    carouselOffsets[carouselPage],
    carouselOffsets[carouselPage] + 5,
  );

  function handleBuy() {
    if (!nft) return;

    for (let index = 0; index < quantity; index++) {
      addItem(nft);
    }

    navigate({ to: "/cart" });
  }

  function handleShare(platform: "linkedin" | "twitter") {
    const url = encodeURIComponent(window.location.href);
    const shareUrl =
      platform === "linkedin"
        ? `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
        : `https://twitter.com/intent/tweet?url=${url}`;

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-8">
      {isLoading ? (
        <div className="mx-auto max-w-6xl space-y-8">
          <Skeleton className="h-5 w-40" />

          <div className="grid gap-8 md:grid-cols-2">
            <Skeleton className="aspect-square w-full" />

            <div className="space-y-5">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      ) : isError || !nft ? (
        <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="max-w-md space-y-4 text-center">
            <h1 className="text-2xl font-bold">NFT não encontrado</h1>

            <p className="text-sm text-muted-foreground">
              Não foi possível carregar este NFT. Ele pode não existir ou a
              requisição pode ter falhado.
            </p>

            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => refetch()}>
                Tentar novamente
              </Button>

              <Link
                to="/"
                search={{
                  search: "",
                  category: undefined,
                  sort: "recent",
                  page: 1,
                }}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Voltar ao catálogo
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-[1200px] space-y-24">
          <section className="space-y-8">
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/"
                search={{
                  search: "",
                  category: undefined,
                  sort: "recent",
                  page: 1,
                }}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Início
              </Link>

              <span className="text-muted-foreground">/</span>

              <span>Mercado</span>
            </nav>

            <div className="flex items-start gap-8">
              {/* Miniaturas */}
              <div className="flex flex-col gap-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Visualizar imagem ${index + 1}`}
                    className={`w-[100px] overflow-hidden rounded-md border transition-colors ${
                      index === 0
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <img
                      src={nft.image}
                      alt=""
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              <div className="w-[404px] shrink-0 overflow-hidden rounded-lg bg-muted">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-6">
                <div>
                  <h1 className="text-3xl text-foreground font-bold leading-none tracking-normal">
                    {nft.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-primary/30 pb-5">
                  <div>
                    <p className="mt-1 text-xl text-accent font-semibold">
                      {formatPrice(nft.price)}{" "}
                      <span className="text-base text-accent">
                        {nft.currency}
                      </span>
                    </p>
                  </div>

                  <div className="space-y-1 flex gap-1">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          size={16}
                          weight={index < 4 ? "fill" : "regular"}
                          className={
                            index < 4
                              ? "text-yellow-400"
                              : "text-muted-foreground"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      19 avaliações de colecionadores
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h2 className="font-semibold text-foreground">
                    Sobre este NFT:
                  </h2>

                  <p className="text-sm leading-7 text-secondary">
                    Um colecionável digital finalizado à mão da coleção Kurio
                    Editions, verificado na Ethereum, com arte desbloqueável e
                    acesso para colecionadores.
                  </p>
                </div>

                <div className="space-y-3">
                  <h2 className="font-semibold">Edição:</h2>

                  <div className="flex flex-wrap gap-2">
                    {editions.map((edition) => (
                      <Badge
                        key={edition}
                        variant={
                          selectedEdition === edition ? "default" : "outline"
                        }
                        onClick={() => setSelectedEdition(edition)}
                        className="min-w-10 h-10 cursor-pointer rounded-full px-3"
                      >
                        {edition}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Quantidade — esquerda */}
                  <div className="flex h-11 items-center">
                    <Button
                      className="rounded-full"
                      type="button"
                      variant="default"
                      size="icon"
                      aria-label="Diminuir quantidade"
                      disabled={quantity <= 1}
                      onClick={() =>
                        setQuantity((current) => Math.max(1, current - 1))
                      }
                    >
                      <Minus size={16} />
                    </Button>

                    <span className="min-w-8 text-center text-sm">
                      {quantity}
                    </span>

                    <Button
                      className="rounded-full"
                      type="button"
                      variant="default"
                      size="icon"
                      aria-label="Aumentar quantidade"
                      disabled={quantity >= nft.availableQuantity}
                      onClick={() =>
                        setQuantity((current) =>
                          Math.min(nft.availableQuantity, current + 1),
                        )
                      }
                    >
                      <Plus size={16} />
                    </Button>
                  </div>

                  <div className="flex w-full max-w-[268px] gap-3">
                    <Button
                      className="w-full max-w-[130px] px-[35px] py-[10px]"
                      disabled={nft.availableQuantity <= 0}
                      onClick={handleBuy}
                    >
                      COMPRAR
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      aria-label="Favoritar NFT"
                      aria-pressed={isFavorite}
                      onClick={() => setIsFavorite((current) => !current)}
                      className={`group w-full max-w-[130px] ${
                        isFavorite ? "border-primary text-primary" : ""
                      }`}
                    >
                      <Heart
                        size={20}
                        weight={isFavorite ? "fill" : "regular"}
                        className="size-5 shrink-0 transition-colors group-hover:!text-primary"
                      />
                      Favoritar
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border-t border-border pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">ID do token:</span>
                    <span>#0042</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Coleção:</span>
                    <span>Kurio Apes</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Atributos:</span>
                    <span className="text-right">Óculos, Esmeralda, Raro</span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground">
                      Compartilhar este NFT:
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label="Compartilhar no LinkedIn"
                        onClick={() => handleShare("linkedin")}
                        className="text-muted-foreground transition-colors hover:text-accent"
                      >
                        <LinkedinLogo size={19} />
                      </button>

                      <a
                        href={`mailto:?subject=${encodeURIComponent(nft.name)}&body=${encodeURIComponent(window.location.href)}`}
                        aria-label="Compartilhar por email"
                        className="text-muted-foreground transition-colors hover:text-accent"
                      >
                        <EnvelopeSimple size={19} />
                      </a>

                      <button
                        type="button"
                        aria-label="Compartilhar no Twitter"
                        onClick={() => handleShare("twitter")}
                        className="text-muted-foreground transition-colors hover:text-accent"
                      >
                        <TwitterLogo size={19} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 2: Detalhes e avaliações */}
          <section className="space-y-8">
            <div className="flex gap-8 border-b border-border">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`relative pb-4 text-sm font-medium transition-colors ${
                  activeTab === "details"
                    ? "text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Detalhes do NFT
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`relative pb-4 text-sm font-medium transition-colors ${
                  activeTab === "reviews"
                    ? "text-accent after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Avaliações de Colecionadores
              </button>
            </div>

            {activeTab === "details" ? (
              <div className="space-y-8 text-sm leading-7 text-muted-foreground">
                <p>
                  Emerald Ape #042 é uma obra digital 1/50 finalizada à mão da
                  coleção Kurio Editions. Cada atributo fica armazenado nos
                  metadados do token e verificado na Ethereum. A obra explora
                  identidade, movimento e luz em um mundo digital sem
                  fronteiras.
                </p>

                <p>
                  A propriedade inclui a arte em alta resolução, lançamentos
                  exclusivos para colecionadores e um registro permanente de
                  procedência registrada na rede. Nova Sato recebe 5% de
                  direitos autorais nas vendas secundárias, apoiando novos
                  trabalhos e lançamentos da comunidade.
                </p>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Rede:</h3>

                  <p>
                    Cunhado na Ethereum com procedência imutável e metadados
                    armazenados no IPFS.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Contrato:</h3>

                  <p>
                    Direitos autorais do criador: 5% nas vendas secundárias,
                    pagos automaticamente pelos mercados compatíveis.
                  </p>

                  <h3 className="font-semibold text-foreground">
                    Direitos autorais:
                  </h3>

                  <p>
                    0x7A42...19E8 • Contrato inteligente ERC-721 verificado.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="font-semibold">Avaliações de Colecionadores</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  As avaliações dos colecionadores serão exibidas aqui.
                </p>
              </div>
            )}
          </section>

          {/* Seção 3: Mais da coleção */}
          <section className="space-y-8">
            <h2 className="text-2xl font-semibold">Mais desta Coleção</h2>

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
              {visibleNFTs.map((item) => (
                <Link
                  key={item.id}
                  to="/nft/$nftId"
                  params={{ nftId: item.id }}
                  className="group min-w-0 space-y-3"
                >
                  <div className="overflow-hidden rounded-lg bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="truncate text-sm font-medium transition-colors group-hover:text-accent">
                      {item.name}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} {item.currency}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Indicadores do carrossel */}
            <div className="flex justify-center gap-3">
              {carouselOffsets.map((offset, index) => (
                <button
                  key={`${offset}-${index}`}
                  type="button"
                  aria-label={`Mostrar grupo ${index + 1} da coleção`}
                  aria-pressed={carouselPage === index}
                  onClick={() => setCarouselPage(index)}
                  className={`h-2 rounded-full transition-all ${
                    carouselPage === index
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
