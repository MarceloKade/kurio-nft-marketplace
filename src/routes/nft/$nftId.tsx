import { createRoute } from "@tanstack/react-router";

import { Route as rootRoute } from "../__root";
import { NFTDetail } from "@/features/nft-detail/nft-detail";

export const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/nft/$nftId",
  component: NFTDetail,
});
