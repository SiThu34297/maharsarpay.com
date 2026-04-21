"use client";

import { AddToCartButton } from "@/features/cart";
import type { BookItem } from "@/features/home/schemas/home";

type HomeAddToCartButtonProps = Readonly<{
  book: BookItem;
  addLabel: string;
  addedLabel: string;
}>;

export function HomeAddToCartButton({ book, addLabel, addedLabel }: HomeAddToCartButtonProps) {
  return (
    <AddToCartButton
      item={{
        cartProductId: book.cartProductId,
        title: book.title,
        author: book.author,
        price: book.price,
        salePrice: book.salePrice,
        originalPrice: book.originalPrice,
        discountAmount: book.discountAmount,
        coverImageSrc: book.imageSrc,
        coverImageAlt: book.imageAlt,
      }}
      addLabel={addLabel}
      addedLabel={addedLabel}
      className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-button-secondary)] text-white transition hover:brightness-95"
    />
  );
}
