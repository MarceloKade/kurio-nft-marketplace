import { http, HttpResponse } from "msw";

import { mockStore } from "@/mocks/db/store";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  Order,
  OrderItem,
  PaymentMethod,
} from "@/types/order";

export const orderHandlers = [
  http.post("/api/orders", async ({ request }) => {
    let body: CreateOrderRequest;

    try {
      body = (await request.json()) as CreateOrderRequest;
    } catch {
      return HttpResponse.json(
        { message: "Corpo da requisição inválido." },
        { status: 400 },
      );
    }

    const { items, paymentMethod, idempotencyKey } = body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof idempotencyKey !== "string" ||
      !idempotencyKey.trim() ||
      !["wallet", "card"].includes(paymentMethod)
    ) {
      return HttpResponse.json(
        { message: "Dados do pedido inválidos." },
        { status: 400 },
      );
    }

    if (
      items.some(
        (item) =>
          !item ||
          typeof item.nftId !== "string" ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0,
      )
    ) {
      return HttpResponse.json(
        { message: "Os itens do pedido são inválidos." },
        { status: 400 },
      );
    }

    // Uma mesma chave não pode gerar pedidos diferentes.
    const existingOrder = mockStore.getOrderByIdempotencyKey(idempotencyKey);

    if (existingOrder) {
      return HttpResponse.json<CreateOrderResponse>({
        order: existingOrder,
      });
    }

    // Evita ambiguidades causadas por IDs repetidos no payload.
    const requestedItems = new Map<string, number>();

    for (const item of items) {
      requestedItems.set(
        item.nftId,
        (requestedItems.get(item.nftId) ?? 0) + item.quantity,
      );
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    // Validar todos os itens antes de alterar qualquer estoque.
    for (const [nftId, quantity] of requestedItems) {
      const nft = mockStore.getNFTById(nftId);

      if (!nft) {
        return HttpResponse.json(
          { message: `NFT não encontrado: ${nftId}.` },
          { status: 404 },
        );
      }

      if (quantity > nft.availableQuantity) {
        return HttpResponse.json(
          {
            message: `Estoque insuficiente para ${nft.name}. Disponível: ${nft.availableQuantity}.`,
          },
          { status: 409 },
        );
      }

      const unitPrice = Number(nft.price);

      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return HttpResponse.json(
          { message: `Preço inválido para ${nft.name}.` },
          { status: 500 },
        );
      }

      orderItems.push({
        nftId: nft.id,
        name: nft.name,
        image: nft.image,
        unitPrice: nft.price,
        quantity,
      });

      total += unitPrice * quantity;
    }

    const order: Order = {
      id: crypto.randomUUID(),
      idempotencyKey,
      status: "completed",
      paymentMethod: paymentMethod as PaymentMethod,
      items: orderItems,
      total: total.toFixed(3),
      createdAt: new Date().toISOString(),
    };

    // Atualizar estoque e registrar o pedido após validar tudo.
    for (const item of orderItems) {
      const nft = mockStore.getNFTById(item.nftId)!;

      mockStore.updateNFT({
        ...nft,
        availableQuantity: nft.availableQuantity - item.quantity,
      });
    }

    mockStore.saveOrder(order);

    return HttpResponse.json<CreateOrderResponse>({ order }, { status: 201 });
  }),

  http.get("/api/orders/:id", ({ params }) => {
    const order = mockStore.getOrder(String(params.id));

    if (!order) {
      return HttpResponse.json(
        { message: "Pedido não encontrado." },
        { status: 404 },
      );
    }

    return HttpResponse.json({ order });
  }),
];
