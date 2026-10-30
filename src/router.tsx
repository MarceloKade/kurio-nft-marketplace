import { createRouter } from "@tanstack/react-router";

import { Route as rootRoute } from "@/routes/__root";
import { indexRoute } from "@/routes";
import { nftDetailRoute } from "@/routes/nft/$nftId";
import { cartRoute } from "@/routes/cart";
import { checkoutRoute } from "@/routes/checkout";
import { Route as orderConfirmationRoute } from "@/routes/order-confirmation";

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftDetailRoute,
  cartRoute,
  checkoutRoute,
  orderConfirmationRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
