import { createRoute } from "@tanstack/react-router";

import { Route as rootRoute } from "./__root";
import { CartPage } from "@/features/cart/cart-page";

export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});
