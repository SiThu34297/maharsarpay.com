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
      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-brand)] px-4 py-2.5 text-xs font-semibold text-white transition hover:brightness-95 sm:text-sm"
    />
  );
}
