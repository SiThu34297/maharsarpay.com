type MultimediaSlugInput = {
  id: string;
  title: string;
};

function toMultimediaSlugSegment(value: string): string {
  return value.trim().replace(/\s+/g, "");
}

export function buildMultimediaDetailSlug(media: MultimediaSlugInput): string {
  const titleSegment = toMultimediaSlugSegment(media.title) || "media";
  const idSegment = media.id.trim();

  return `${titleSegment}-${idSegment}`;
}

export function normalizeMultimediaDetailSlug(value: string): string {
  try {
    return decodeURIComponent(value).trim().toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}
