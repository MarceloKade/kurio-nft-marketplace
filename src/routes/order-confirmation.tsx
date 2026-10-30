import { createRoute } from "@tanstack/react-router";

import { Route as rootRoute } from "./__root";
import { OrderConfirmation } from "@/features/checkout/order-confirmation";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order-confirmation/$orderId",
  component: OrderConfirmation,
});
