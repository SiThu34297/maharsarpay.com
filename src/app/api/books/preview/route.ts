import { NextRequest, NextResponse } from "next/server";

const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const DEFAULT_BOOK_PREVIEW_HOSTS = ["sabahnapublishers.sgp1.cdn.digitaloceanspaces.com"];

type AllowedPreviewHosts = {
  exactHosts: Set<string>;
  hostSuffixes: Set<string>;
};

function normalizeHost(value: string) {
  return value.trim().toLowerCase();
}

function getAllowedHosts(): AllowedPreviewHosts {
  const exactHosts = new Set<string>();
  const hostSuffixes = new Set<string>();

  try {
    exactHosts.add(new URL(BOOK_API_BASE_URL).hostname.toLowerCase());
  } catch {
    // Ignore malformed env values and rely on explicit allow list below.
  }

  DEFAULT_BOOK_PREVIEW_HOSTS.forEach((host) => {
    exactHosts.add(host.toLowerCase());
  });

  const rawExtraHosts = process.env.BOOK_PREVIEW_ALLOWED_HOSTS;

  if (!rawExtraHosts) {
    return { exactHosts, hostSuffixes };
  }

  rawExtraHosts
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
    .forEach((value) => {
      const normalized = normalizeHost(value);

      if (normalized.startsWith(".")) {
        hostSuffixes.add(normalized);
        return;
      }

      exactHosts.add(normalized);
    });

  return { exactHosts, hostSuffixes };
}

function isAllowedPreviewHost(hostname: string, allowList: AllowedPreviewHosts) {
  const normalizedHost = normalizeHost(hostname);

  if (allowList.exactHosts.has(normalizedHost)) {
    return true;
  }

  for (const suffix of allowList.hostSuffixes) {
    if (normalizedHost.endsWith(suffix)) {
      return true;
    }
  }

  return false;
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");

  if (!src) {
    return NextResponse.json({ message: "Missing src query parameter." }, { status: 400 });
  }

  let sourceUrl: URL;

  try {
    sourceUrl = new URL(src);
  } catch {
    return NextResponse.json({ message: "Invalid src URL." }, { status: 400 });
  }

  if (sourceUrl.protocol !== "http:" && sourceUrl.protocol !== "https:") {
    return NextResponse.json({ message: "Only HTTP(S) URLs are allowed." }, { status: 400 });
  }

  const allowedHosts = getAllowedHosts();

  if (!isAllowedPreviewHost(sourceUrl.hostname, allowedHosts)) {
    return NextResponse.json({ message: "Preview host is not allowed." }, { status: 400 });
  }

  const rangeHeader = request.headers.get("range");

  const upstreamResponse = await fetch(sourceUrl.toString(), {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/pdf,*/*",
      ...(rangeHeader ? { Range: rangeHeader } : {}),
    },
  });

  if (!upstreamResponse.ok && upstreamResponse.status !== 206) {
    return NextResponse.json(
      { message: "Failed to fetch preview from upstream." },
      { status: upstreamResponse.status },
    );
  }

  const responseHeaders = new Headers();
  const passThroughHeaderNames = [
    "content-type",
    "content-length",
    "accept-ranges",
    "content-range",
    "etag",
    "last-modified",
    "cache-control",
  ];

  for (const headerName of passThroughHeaderNames) {
    const value = upstreamResponse.headers.get(headerName);

    if (value) {
      responseHeaders.set(headerName, value);
    }
  }

  if (!responseHeaders.has("content-type")) {
    responseHeaders.set("content-type", "application/pdf");
  }

  responseHeaders.set("content-disposition", 'inline; filename="preview.pdf"');

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}
