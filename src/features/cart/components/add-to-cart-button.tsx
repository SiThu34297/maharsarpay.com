"use client";

import { useEffect, useRef, useState } from "react";

import { CheckIcon } from "@radix-ui/react-icons";

import { useCart } from "@/features/cart/context/cart-context";
import type { AddToCartPayload } from "@/features/cart/schemas/cart";

type AddToCartButtonProps = Readonly<{
  item: AddToCartPayload;
  addLabel: string;
  addedLabel: string;
  className?: string;
}>;

const ADDED_FEEDBACK_DURATION_MS = 1300;

function ShoppingCartIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="9" cy="20" r="1.6" />
      <circle cx="18" cy="20" r="1.6" />
      <path d="M2 3h2.6l2.3 10.1a2 2 0 0 0 2 1.5h8.8a2 2 0 0 0 2-1.6L21 7H7.2" />
    </svg>
  );
}

export function AddToCartButton({ item, addLabel, addedLabel, className }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleClick() {
    addItem(item);
    setIsAdded(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setIsAdded(false);
      timeoutRef.current = null;
    }, ADDED_FEEDBACK_DURATION_MS);
  }

  return (
    <button
      type="button"
      aria-label={isAdded ? addedLabel : addLabel}
      title={isAdded ? addedLabel : addLabel}
      className={className}
      onClick={handleClick}
    >
      {isAdded ? <CheckIcon className="h-4 w-4" /> : <ShoppingCartIcon />}
    </button>
  );
}
