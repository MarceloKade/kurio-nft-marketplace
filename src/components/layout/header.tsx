import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  MagnifyingGlass,
  ShoppingCart,
  SignOut,
  X,
} from "@phosphor-icons/react";

import { Input } from "@/components/ui/input";
import { useCartStore } from "@/features/cart/cart-store";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isNFTDetail = location.pathname.startsWith("/nft/");

  const totalItems = useCartStore((state) => state.getTotalItems());

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navRef = useRef<HTMLElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const [searchPosition, setSearchPosition] = useState({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.searchStr);
    setSearch(params.get("search") ?? "");
  }, [location.searchStr]);

  const changeSearch = (value: string) => {
    setSearch(value);

    void navigate({
      to: "/",
      search: {
        search: value,
        category: undefined,
        sort: "recent",
        page: 1,
      },
      replace: true,
    });
  };

  useLayoutEffect(() => {
    if (!isSearchOpen) return;

    const updateSearchPosition = () => {
      const nav = navRef.current;
      const searchButton = searchButtonRef.current;
      const container = nav?.parentElement;

      if (!nav || !searchButton || !container) return;

      const navRect = nav.getBoundingClientRect();
      const buttonRect = searchButton.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const gap = 16;

      setSearchPosition({
        left: navRect.right - containerRect.left + gap,
        width: Math.max(0, buttonRect.left - navRect.right - gap * 2),
      });
    };

    updateSearchPosition();

    const container = navRef.current?.parentElement;

    const observer = new ResizeObserver(updateSearchPosition);

    if (container) observer.observe(container);

    window.addEventListener("resize", updateSearchPosition);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSearchPosition);
    };
  }, [isSearchOpen]);

  return (
    <header className="mx-auto w-full max-w-[1440px] px-[120px] pt-6">
      <div className="relative mx-auto flex h-[45px] items-start justify-between gap-6 border-b-[0.3px] border-primary">
        <Link
          to="/"
          search={{
            search: "",
            category: undefined,
            sort: "recent",
            page: 1,
          }}
          className="shrink-0"
          aria-label="KURIO - Início"
        >
          <span className="text-[14px] font-bold leading-none tracking-widest text-white">
            KURIO
          </span>
        </Link>

        <nav
          ref={navRef}
          className="hidden shrink-0 items-center gap-6 text-sm md:flex"
        >
          <Link
            to="/"
            search={{
              search: "",
              category: undefined,
              sort: "recent",
              page: 1,
            }}
            aria-current={isHome ? "page" : undefined}
            className="relative text-foreground transition-colors hover:text-accent hover:after:-bottom-[25px] aria-[current=page]:text-accent aria-[current=page]:after:absolute aria-[current=page]:after:-bottom-[25px] aria-[current=page]:after:left-0 aria-[current=page]:after:h-[3px] aria-[current=page]:after:w-full aria-[current=page]:after:bg-accent"
          >
            Início
          </Link>

          <a
            href="#explore"
            aria-current={isNFTDetail ? "page" : undefined}
            className="relative text-foreground transition-colors hover:text-accent hover:after:-bottom-[25px] aria-[current=page]:text-accent aria-[current=page]:after:absolute aria-[current=page]:after:-bottom-[25px] aria-[current=page]:after:left-0 aria-[current=page]:after:h-[3px] aria-[current=page]:after:w-full aria-[current=page]:after:bg-accent"
          >
            Mercado
          </a>

          <a
            href="#creators"
            className="relative text-foreground transition-colors hover:text-accent hover:after:-bottom-[25px] aria-[current=page]:text-accent aria-[current=page]:after:absolute aria-[current=page]:after:-bottom-[25px] aria-[current=page]:after:left-0 aria-[current=page]:after:h-[3px] aria-[current=page]:after:w-full aria-[current=page]:after:bg-accent"
          >
            Criadores
          </a>

          <a
            href="#learn"
            className="relative text-foreground transition-colors hover:text-accent hover:after:-bottom-[25px] aria-[current=page]:text-accent aria-[current=page]:after:absolute aria-[current=page]:after:-bottom-[25px] aria-[current=page]:after:left-0 aria-[current=page]:after:h-[3px] aria-[current=page]:after:w-full aria-[current=page]:after:bg-accent"
          >
            Aprenda
          </a>
        </nav>

        {isSearchOpen && searchPosition.width > 0 && (
          <div
            className="absolute top-1/2 z-10 -translate-y-1/2 animate-in fade-in duration-200"
            style={{
              left: searchPosition.left,
              width: searchPosition.width,
            }}
          >
            <Input
              autoFocus
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsSearchOpen(false);
                }
              }}
              placeholder="Buscar NFT, coleção ou criador..."
              aria-label="Buscar NFTs"
              className="h-9 w-full border-white/10 bg-zinc-950 text-sm text-white placeholder:text-zinc-500"
            />
          </div>
        )}

        <div className="flex shrink-0 items-center gap-3">
          <button
            ref={searchButtonRef}
            type="button"
            onClick={() => setIsSearchOpen((open) => !open)}
            aria-label={isSearchOpen ? "Fechar busca" : "Abrir busca"}
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            {isSearchOpen ? <X size={21} /> : <MagnifyingGlass size={24} />}
          </button>

          <Link
            to="/cart"
            aria-label={`Carrinho com ${totalItems} itens`}
            className="relative flex size-10 items-center justify-center rounded-lg text-zinc-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ShoppingCart size={24} />

            {totalItems > 0 && (
              <span className="absolute -right-1 top-2/5 flex size-5 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-xs font-bold text-ink">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => {}}
            className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-base font-semibold text-ink text-nowrap transition-colors"
          >
            <SignOut size={15} />
            Entrar
          </button>
        </div>
      </div>
    </header>
  );
}
