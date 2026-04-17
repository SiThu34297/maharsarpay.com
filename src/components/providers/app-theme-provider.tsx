"use client";

import { Suspense } from "react";
import { Theme } from "@radix-ui/themes";

import { AuthSessionProvider } from "@/components/providers/auth-session-provider";
import { NavigationLoadingOverlay } from "@/components/providers/navigation-loading-overlay";
import { CartProvider } from "@/features/cart";

type AppThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <Theme accentColor="grass" grayColor="slate" radius="large" scaling="100%" appearance="light">
      <AuthSessionProvider>
        <CartProvider>
          <Suspense fallback={null}>
            <NavigationLoadingOverlay />
          </Suspense>
          {children}
        </CartProvider>
      </AuthSessionProvider>
    </Theme>
  );
}
