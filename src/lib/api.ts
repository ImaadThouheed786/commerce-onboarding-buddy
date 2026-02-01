const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

interface LoginRequest {
  user_id: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  business_id?: string;
  auth_metadata?: Record<string, unknown>;
  message?: string;
}

interface IngestRequest {
  url: string;
  business_id: string;
}

interface IngestResponse {
  upload_batch_id: string;
  products: number;
  status: string;
}

interface QueryRequest {
  business_id: string;
  query: string;
}

interface QueryResponse {
  response: string;
  sources?: string[];
}

export const api = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  async ingest(data: IngestRequest): Promise<IngestResponse> {
    const response = await fetch(`${API_BASE_URL}/ingest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Ingestion failed');
    }

    return response.json();
  },

  async query(data: QueryRequest): Promise<QueryResponse> {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Query failed');
    }

    return response.json();
  },
};
