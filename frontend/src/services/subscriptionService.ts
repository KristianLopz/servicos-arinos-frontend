import { api } from "./api";

export type PaymentMethod = "cartao" | "pix" | "boleto";

export interface SubscribePayload {
  payment_method: PaymentMethod;
  billing_cycle: "mensal" | "anual";
  card_holder?: string;
  card_number?: string;
  card_expiry?: string;
  card_cvv?: string;
  pix_cpf?: string;
  boleto_name?: string;
  boleto_cpf?: string;
  boleto_email?: string;
}

export async function getSubscriptionStatus(token: string) {
  const response = await api("/subscription/status", {
    method: "GET",
    token,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao consultar assinatura.");
  }

  return data;
}

export async function subscribePremium(token: string, payload: SubscribePayload) {
  const response = await api("/subscription/subscribe", {
    method: "POST",
    token,
    body: JSON.stringify({
      ...payload,
      card_token: "pagamento_simulado_local",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao assinar plano Premium.");
  }

  return data;
}

export async function cancelPremium(token: string) {
  const response = await api("/subscription/cancel", {
    method: "POST",
    token,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao cancelar assinatura.");
  }

  return data;
}
