const defaultApiBase = 'http://localhost:4000';

export class CmsHttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'CmsHttpError';
    this.status = status;
  }
}

export class CmsAuthenticationError extends Error {
  constructor(message = 'Sign in required') {
    super(message);
    this.name = 'CmsAuthenticationError';
  }
}

interface TokenStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): unknown;
  removeItem(key: string): unknown;
}

interface AuthenticatedFetchOptions {
  storage?: TokenStorage;
  fetchImpl?: typeof fetch;
  baseUrl?: string;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export function apiUrl(
  path: string,
  base = process.env.NEXT_PUBLIC_CMS_API_URL || defaultApiBase
): string {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export function createHeaders(token?: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function cmsFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
  fetchImpl: typeof fetch = fetch,
  baseUrl?: string
): Promise<T> {
  const response = await fetchImpl(apiUrl(path, baseUrl), {
    ...options,
    headers: {
      ...createHeaders(token),
      ...options.headers
    }
  });
  if (!response.ok) {
    const body = await response.text();
    const message = apiErrorMessage(body) || `CMS request failed with ${response.status}`;
    throw new CmsHttpError(message || `CMS request failed with ${response.status}`, response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

function apiErrorMessage(body: string): string {
  if (!body) return '';
  try {
    const parsed = JSON.parse(body) as { message?: unknown };
    if (typeof parsed.message === 'string') return parsed.message;
    if (Array.isArray(parsed.message)) return parsed.message.filter((item) => typeof item === 'string').join(', ');
  } catch {
    // Non-JSON API errors are already suitable for display.
  }
  return body;
}

export async function authenticatedCmsFetch<T>(
  path: string,
  options: RequestInit = {},
  authOptions: AuthenticatedFetchOptions = {}
): Promise<T> {
  const storage = authOptions.storage ?? globalThis.localStorage;
  const fetchImpl = authOptions.fetchImpl ?? fetch;
  const accessToken = storage.getItem('cmsAccessToken');
  if (!accessToken) throw new CmsAuthenticationError();

  try {
    return await cmsFetch<T>(path, options, accessToken, fetchImpl, authOptions.baseUrl);
  } catch (error) {
    if (!(error instanceof CmsHttpError) || error.status !== 401) throw error;
  }

  const refreshToken = storage.getItem('cmsRefreshToken');
  if (!refreshToken) {
    clearCmsSession(storage);
    throw new CmsAuthenticationError();
  }

  try {
    const tokens = await cmsFetch<Tokens>(
      '/v1/auth/refresh',
      { method: 'POST', body: JSON.stringify({ refreshToken }) },
      undefined,
      fetchImpl,
      authOptions.baseUrl
    );
    storage.setItem('cmsAccessToken', tokens.accessToken);
    storage.setItem('cmsRefreshToken', tokens.refreshToken);
    return await cmsFetch<T>(path, options, tokens.accessToken, fetchImpl, authOptions.baseUrl);
  } catch {
    clearCmsSession(storage);
    throw new CmsAuthenticationError('Your session expired. Please sign in again.');
  }
}

export async function authenticatedCmsDownload(
  path: string,
  authOptions: AuthenticatedFetchOptions = {}
): Promise<{ blob: Blob; fileName: string }> {
  const storage = authOptions.storage ?? globalThis.localStorage;
  const fetchImpl = authOptions.fetchImpl ?? fetch;
  const accessToken = storage.getItem('cmsAccessToken');
  if (!accessToken) throw new CmsAuthenticationError();

  const response = await fetchImpl(apiUrl(path, authOptions.baseUrl), {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (response.status === 401) {
    clearCmsSession(storage);
    throw new CmsAuthenticationError('Your session expired. Please sign in again.');
  }
  if (!response.ok) throw new CmsHttpError(`Download failed with ${response.status}`, response.status);
  const disposition = response.headers.get('content-disposition') ?? '';
  const fileName = disposition.match(/filename="([^"]+)"/)?.[1] ?? 'resume';
  return { blob: await response.blob(), fileName };
}

export function clearCmsSession(storage: TokenStorage = globalThis.localStorage): void {
  storage.removeItem('cmsAccessToken');
  storage.removeItem('cmsRefreshToken');
}

export function redirectToCmsLogin(): void {
  globalThis.location.assign('/login');
}

export const cmsSiteId =
  process.env.NEXT_PUBLIC_CMS_SITE_ID || 'site-jac-media-land';
export const cmsSiteKey = process.env.NEXT_PUBLIC_CMS_SITE_KEY || 'jac-media-land';
