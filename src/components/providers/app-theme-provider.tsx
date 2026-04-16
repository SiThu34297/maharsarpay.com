"use client";

import { Theme } from "@radix-ui/themes";

import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { CartProvider } from "@/features/cart";

type AppThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <Theme accentColor="grass" grayColor="slate" radius="large" scaling="100%">
      <AuthSessionProvider>
        <CartProvider>{children}</CartProvider>
      </AuthSessionProvider>
    </Theme>
  );
}
