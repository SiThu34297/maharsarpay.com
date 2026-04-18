import "server-only";

import type { Session } from "next-auth";

import { fetchUserOrders } from "@/features/cart-server";
import type { Locale } from "@/lib/i18n";

import type { ProfileOrder, ProfileSummary } from "@/features/profile/schemas/profile";

type SessionUser = Session["user"];

function getFallbackName(locale: Locale): string {
  return locale === "my" ? "စာဖတ်သူ" : "Reader";
}

function toOptionalString(value: string | null | undefined): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toPlacedAt(items: Array<{ createdAt: string | null }>): string | null {
  for (const item of items) {
    if (item.createdAt) {
      return item.createdAt;
    }
  }

  return null;
}

function toProfileOrders(
  orders: Array<{
    id: string;
    invoiceNo: string;
    orderStatus: string;
    customerName: string | null;
    customerPhone: string | null;
    shippingAddress: string | null;
    subtotalAmount: number;
    deliveryFee: number;
    discountAmount: number;
    totalAmount: number;
    items: Array<{
      id: string;
      title: string;
      authors: Array<{
        id: string;
        name: string;
      }>;
      quantity: number;
      createdAt: string | null;
    }>;
  }>,
): ProfileOrder[] {
  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.invoiceNo,
    placedAt: toPlacedAt(order.items),
    status: order.orderStatus,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    shippingAddress: order.shippingAddress,
    subtotalAmount: order.subtotalAmount,
    deliveryFee: order.deliveryFee,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount,
    items: order.items.map((item) => ({
      id: item.id,
      title: item.title,
      authors: item.authors,
      quantity: item.quantity,
    })),
  }));
}

export async function getProfileSummary(
  locale: Locale,
  user: SessionUser,
): Promise<ProfileSummary> {
  return {
    id: toOptionalString(user?.id),
    name: user?.name?.trim() || getFallbackName(locale),
    email: user?.email?.trim() || "unknown@maharsarpay.com",
    imageSrc: toOptionalString(user?.image),
    phoneNumber: toOptionalString(user?.phoneNumber),
    address: toOptionalString(user?.address),
    loginType: toOptionalString(user?.loginType),
    authProvider: toOptionalString(user?.authProvider),
    isEmailVerified: typeof user?.isEmailVerified === "boolean" ? user.isEmailVerified : null,
  };
}

export async function getOrderHistory(user: SessionUser): Promise<ProfileOrder[]> {
  if (!user?.id || !user.authToken) {
    return [];
  }

  const userOrdersResult = await fetchUserOrders(user.authToken, user.id);

  if (!userOrdersResult.ok) {
    return [];
  }

  return toProfileOrders(userOrdersResult.data);
}
