import { useQuery } from "@tanstack/react-query";
import { getNFTById, getNFTs } from "./api";
import type { NFTFilters } from "@/types/nft";

export const nftKeys = {
  all: ["nfts"] as const,
  lists: () => [...nftKeys.all, "list"] as const,
  list: (filters: NFTFilters) => [...nftKeys.lists(), filters] as const,
  details: () => [...nftKeys.all, "detail"] as const,
  detail: (id: string) => [...nftKeys.details(), id] as const,
};

export function useNFTs(filters: NFTFilters = {}) {
  return useQuery({
    queryKey: nftKeys.list(filters),
    queryFn: () => getNFTs(filters),
  });
}

export function useNFT(id: string) {
  return useQuery({
    queryKey: nftKeys.detail(id),
    queryFn: () => getNFTById(id),
    enabled: Boolean(id),
  });
}
