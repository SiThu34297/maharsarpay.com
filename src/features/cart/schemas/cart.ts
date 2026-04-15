export const CART_STORAGE_KEY = "maharsarpay:cart:v1";

export type AddToCartPayload = {
  cartProductId: string;
  title: string;
  author: string;
  price: number;
  coverImageSrc: string;
  coverImageAlt: string;
};

export type CartLineItem = AddToCartPayload & {
  quantity: number;
};

export type CartState = {
  items: CartLineItem[];
};

export const emptyCartState: CartState = {
  items: [],
};

export function getCartTotalItems(state: CartState): number {
  return state.items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartSubtotal(state: CartState): number {
  return state.items.reduce((subtotal, item) => subtotal + item.price * item.quantity, 0);
}
