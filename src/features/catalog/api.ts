import { api } from "@/lib/api";
import type { NFTFilters, PaginatedNFTs, NFT } from "@/types/nft";

export async function getNFTs(
  filters: NFTFilters = {},
): Promise<PaginatedNFTs> {
  const { data } = await api.get<PaginatedNFTs>("/nfts", {
    params: filters,
  });

  return data;
}

export async function getNFTById(id: string): Promise<NFT> {
  const { data } = await api.get<NFT>(`/nfts/${encodeURIComponent(id)}`);

  return data;
}
