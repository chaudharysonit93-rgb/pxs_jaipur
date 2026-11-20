const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
    credentials: 'include' // Send httpOnly session cookies automatically
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data.error?.message || data.message || `Request failed with status ${res.status}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.code = data.error?.code;
      err.details = data.error?.details;
      throw err;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
      throw new Error('Unable to connect to PXS server. Please ensure the backend is running.');
    }
    throw err;
  }
}

export const api = {
  // Catalog
  getCategories: () => apiRequest('/categories'),
  getProducts: (params = '') => apiRequest(`/products${params}`),
  getProductBySlug: (slug) => apiRequest(`/products/${slug}`),

  // Auth
  signup: (body) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  getMe: () => apiRequest('/auth/me'),

  // Orders & Tracking
  createOrder: (body, idempotencyKey) =>
    apiRequest('/orders', {
      method: 'POST',
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
      body: JSON.stringify(body)
    }),
  getMyOrders: () => apiRequest('/orders/my-orders'),
  trackOrder: (orderNumber) => apiRequest(`/orders/track/${orderNumber}`),

  // Payments
  createRazorpayOrder: (orderId) =>
    apiRequest('/payments/razorpay/create-order', {
      method: 'POST',
      body: JSON.stringify({ orderId })
    }),
  verifyRazorpayPayment: (body) =>
    apiRequest('/payments/razorpay/verify', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  // Admin
  getAdminStats: () => apiRequest('/admin/stats'),
  getAdminOrders: (params = '') => apiRequest(`/admin/orders${params}`),
  updateOrderStatus: (id, status) =>
    apiRequest(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  getAdminInventory: () => apiRequest('/admin/inventory'),
  updateStock: (variantId, stock) =>
    apiRequest(`/admin/inventory/${variantId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock })
    })
};
