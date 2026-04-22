"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import {
  CART_STORAGE_KEY,
  emptyCartState,
  getCartSubtotal,
  getCartTotalItems,
  type AddToCartPayload,
  type CartLineItem,
  type CartState,
} from "@/features/cart/schemas/cart";

type CartAction =
  | {
      type: "hydrate";
      payload: CartState;
    }
  | {
      type: "add";
      payload: AddToCartPayload;
    }
  | {
      type: "increment";
      payload: { cartProductId: string };
    }
  | {
      type: "decrement";
      payload: { cartProductId: string };
    }
  | {
      type: "remove";
      payload: { cartProductId: string };
    }
  | {
      type: "clear";
    };

type CartContextValue = {
  state: CartState;
  totalItems: number;
  subtotal: number;
  addItem: (payload: AddToCartPayload) => void;
  increment: (cartProductId: string) => void;
  decrement: (cartProductId: string) => void;
  remove: (cartProductId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSafeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function toOptionalPrice(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  return isSafeNumber(value) ? value : null;
}

function toOptionalString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value : undefined;
}

function toCartLineItem(input: unknown): CartLineItem | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const candidate = input as Partial<CartLineItem>;

  if (!isNonEmptyString(candidate.cartProductId)) {
    return null;
  }

  if (!isNonEmptyString(candidate.title)) {
    return null;
  }

  if (!isNonEmptyString(candidate.author)) {
    return null;
  }

  if (!isSafeNumber(candidate.price)) {
    return null;
  }

  if (!isNonEmptyString(candidate.coverImageSrc)) {
    return null;
  }

  if (!isNonEmptyString(candidate.coverImageAlt)) {
    return null;
  }

  if (
    !isSafeNumber(candidate.quantity) ||
    candidate.quantity < 1 ||
    !Number.isInteger(candidate.quantity)
  ) {
    return null;
  }

  return {
    cartProductId: candidate.cartProductId,
    title: candidate.title,
    author: candidate.author,
    authorId: toOptionalString(candidate.authorId),
    price: candidate.price,
    salePrice: toOptionalPrice(candidate.salePrice),
    originalPrice: toOptionalPrice(candidate.originalPrice),
    discountAmount: toOptionalPrice(candidate.discountAmount),
    coverImageSrc: candidate.coverImageSrc,
    coverImageAlt: candidate.coverImageAlt,
    quantity: candidate.quantity,
  };
}

function parsePersistedCartState(rawValue: string | null): CartState {
  if (!rawValue) {
    return emptyCartState;
  }

  try {
    const parsed = JSON.parse(rawValue) as { items?: unknown };

    if (!Array.isArray(parsed.items)) {
      return emptyCartState;
    }

    const items = parsed.items
      .map((item) => toCartLineItem(item))
      .filter((item): item is CartLineItem => item !== null);

    return { items };
  } catch {
    return emptyCartState;
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return action.payload;

    case "add": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.cartProductId === action.payload.cartProductId,
      );

      if (existingItemIndex === -1) {
        return {
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }

      const nextItems = [...state.items];
      const currentItem = nextItems[existingItemIndex];

      nextItems[existingItemIndex] = {
        ...currentItem,
        quantity: currentItem.quantity + 1,
      };

      return { items: nextItems };
    }

    case "increment": {
      const nextItems = state.items.map((item) =>
        item.cartProductId === action.payload.cartProductId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );

      return { items: nextItems };
    }

    case "decrement": {
      const existingItem = state.items.find(
        (item) => item.cartProductId === action.payload.cartProductId,
      );

      if (!existingItem) {
        return state;
      }

      if (existingItem.quantity <= 1) {
        return {
          items: state.items.filter((item) => item.cartProductId !== action.payload.cartProductId),
        };
      }

      return {
        items: state.items.map((item) =>
          item.cartProductId === action.payload.cartProductId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        ),
      };
    }

    case "remove":
      return {
        items: state.items.filter((item) => item.cartProductId !== action.payload.cartProductId),
      };

    case "clear":
      return emptyCartState;

    default:
      return state;
  }
}

type CartProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, emptyCartState);
  const isHydratingRef = useRef(true);

  useEffect(() => {
    let persistedState = emptyCartState;

    try {
      persistedState = parsePersistedCartState(window.localStorage.getItem(CART_STORAGE_KEY));
    } catch {
      persistedState = emptyCartState;
    }

    dispatch({ type: "hydrate", payload: persistedState });
    isHydratingRef.current = false;
  }, []);

  useEffect(() => {
    if (isHydratingRef.current) {
      return;
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write errors and keep cart in-memory for this session.
    }
  }, [state]);

  const addItem = useCallback((payload: AddToCartPayload) => {
    dispatch({ type: "add", payload });
  }, []);

  const increment = useCallback((cartProductId: string) => {
    dispatch({ type: "increment", payload: { cartProductId } });
  }, []);

  const decrement = useCallback((cartProductId: string) => {
    dispatch({ type: "decrement", payload: { cartProductId } });
  }, []);

  const remove = useCallback((cartProductId: string) => {
    dispatch({ type: "remove", payload: { cartProductId } });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      totalItems: getCartTotalItems(state),
      subtotal: getCartSubtotal(state),
      addItem,
      increment,
      decrement,
      remove,
      clear,
    }),
    [addItem, clear, decrement, increment, remove, state],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
