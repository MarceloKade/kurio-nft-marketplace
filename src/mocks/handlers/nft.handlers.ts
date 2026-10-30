import { http, HttpResponse } from "msw";
import { nftFixtures } from "@/mocks/fixtures/nfts";
import type { NFT, NFTCategory, NFTSortOption } from "@/types/nft";

const API_URL = "/api/nfts";

export const nftHandlers = [
  // GET /api/nfts — listar NFTs com filtros e paginação
  http.get(API_URL, ({ request }) => {
    const url = new URL(request.url);

    const search = url.searchParams.get("search")?.trim().toLowerCase();
    const category = url.searchParams.get("category");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const sort = url.searchParams.get("sort") ?? "recent";

    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(url.searchParams.get("limit")) || 9),
    );

    let results: NFT[] = [...nftFixtures];

    if (search) {
      results = results.filter((nft) =>
        [
          nft.name,
          nft.description,
          nft.collection,
          nft.creator.name,
          nft.creator.username,
        ].some((value) => value.toLowerCase().includes(search)),
      );
    }

    if (category) {
      const validCategories: NFTCategory[] = [
        "Art",
        "Gaming",
        "Photography",
        "Collectibles",
        "Music",
      ];

      if (!validCategories.includes(category as NFTCategory)) {
        return HttpResponse.json(
          { message: "Categoria inválida." },
          { status: 400 },
        );
      }

      results = results.filter((nft) => nft.category === category);
    }

    if (minPrice !== null) {
      const value = Number(minPrice);

      if (!Number.isFinite(value) || value < 0) {
        return HttpResponse.json(
          { message: "Preço mínimo inválido." },
          { status: 400 },
        );
      }

      results = results.filter((nft) => Number(nft.price) >= value);
    }

    if (maxPrice !== null) {
      const value = Number(maxPrice);

      if (!Number.isFinite(value) || value < 0) {
        return HttpResponse.json(
          { message: "Preço máximo inválido." },
          { status: 400 },
        );
      }

      results = results.filter((nft) => Number(nft.price) <= value);
    }

    const sortOptions: NFTSortOption[] = [
      "recent",
      "price_asc",
      "price_desc",
      "popular",
    ];

    if (!sortOptions.includes(sort as NFTSortOption)) {
      return HttpResponse.json(
        { message: "Ordenação inválida." },
        { status: 400 },
      );
    }

    switch (sort as NFTSortOption) {
      case "price_asc":
        results.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      case "price_desc":
        results.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case "popular":
        results.sort((a, b) => b.favoriteCount - a.favoriteCount);
        break;

      case "recent":
      default:
        results.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    const totalItems = results.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;

    return HttpResponse.json({
      items: results.slice(startIndex, startIndex + limit),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  }),

  // GET /api/nfts/:id — consultar os detalhes de um NFT
  http.get(`${API_URL}/:id`, ({ params }) => {
    const id = String(params.id);

    const nft = nftFixtures.find((item) => item.id === id);

    if (!nft) {
      return HttpResponse.json(
        { message: "NFT não encontrado." },
        { status: 404 },
      );
    }

    return HttpResponse.json(nft);
  }),
];
