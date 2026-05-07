type MultimediaSlugInput = {
  id: string;
  title: string;
};

function toMultimediaSlugSegment(value: string): string {
  const normalized = value.normalize("NFKC").trim().replace(/\s+/g, " ");
  return encodeURIComponent(normalized);
}

function toMultimediaIdSegment(value: string): string {
  return value
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}_-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildMultimediaDetailSlug(media: MultimediaSlugInput): string {
  const titleSegment = toMultimediaSlugSegment(media.title) || "media";
  const idSegment = toMultimediaIdSegment(media.id) || "id";

  return `${titleSegment}-${idSegment}`;
}

export function normalizeMultimediaDetailSlug(value: string): string {
  try {
    return decodeURIComponent(value).trim().toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}
