import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { NFTCatalog } from "@/features/catalog/components/nft-catalog";
import type { NFTCategory, NFTSortOption } from "@/types/nft";

const categories: NFTCategory[] = [
  "Art",
  "Gaming",
  "Photography",
  "Collectibles",
  "Music",
];

const sortOptions: NFTSortOption[] = [
  "recent",
  "price_asc",
  "price_desc",
  "popular",
];

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  validateSearch: (search: Record<string, unknown>) => ({
    search: typeof search.search === "string" ? search.search : "",
    category:
      typeof search.category === "string" &&
      categories.includes(search.category as NFTCategory)
        ? (search.category as NFTCategory)
        : undefined,
    sort:
      typeof search.sort === "string" &&
      sortOptions.includes(search.sort as NFTSortOption)
        ? (search.sort as NFTSortOption)
        : "recent",
    page:
      typeof search.page === "number" &&
      Number.isInteger(search.page) &&
      search.page > 0
        ? search.page
        : 1,
  }),
  component: NFTCatalog,
});
