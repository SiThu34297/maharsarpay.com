"use client";

import { useEffect, useRef, useState } from "react";

import { CheckIcon, PlusIcon } from "@radix-ui/react-icons";

import { useCart } from "@/features/cart/context/cart-context";
import type { AddToCartPayload } from "@/features/cart/schemas/cart";

type AddToCartButtonProps = Readonly<{
  item: AddToCartPayload;
  addLabel: string;
  addedLabel: string;
  className?: string;
}>;

const ADDED_FEEDBACK_DURATION_MS = 1300;

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
      className={className}
      onClick={handleClick}
    >
      {isAdded ? <CheckIcon /> : <PlusIcon />}
      <span>{isAdded ? addedLabel : addLabel}</span>
    </button>
  );
}
