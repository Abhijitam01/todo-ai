// ===========================================
// API Response Utilities
// ===========================================

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    timestamp: string;
    version: string;
    [key: string]: unknown;
  };
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  meta: {
    timestamp: string;
    version: string;
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Create a standardized success response
 */
export function createResponse<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
      ...meta,
    },
  };
}

/**
 * Create a paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    data,
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1',
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

