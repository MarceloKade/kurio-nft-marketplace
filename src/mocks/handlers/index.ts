import { nftHandlers } from "./nft.handlers";
import { orderHandlers } from "./order.handlers";

export const handlers = [...nftHandlers, ...orderHandlers];
