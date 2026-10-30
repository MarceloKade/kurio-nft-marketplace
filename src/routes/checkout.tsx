import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { CheckoutPage } from "@/features/checkout/checkout-page";

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});
