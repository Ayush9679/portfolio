/**
 * Centralized API client for Frontend ↔ FastAPI communication.
 * Base URL is read from VITE_API_URL environment variable with fallback to http://localhost:8000.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface MessagePayload {
  sender: string;
  channel: string;
  payload: string;
}

export interface ContactLegacyPayload {
  name: string;
  email: string;
  message: string;
}

export interface MessageRecord {
  id: number;
  sender: string;
  channel: string;
  payload: string;
  status: string;
  read: boolean;
  ip_address: string | null;
  created_at: string;
  // Legacy aliases
  name?: string;
  email?: string;
  message?: string;
  is_read?: boolean;
}

export interface SingleMessageResponse {
  success: boolean;
  message: string;
  data: MessageRecord;
}

export interface MessageListResponse {
  success: boolean;
  data: MessageRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface DatabaseStats {
  type: string;
  status: string;
  records: number;
}

export interface StatsResponse {
  success: boolean;
  messages: number;
  total_messages: number;
  unread_messages: number;
  read_messages: number;
  recent_messages: number;
  projects: number;
  skills: number;
  experience: number;
  database: DatabaseStats;
  api: string;
}

export interface HealthResponse {
  status: string;
  api: string;
  database: string;
  version: string;
  uptime_seconds: number;
  records: number;
  message_count?: number;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// ── Core Fetch Wrapper with Descriptive Error Handling ─────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => null);
      let detailMsg = `HTTP Error ${res.status}`;

      if (errorJson && errorJson.detail) {
        if (typeof errorJson.detail === 'string') {
          detailMsg = errorJson.detail;
        } else if (Array.isArray(errorJson.detail)) {
          // Pydantic validation errors array
          detailMsg = errorJson.detail
            .map((err: { msg?: string; loc?: string[] }) => err.msg || 'Validation failed')
            .join('; ');
        }
      }

      if (res.status === 401) {
        throw new Error(detailMsg || 'Invalid credentials or expired session.');
      } else if (res.status === 422) {
        throw new Error(detailMsg || 'Validation error: Please verify all required fields.');
      } else if (res.status === 404) {
        throw new Error(detailMsg || 'Requested resource not found.');
      } else if (res.status >= 500) {
        throw new Error(detailMsg || 'Server error occurred while storing transmission.');
      }

      throw new Error(detailMsg);
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return await res.json();
  } catch (err: unknown) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error(
        `API Connection Lost: Unable to reach FastAPI backend at ${API_BASE_URL}. Ensure the server is running on port 8000.`
      );
    }
    throw err;
  }
}

// ── Public API Methods ─────────────────────────────────────────────────────────

export const api = {
  /** Check system & SQLite health */
  health: (): Promise<HealthResponse> =>
    apiFetch<HealthResponse>('/api/health'),

  /** Submit message using standard sender / channel / payload schema */
  sendMessage: (payload: MessagePayload): Promise<SingleMessageResponse> =>
    apiFetch<SingleMessageResponse>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  /** Legacy contact alias */
  contact: (payload: ContactLegacyPayload | MessagePayload): Promise<SingleMessageResponse> =>
    apiFetch<SingleMessageResponse>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// ── Admin API Methods ──────────────────────────────────────────────────────────

export const adminApi = {
  /** Login with username and password */
  login: (username: string, password: string): Promise<TokenResponse> =>
    apiFetch<TokenResponse>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  /** Get telemetry and SQLite database statistics */
  getStats: (token: string): Promise<StatsResponse> =>
    apiFetch<StatsResponse>('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Alias for backward compatibility
  stats: (token: string): Promise<StatsResponse> =>
    apiFetch<StatsResponse>('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  /** Retrieve paginated messages */
  getMessages: (
    token: string,
    page: number = 1,
    limit: number = 20,
    search?: string,
    read?: boolean
  ): Promise<MessageListResponse> => {
    const params = new URLSearchParams();
    params.append('page', String(page));
    params.append('limit', String(limit));
    if (search) params.append('search', search);
    if (read !== undefined) params.append('read', String(read));

    return apiFetch<MessageListResponse>(`/api/messages?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  /** Alias returning all messages array */
  messages: async (token: string): Promise<MessageRecord[]> => {
    const res = await apiFetch<MessageListResponse>('/api/messages?limit=100', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  /** Get single message by ID */
  getMessage: (token: string, id: number): Promise<SingleMessageResponse> =>
    apiFetch<SingleMessageResponse>(`/api/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  /** Update message read state or workflow status */
  updateMessage: (
    token: string,
    id: number,
    updateData: { read?: boolean; status?: string }
  ): Promise<SingleMessageResponse> =>
    apiFetch<SingleMessageResponse>(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(updateData),
    }),

  /** Toggle read status alias */
  markRead: async (token: string, id: number, read: boolean): Promise<MessageRecord> => {
    const res = await apiFetch<SingleMessageResponse>(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ read }),
    });
    return res.data;
  },

  /** Permanently delete message from SQLite */
  deleteMessage: (token: string, id: number): Promise<void> =>
    apiFetch<void>(`/api/messages/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
};
