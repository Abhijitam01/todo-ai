import { useAuthStore } from '@/stores/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const tokens = useAuthStore.getState().tokens;
    if (tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${tokens.accessToken}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      throw new Error(errorData.error?.message || 'An error occurred');
    }

    return data as ApiResponse<T>;
  }

  async get<T>(path: string, options?: { params?: Record<string, unknown> }): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}${path}`;
    
    if (options?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    // For 204 No Content responses
    if (response.status === 204) {
      return {
        success: true,
        data: null as T,
        meta: {
          requestId: '',
          timestamp: new Date().toISOString(),
        },
      };
    }

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_URL);

