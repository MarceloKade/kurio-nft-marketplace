export interface NFT {
  id: string;
  name: string;
  description: string;
  image: string;
  collection: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  price: string;
  currency: "ETH";
  availableQuantity: number;
  edition: number;
  totalEditions: number;
  category: NFTCategory;
  createdAt: string;
  favoriteCount: number;
}

export type NFTCategory =
  | "Art"
  | "Gaming"
  | "Photography"
  | "Collectibles"
  | "Music"
  | "Art3d"
  | "Subscriptions"
  | "Generactive"
  | "Utility";

export type NFTSortOption = "recent" | "price_asc" | "price_desc" | "popular";

export interface NFTFilters {
  search?: string;
  category?: NFTCategory;
  minPrice?: string;
  maxPrice?: string;
  sort?: NFTSortOption;
  page?: number;
  limit?: number;
}

export interface PaginatedNFTs {
  items: NFT[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
