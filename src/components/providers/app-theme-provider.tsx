"use client";

import { Theme } from "@radix-ui/themes";

type AppThemeProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <Theme accentColor="grass" grayColor="slate" radius="large" scaling="100%">
      {children}
    </Theme>
  );
}
