import "server-only";

const BOOK_API_BASE_URL = process.env.BOOK_API_BASE_URL ?? "https://bookapi.sabahna.com";
const PROVINCES_ENDPOINT = "/api/web/provinces";
const CITIES_ENDPOINT = "/api/web/cities";
const TOWNSHIPS_ENDPOINT = "/api/web/townships";

export type ProvinceOption = {
  id: string;
  name: string;
};

export type CityOption = {
  id: string;
  name: string;
  provinceId: string;
};

export type TownshipOption = {
  id: string;
  name: string;
  provinceId: string;
  cityId: string;
};

type BackendListResponse = {
  error?: unknown;
  authorized?: unknown;
  message?: unknown;
  data?: unknown;
};

type BackendProvinceRecord = {
  id?: unknown;
  name?: unknown;
  active?: unknown;
  deletedStatus?: unknown;
};

type BackendCityRecord = {
  id?: unknown;
  provinceId?: unknown;
  name?: unknown;
  active?: unknown;
  deletedStatus?: unknown;
};

type BackendTownshipRecord = {
  id?: unknown;
  provinceId?: unknown;
  cityId?: unknown;
  name?: unknown;
  active?: unknown;
  deletedStatus?: unknown;
};

function toOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function toFlag(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function isActiveRecord(active: unknown, deletedStatus: unknown): boolean {
  const activeFlag = toFlag(active);
  const deletedFlag = toFlag(deletedStatus);

  if (activeFlag !== null && activeFlag !== 1) {
    return false;
  }

  if (deletedFlag !== null && deletedFlag !== 0) {
    return false;
  }

  return true;
}

async function fetchBackendList(endpoint: string): Promise<unknown[]> {
  const response = await fetch(`${BOOK_API_BASE_URL}${endpoint}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Location API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as BackendListResponse;

  if (payload.error || payload.authorized === false) {
    throw new Error(
      typeof payload.message === "string" && payload.message.trim().length > 0
        ? payload.message
        : "Location API returned an error.",
    );
  }

  if (!Array.isArray(payload.data)) {
    throw new TypeError("Location API returned an invalid payload.");
  }

  return payload.data;
}

export async function fetchProvinces(): Promise<ProvinceOption[]> {
  const records = (await fetchBackendList(PROVINCES_ENDPOINT)) as BackendProvinceRecord[];

  return records
    .filter((record) => isActiveRecord(record.active, record.deletedStatus))
    .map((record) => {
      const id = toOptionalString(record.id);
      const name = toOptionalString(record.name);

      if (!id || !name) {
        return null;
      }

      return { id, name } satisfies ProvinceOption;
    })
    .filter((record): record is ProvinceOption => Boolean(record));
}

export async function fetchCities(provinceId?: string): Promise<CityOption[]> {
  const records = (await fetchBackendList(CITIES_ENDPOINT)) as BackendCityRecord[];
  const normalizedProvinceId = provinceId?.trim();

  return records
    .filter((record) => isActiveRecord(record.active, record.deletedStatus))
    .map((record) => {
      const id = toOptionalString(record.id);
      const name = toOptionalString(record.name);
      const recordProvinceId = toOptionalString(record.provinceId);

      if (!id || !name || !recordProvinceId) {
        return null;
      }

      if (normalizedProvinceId && recordProvinceId !== normalizedProvinceId) {
        return null;
      }

      return {
        id,
        name,
        provinceId: recordProvinceId,
      } satisfies CityOption;
    })
    .filter((record): record is CityOption => Boolean(record));
}

export async function fetchTownships(input?: {
  provinceId?: string;
  cityId?: string;
}): Promise<TownshipOption[]> {
  const records = (await fetchBackendList(TOWNSHIPS_ENDPOINT)) as BackendTownshipRecord[];
  const normalizedProvinceId = input?.provinceId?.trim();
  const normalizedCityId = input?.cityId?.trim();

  return records
    .filter((record) => isActiveRecord(record.active, record.deletedStatus))
    .map((record) => {
      const id = toOptionalString(record.id);
      const name = toOptionalString(record.name);
      const recordProvinceId = toOptionalString(record.provinceId);
      const recordCityId = toOptionalString(record.cityId);

      if (!id || !name || !recordProvinceId || !recordCityId) {
        return null;
      }

      if (normalizedProvinceId && recordProvinceId !== normalizedProvinceId) {
        return null;
      }

      if (normalizedCityId && recordCityId !== normalizedCityId) {
        return null;
      }

      return {
        id,
        name,
        provinceId: recordProvinceId,
        cityId: recordCityId,
      } satisfies TownshipOption;
    })
    .filter((record): record is TownshipOption => Boolean(record));
}
