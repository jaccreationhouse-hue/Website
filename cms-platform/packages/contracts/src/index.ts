export const CONTENT_STATUSES = ['draft', 'published', 'archived'] as const;

export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export interface RequestMeta {
  requestId: string;
}

export interface ApiEnvelope<T> {
  data: T;
  meta: RequestMeta;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: RequestMeta & {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface SiteContext {
  tenantId: string;
  siteId: string;
  siteKey: string;
}

export interface ContentBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface SeoMetadata {
  title: string;
  description?: string;
  canonicalUrl?: string;
  robots?: string;
  openGraph?: Record<string, unknown>;
  schema?: Record<string, unknown>;
}

export interface PageResponse {
  id: string;
  slug: string;
  title: string;
  status: ContentStatus;
  blocks: ContentBlock[];
  seo?: SeoMetadata;
  publishedAt?: string;
  updatedAt?: string;
}

export interface ServiceResponse {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline?: string;
  description: string;
  capabilities: string[];
  featured: boolean;
  status: ContentStatus;
  detail?: Record<string, unknown>;
}

export interface MenuItemResponse {
  id: string;
  label: string;
  linkType: 'internal' | 'external';
  target: string;
  children: MenuItemResponse[];
}

export interface MenuResponse {
  key: string;
  label: string;
  items: MenuItemResponse[];
}

export interface SiteSettingsResponse {
  siteKey: string;
  values: Record<string, unknown>;
}

export interface FormSubmissionRequest {
  idempotencyKey?: string;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  fields: Record<string, unknown>;
  source?: Record<string, unknown>;
  website?: string;
}

export interface LeadResponse {
  id: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export function createApiEnvelope<T>(data: T, requestId: string): ApiEnvelope<T> {
  return {
    data,
    meta: { requestId }
  };
}
