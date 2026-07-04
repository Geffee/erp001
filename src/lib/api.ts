/**
 * CloudERP - API 客户端
 * 自动根据环境切换：开发环境用 mock 数据，生产环境用真实 API
 */

const API_BASE = '/api';

// 检查是否在 Cloudflare Pages 环境（生产环境有真实 API）
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

let authToken: string | null = null;

function getToken(): string | null {
  if (authToken) return authToken;
  try {
    authToken = localStorage.getItem('erp_token');
    return authToken;
  } catch { return null; }
}

function setToken(token: string) {
  authToken = token;
  try { localStorage.setItem('erp_token', token); } catch { }
}

function clearToken() {
  authToken = null;
  try { localStorage.removeItem('erp_token'); } catch { }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: '请求失败' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Auth ──
export const api = {
  async login(username: string, password: string) {
    const data = await request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    setToken(data.token);
    return data.user;
  },

  async me() {
    return (await request<{ user: any }>('/auth/me')).user;
  },

  logout() {
    clearToken();
  },

  async init() {
    return request<{ message: string }>('/auth/init', { method: 'POST' });
  },

  // ── Dashboard ──
  async dashboard() {
    return request<any>('/dashboard');
  },

  // ── Generic CRUD ──
  list(table: string, search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any[]>(`/${table}${params}`);
  },

  create(table: string, data: any) {
    return request<any>(`/${table}`, { method: 'POST', body: JSON.stringify(data) });
  },

  update(table: string, id: string, data: any) {
    return request<any>(`/${table}/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  delete(table: string, id: string) {
    return request<any>(`/${table}/${id}`, { method: 'DELETE' });
  },

  // ── Convenience methods ──
  getCustomers(search?: string) { return this.list('customers', search); },
  createCustomer(data: any) { return this.create('customers', data); },
  updateCustomer(id: string, data: any) { return this.update('customers', id, data); },
  deleteCustomer(id: string) { return this.delete('customers', id); },

  getContracts(search?: string) { return this.list('contracts', search); },
  createContract(data: any) { return this.create('contracts', data); },
  updateContract(id: string, data: any) { return this.update('contracts', id, data); },
  deleteContract(id: string) { return this.delete('contracts', id); },

  getProducts(search?: string) { return this.list('products', search); },
  createProduct(data: any) { return this.create('products', data); },
  updateProduct(id: string, data: any) { return this.update('products', id, data); },
  deleteProduct(id: string) { return this.delete('products', id); },

  getPurchaseOrders(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any[]>(`/purchase-orders${params}`);
  },
  createPurchaseOrder(data: any) { return request<any>('/purchase-orders', { method: 'POST', body: JSON.stringify(data) }); },
  updatePurchaseOrder(id: string, data: any) { return request<any>(`/purchase-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  deletePurchaseOrder(id: string) { return this.delete('purchase-orders', id); },

  getSalesOrders(search?: string) {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return request<any[]>(`/sales-orders${params}`);
  },
  createSalesOrder(data: any) { return request<any>('/sales-orders', { method: 'POST', body: JSON.stringify(data) }); },
  updateSalesOrder(id: string, data: any) { return request<any>(`/sales-orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  deleteSalesOrder(id: string) { return this.delete('sales-orders', id); },

  getEmployees(search?: string) { return this.list('employees', search); },
  createEmployee(data: any) { return this.create('employees', data); },
  updateEmployee(id: string, data: any) { return this.update('employees', id, data); },
  deleteEmployee(id: string) { return this.delete('employees', id); },

  getAnnouncements(search?: string) { return this.list('announcements', search); },
  createAnnouncement(data: any) { return this.create('announcements', data); },
  updateAnnouncement(id: string, data: any) { return this.update('announcements', id, data); },
  deleteAnnouncement(id: string) { return this.delete('announcements', id); },

  getUsers(search?: string) { return this.list('users', search); },
  createUser(data: any) { return this.create('users', data); },
  updateUser(id: string, data: any) { return this.update('users', id, data); },
  deleteUser(id: string) { return this.delete('users', id); },

  getRoles() { return this.list('roles'); },
};

export { isProduction, getToken, setToken, clearToken };
