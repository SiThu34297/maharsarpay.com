type AuthorSlugInput = {
  id: string;
  name: string;
};

function toAuthorSlugSegment(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

export function buildAuthorDetailSlug(author: AuthorSlugInput): string {
  const nameSegment = toAuthorSlugSegment(author.name) || "author";
  const idSegment = author.id.trim();

  return `${nameSegment}-${idSegment}`;
}

export function normalizeAuthorDetailSlug(value: string): string {
  try {
    return decodeURIComponent(value).trim().toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}
