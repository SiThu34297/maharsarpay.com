"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { MainLoadingScreen } from "@/components/ui/main-loading-screen";

function getNavigationDestinationKey(event: MouseEvent): string | null {
  if (event.defaultPrevented || event.button !== 0) {
    return null;
  }

  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return null;
  }

  if (!(event.target instanceof Element)) {
    return null;
  }

  const anchor = event.target.closest("a");

  if (!(anchor instanceof HTMLAnchorElement)) {
    return null;
  }

  if (anchor.target && anchor.target !== "_self") {
    return null;
  }

  if (anchor.hasAttribute("download") || anchor.getAttribute("href")?.startsWith("#")) {
    return null;
  }

  const href = anchor.getAttribute("href");

  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }

  let destination: URL;

  try {
    destination = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }

  if (destination.origin !== window.location.origin) {
    return null;
  }

  const current = new URL(window.location.href);
  const isSameLocation =
    destination.pathname === current.pathname && destination.search === current.search;

  if (isSameLocation) {
    return null;
  }

  return `${destination.pathname}${destination.search}`;
}

export function NavigationLoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);
  const safetyTimeoutRef = useRef<number | null>(null);

  const routeKey = useMemo(() => {
    const currentPath = pathname ?? "";
    const queryString = searchParams?.toString() ?? "";

    return queryString ? `${currentPath}?${queryString}` : currentPath;
  }, [pathname, searchParams]);

  const isNavigating = Boolean(pendingDestination && pendingDestination !== routeKey);

  useEffect(() => {
    const onClickCapture = (event: MouseEvent) => {
      const destinationKey = getNavigationDestinationKey(event);

      if (!destinationKey) {
        return;
      }

      setPendingDestination(destinationKey);

      if (safetyTimeoutRef.current) {
        window.clearTimeout(safetyTimeoutRef.current);
      }

      safetyTimeoutRef.current = window.setTimeout(() => {
        setPendingDestination(null);
      }, 10000);
    };

    window.addEventListener("click", onClickCapture, true);

    return () => {
      window.removeEventListener("click", onClickCapture, true);

      if (safetyTimeoutRef.current) {
        window.clearTimeout(safetyTimeoutRef.current);
      }
    };
  }, []);

  if (!isNavigating) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <MainLoadingScreen variant="navigation" />
    </div>
  );
}
