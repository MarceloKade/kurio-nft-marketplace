import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  LockKey,
  CaretDown,
  Tag,
} from "@phosphor-icons/react";
import { AxiosError } from "axios";

import { useCartStore } from "@/features/cart/cart-store";
import { useCreateOrder } from "@/features/checkout/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PaymentMethod } from "@/types/order";
import { Badge } from "@/components/ui/badge";

const inputClassName =
  "mt-2 h-10 w-full rounded-lg border border-border bg-muted px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary";

const labelClassName = "text-sm font-medium text-secondary";

export function CheckoutPage() {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("wallet");
  const [network, setNetwork] = useState("Ethereum");
  const [walletType, setWalletType] = useState("MetaMask");
  const [ensName, setEnsName] = useState("");
  const [useAnotherWallet, setUseAnotherWallet] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");

  const [profile, setProfile] = useState({
    displayName: "",
    username: "",
    profileName: "",
    walletAddress: "",
    secondaryWallet: "",
    referralCode: "",
    email: "",
    observation: "",
  });

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const createOrder = useCreateOrder();

  const discount = appliedPromo ? totalPrice * 0.1 : 0;
  const networkFee = totalPrice > 0 ? 0.005 : 0;
  const total = Math.max(0, totalPrice - discount) + networkFee;

  function updateProfile(field: keyof typeof profile, value: string) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleApplyPromo() {
    if (promoCode.trim().toUpperCase() === "LAUNCH10") {
      setAppliedPromo(true);
      setPromoMessage("Desconto de 10% aplicado!");
    } else {
      setAppliedPromo(false);
      setPromoMessage("Código promocional inválido.");
    }
  }

  async function handleCheckout() {
    if (items.length === 0 || createOrder.isPending) return;

    const idempotencyKey = crypto.randomUUID();

    try {
      const result = await createOrder.mutateAsync({
        items: items.map(({ nft, quantity }) => ({
          nftId: nft.id,
          quantity,
        })),
        paymentMethod,
        idempotencyKey,
      });

      clearCart();

      await navigate({
        to: "/order-confirmation/$orderId",
        params: { orderId: result.order.id },
      });
    } catch {
      // O erro é exibido na interface.
    }
  }

  const error = createOrder.error;
  const errorMessage =
    error instanceof AxiosError
      ? (error.response?.data?.message ??
        "Não foi possível processar o pedido. Tente novamente.")
      : "Não foi possível processar o pedido. Tente novamente.";

  if (items.length === 0 && !createOrder.isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-4 text-foreground">
        <Card className="w-full max-w-md border-border bg-card py-0">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <h1 className="text-xl font-bold">Carrinho vazio</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Adicione NFTs ao carrinho antes de finalizar a compra.
            </p>

            <Link
              to="/"
              search={{
                search: "",
                category: undefined,
                sort: "recent",
                page: 1,
              }}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-foreground hover:bg-primary/90"
            >
              Explorar NFTs
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-foreground">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft size={18} />
          Voltar ao carrinho
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Finalizar compra
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Informe os dados do seu perfil e revise sua compra.
          </p>
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(320px,0.9fr)]">
          {/* Coluna 1 — Perfil do colecionador */}
          <Card className="border-border bg-card py-0">
            <CardContent className="space-y-5 p-5">
              <div>
                <h2 className="text-lg font-semibold">
                  Perfil do colecionador
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Informações pessoais e da carteira.
                </p>
              </div>

              <label className="block">
                <span className={labelClassName}>Nome de exibição</span>
                <input
                  className={inputClassName}
                  placeholder="Como deseja ser chamado"
                  value={profile.displayName}
                  onChange={(event) =>
                    updateProfile("displayName", event.target.value)
                  }
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Rede</span>
                <span className="relative block">
                  <select
                    className={`${inputClassName} appearance-none pr-9`}
                    value={network}
                    onChange={(event) => setNetwork(event.target.value)}
                  >
                    <option value="Ethereum">Ethereum</option>
                    <option value="Polygon">Polygon</option>
                    <option value="Base">Base</option>
                    <option value="Arbitrum">Arbitrum</option>
                    <option value="Optimism">Optimism</option>
                    <option value="Solana">Solana</option>
                  </select>
                  <CaretDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-3.5 text-muted-foreground"
                  />
                </span>
              </label>

              <label className="block">
                <span className={labelClassName}>Endereço da carteira</span>
                <input
                  className={inputClassName}
                  placeholder="0x..."
                  value={profile.walletAddress}
                  onChange={(event) =>
                    updateProfile("walletAddress", event.target.value)
                  }
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Tipo de carteira</span>
                <span className="relative block">
                  <select
                    className={`${inputClassName} appearance-none pr-9`}
                    value={walletType}
                    onChange={(event) => setWalletType(event.target.value)}
                  >
                    <option value="MetaMask">MetaMask</option>
                    <option value="WalletConnect">WalletConnect</option>
                    <option value="Coinbase Wallet">Coinbase Wallet</option>
                    <option value="Outra">Outra</option>
                  </select>
                  <CaretDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-3.5 text-muted-foreground"
                  />
                </span>
              </label>

              <label className="block">
                <span className={labelClassName}>E-mail</span>
                <input
                  type="email"
                  className={inputClassName}
                  placeholder="voce@exemplo.com"
                  value={profile.email}
                  onChange={(event) =>
                    updateProfile("email", event.target.value)
                  }
                />
              </label>

              <fieldset>
                <legend className={labelClassName}>Usar outra carteira?</legend>
                <div className="mt-3 flex gap-5">
                  {[false, true].map((value) => (
                    <label
                      key={String(value)}
                      className="flex cursor-pointer items-center gap-2 text-sm text-secondary"
                    >
                      <input
                        type="radio"
                        name="useAnotherWallet"
                        checked={useAnotherWallet === value}
                        onChange={() => setUseAnotherWallet(value)}
                        className="accent-primary"
                      />
                      {value ? "Sim" : "Não"}
                    </label>
                  ))}
                </div>
              </fieldset>

              {useAnotherWallet && (
                <label className="block">
                  <span className={labelClassName}>
                    Endereço da carteira secundária
                  </span>
                  <input
                    className={inputClassName}
                    placeholder="Endereço da outra carteira"
                    value={profile.secondaryWallet}
                    onChange={(event) =>
                      updateProfile("secondaryWallet", event.target.value)
                    }
                  />
                </label>
              )}

              <label className="block">
                <span className={labelClassName}>
                  Observação do colecionador (opcional)
                </span>
                <textarea
                  className="mt-2 min-h-24 w-full resize-y rounded-lg border border-border bg-card px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
                  placeholder="Adicione uma observação..."
                  value={profile.observation}
                  onChange={(event) =>
                    updateProfile("observation", event.target.value)
                  }
                />
              </label>
            </CardContent>
          </Card>

          {/* Coluna 2 — Dados complementares do perfil */}
          <Card className="border-border bg-card py-0">
            <CardContent className="space-y-5 p-5">
              <div>
                <h2 className="text-lg font-semibold">Dados complementares</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Personalize sua identidade no marketplace.
                </p>
              </div>

              <label className="block">
                <span className={labelClassName}>Nome de usuário</span>
                <input
                  className={inputClassName}
                  placeholder="@seuusuario"
                  value={profile.username}
                  onChange={(event) =>
                    updateProfile("username", event.target.value)
                  }
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Nome do perfil</span>
                <input
                  className={inputClassName}
                  placeholder="Nome público do perfil"
                  value={profile.profileName}
                  onChange={(event) =>
                    updateProfile("profileName", event.target.value)
                  }
                />
              </label>

              <label className="block">
                <span className={labelClassName}>
                  ENS ou carteira secundária (opcional)
                </span>
                <input
                  className={inputClassName}
                  placeholder="nome.eth ou endereço"
                  value={profile.secondaryWallet}
                  onChange={(event) =>
                    updateProfile("secondaryWallet", event.target.value)
                  }
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Código de indicação</span>
                <input
                  className={inputClassName}
                  placeholder="Código de indicação"
                  value={profile.referralCode}
                  onChange={(event) =>
                    updateProfile("referralCode", event.target.value)
                  }
                />
              </label>

              <label className="block">
                <span className={labelClassName}>Nome ENS</span>
                <span className="relative block">
                  <select
                    className={`${inputClassName} appearance-none pr-9`}
                    value={ensName}
                    onChange={(event) => setEnsName(event.target.value)}
                  >
                    <option value="">Selecione uma opção</option>
                    <option value="personal">Usar nome pessoal</option>
                    <option value="ens">Usar domínio ENS</option>
                    <option value="none">Não tenho ENS</option>
                  </select>
                  <CaretDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-3.5 text-muted-foreground"
                  />
                </span>
              </label>

              <div className="rounded-lg border border-border bg-muted p-4">
                <p className="text-sm font-medium">Sobre seu perfil</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Os dados informados são mantidos apenas nesta interface
                  demonstrativa. A integração com perfil persistente será feita
                  posteriormente.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Coluna 3 — NFTs e resumo do pedido */}
          <div className="space-y-6">
            <Card className="border-border py-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-3 border-b pb-2 border-border">
                  <h2 className="text-lg font-semibold">NFTs</h2>
                  <span className="text-sm text-muted-foreground">
                    Subtotal
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {items.map(({ nft, quantity }) => (
                    <div
                      key={nft.id}
                      className="flex items-center justify-between gap-4 bg-surface  pr-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="size-14 shrink-0 rounded-lg object-cover"
                        />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {nft.name}
                          </p>
                          <p className="mt-1 text-sm text-secondary">
                            ID do token: {nft.id}
                          </p>
                        </div>
                      </div>

                      <Badge
                        className="shrink-0 text-secondary"
                        variant="ghost"
                      >
                        {quantity}
                      </Badge>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium text-secondary">
                          {(Number(nft.price) * quantity).toFixed(3)} ETH
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5">
                  <label className="text-sm font-medium">
                    Tem um código promocional?
                  </label>

                  <div className="mt-3 flex gap-2">
                    <input
                      className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                      placeholder="Digite o código"
                      value={promoCode}
                      onChange={(event) => {
                        setPromoCode(event.target.value);
                        setPromoMessage("");
                      }}
                    />

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyPromo}
                      className="border-border px-3"
                    >
                      <Tag size={16} />
                      Aplicar
                    </Button>
                  </div>

                  {promoMessage && (
                    <p
                      role="status"
                      className={`mt-2 text-xs ${
                        appliedPromo ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {promoMessage}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-muted-foreground">
                    Experimente o código LAUNCH10.
                  </p>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{totalPrice.toFixed(3)} ETH</span>
                  </div>

                  <div className="flex justify-between gap-4 text-muted-foreground">
                    <span>Desconto do lançamento</span>
                    <span className={discount > 0 ? "text-emerald-400" : ""}>
                      {discount > 0 ? "-" : ""}
                      {discount.toFixed(3)} ETH
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-muted-foreground">
                    <span>Taxa de rede</span>
                    <span>{networkFee.toFixed(3)} ETH</span>
                  </div>

                  <p className="text-xs text-muted-foreground">Taxa estimada</p>
                </div>

                <div className="my-5 border-t border-border" />

                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-accent">
                    {total.toFixed(3)} ETH
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card py-0">
              <CardContent className="p-5">
                <h2 className="text-lg font-semibold">Carteira e rede</h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Escolha como deseja simular o pagamento.
                </p>

                <fieldset className="mt-5 space-y-3">
                  <legend className="sr-only">Método de pagamento</legend>

                  {[
                    {
                      value: "wallet" as const,
                      title: "MetaMask",
                      description: "Conectar com MetaMask",
                      icon: Wallet,
                    },
                    {
                      value: "card" as const,
                      title: "WalletConnect",
                      description: "Conectar com WalletConnect",
                      icon: CreditCard,
                    },
                    {
                      value: "card" as const,
                      title: "Coinbase Wallet",
                      description: "Conectar com Coinbase Wallet",
                      icon: Wallet,
                    },
                  ].map((option) => (
                    <label
                      key={option.title}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                        paymentMethod === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="checkoutWallet"
                        checked={
                          option.title === "MetaMask"
                            ? paymentMethod === "wallet"
                            : option.title === "WalletConnect"
                              ? paymentMethod === "card" &&
                                walletType === "WalletConnect"
                              : paymentMethod === "card" &&
                                walletType === "Coinbase Wallet"
                        }
                        onChange={() => {
                          setPaymentMethod(option.value);
                          setWalletType(option.title);
                        }}
                        className="accent-primary"
                      />

                      <option.icon size={22} className="shrink-0 text-accent" />

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">
                          {option.title}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </fieldset>

                {createOrder.isError && (
                  <div
                    role="alert"
                    className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300"
                  >
                    {errorMessage}
                  </div>
                )}

                <Button
                  className="mt-6 w-full"
                  disabled={createOrder.isPending || items.length === 0}
                  onClick={handleCheckout}
                >
                  {createOrder.isPending
                    ? "Processando pedido..."
                    : "Confirmar compra"}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <LockKey size={14} />
                  Checkout demonstrativo, sem cobrança real.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
