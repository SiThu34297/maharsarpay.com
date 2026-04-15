"use client";

import { Theme } from "@radix-ui/themes";

import { CartProvider } from "@/features/cart";

type AppThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <Theme accentColor="grass" grayColor="slate" radius="large" scaling="100%">
      <CartProvider>{children}</CartProvider>
    </Theme>
  );
}
