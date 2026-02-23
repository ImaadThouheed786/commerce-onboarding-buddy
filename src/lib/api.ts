// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.example.com';

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

interface OrdersRequest {
  business_id: string;
}

interface OrdersResponse {
  business_id: string;
  count: number;
  orders: any[];
}

interface UpdateOrderStatusRequest {
  business_id: string;
  order_id: string;
}

interface UpdateOrderStatusResponse {
  success: boolean;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    // Mock API call
    await delay(1000);
    
    // Simulate successful login with mock business_id
    console.log('Mock login:', data.user_id);
    return {
      success: true,
      business_id: 'mock-business-123',
      auth_metadata: { role: 'admin' },
    };

    /* Real API call (commented out)
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
    */
  },

  async ingest(data: IngestRequest): Promise<IngestResponse> {
    // Mock API call
    await delay(2000);
    
    console.log('Mock ingest:', data.url);
    return {
      upload_batch_id: 'mock-batch-' + Date.now(),
      products: 44,
      status: 'ready',
    };

    /* Real API call (commented out)
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
    */
  },

  async query(data: QueryRequest): Promise<QueryResponse> {
    // Mock API call
    await delay(1500);
    
    console.log('Mock query:', data.query);
    
    // Mock responses based on query
    const mockResponses: Record<string, string> = {
      'What products do you have?': 
        "We have a wide range of products including:\n\n• Premium T-shirts ($29.99)\n• Hoodies ($59.99)\n• Sneakers ($89.99)\n• Accessories starting at $14.99\n\nWould you like details on any specific category?",
      'What are your best sellers?': 
        "Our top 3 best sellers this month are:\n\n1. 🏆 Classic Black Hoodie - $59.99\n2. 🥈 Vintage Logo Tee - $29.99\n3. 🥉 Canvas Sneakers - $89.99\n\nAll items are in stock and ready to ship!",
      'Tell me about shipping': 
        "We offer several shipping options:\n\n• Standard (5-7 days): Free on orders over $50\n• Express (2-3 days): $9.99\n• Next Day: $19.99\n\nAll orders include tracking and insurance.",
    };

    const response = mockResponses[data.query] || 
      `Thanks for asking about "${data.query}"! I'm your AI sales assistant and I'm here to help you find the perfect products. We have a great selection available. What specifically are you looking for?`;

    return {
      response,
      sources: ['Product Catalog', 'FAQ'],
    };

    /* Real API call (commented out)
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
    */
  },

  async getOrders(data: OrdersRequest): Promise<OrdersResponse> {
    await delay(1000);

    console.log('Mock getOrders:', data.business_id);
    return {
      business_id: data.business_id,
      count: 1,
      orders: [
        {
          business_id: data.business_id,
          thread_id: '785862166',
          payment_id: '699bfed713ce3dd51f2fc2ad',
          cart_snapshot: {
            thread_id: '785862166',
            business_id: data.business_id,
            items: [
              {
                product_ref: {
                  source_chunk_id: 'product:ae24d3de-af23-4be2-9dcc-8609e6cbf498:1',
                  source_file_id: 'https://amfacosmetics.com/pages/about-us',
                },
                name: 'Face Cleansing Foam (with Brush)',
                unit_price_text: '15.0',
                unit_price_amount: 15.0,
                unit_price_currency: 'USDC',
                qty: 1,
                suggested_asset_ids: [],
                line_total_amount: 15.0,
              },
            ],
            summary: {
              item_count: 1,
              subtotal_amount: 15.0,
              currency: 'USDC',
            },
            updated_at: '2026-02-23T07:16:36.837000',
          },
          email: 'thouheed.imaad@gmail.com',
          address: 'Hollystown, Co. Dublin, D15 E7YN, Ireland',
          country: 'Ireland',
          amount: '15.0',
          currency: null,
          status: 'pending',
          created_at: '2026-02-23T07:17:22.177000',
          updated_at: '2026-02-23T07:17:22.177000',
        },
      ],
    };
  },

  async updateOrderStatus(data: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
    await delay(800);

    console.log('Mock updateOrderStatus:', data.order_id);
    return { success: true };
  },
};
