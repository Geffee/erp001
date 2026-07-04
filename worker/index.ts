/**
 * CloudERP - Cloudflare Workers API
 * 部署到 Cloudflare Workers，绑定 D1 数据库
 */

export interface Env {
  DB: D1Database;
}

// ── JWT 工具函数 ──
const JWT_SECRET = 'clouderp-jwt-secret-2025';

async function generateToken(payload: Record<string, unknown>): Promise<string> {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = btoa(JSON.stringify(header));
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + 86400 * 7 };
  const bodyB64 = btoa(JSON.stringify(body));
  const key = await crypto.subtle.importKey('raw', encoder.encode(JWT_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(`${headerB64}.${bodyB64}`));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${headerB64}.${bodyB64}.${sigB64}`;
}

async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const body = JSON.parse(atob(parts[1]));
    if (body.exp < Math.floor(Date.now() / 1000)) return null;
    return body;
  } catch {
    return null;
  }
}

// ── 密码哈希 (SHA-256 简化版，生产环境应用 bcrypt) ──
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'clouderp-salt');
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── UUID 生成 ──
function uuid(): string {
  return crypto.randomUUID();
}

// ── JSON 响应 ──
function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  });
}

// ── 路由 ──
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
      });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // ── 认证 ──
    const authHeader = request.headers.get('Authorization');
    let currentUser: Record<string, unknown> | null = null;
    if (authHeader?.startsWith('Bearer ')) {
      currentUser = await verifyToken(authHeader.slice(7));
    }

    // 不需要认证的路由
    const publicPaths = ['/api/auth/login', '/api/auth/init'];
    if (!publicPaths.includes(path) && !currentUser) {
      return json({ error: '未登录或登录已过期' }, 401);
    }

    try {
      // ── 认证 ──
      if (path === '/api/auth/login' && method === 'POST') {
        return handleLogin(request, env);
      }
      if (path === '/api/auth/me' && method === 'GET') {
        return handleMe(currentUser!, env);
      }
      if (path === '/api/auth/init' && method === 'POST') {
        return handleInit(env);
      }

      // ── 仪表盘 ──
      if (path === '/api/dashboard' && method === 'GET') {
        return handleDashboard(env);
      }

      // ── 客户 CRUD ──
      if (path === '/api/customers' && method === 'GET') return handleList(env, 'customers', url);
      if (path === '/api/customers' && method === 'POST') return handleCreate(request, env, 'customers');
      if (path.startsWith('/api/customers/') && method === 'PUT') return handleUpdate(request, env, 'customers', path.split('/')[3]);
      if (path.startsWith('/api/customers/') && method === 'DELETE') return handleDelete(env, 'customers', path.split('/')[3]);

      // ── 合同 CRUD ──
      if (path === '/api/contracts' && method === 'GET') return handleList(env, 'contracts', url);
      if (path === '/api/contracts' && method === 'POST') return handleCreate(request, env, 'contracts');
      if (path.startsWith('/api/contracts/') && method === 'PUT') return handleUpdate(request, env, 'contracts', path.split('/')[3]);
      if (path.startsWith('/api/contracts/') && method === 'DELETE') return handleDelete(env, 'contracts', path.split('/')[3]);

      // ── 产品 CRUD ──
      if (path === '/api/products' && method === 'GET') return handleList(env, 'products', url);
      if (path === '/api/products' && method === 'POST') return handleCreate(request, env, 'products');
      if (path.startsWith('/api/products/') && method === 'PUT') return handleUpdate(request, env, 'products', path.split('/')[3]);
      if (path.startsWith('/api/products/') && method === 'DELETE') return handleDelete(env, 'products', path.split('/')[3]);

      // ── 采购订单 ──
      if (path === '/api/purchase-orders' && method === 'GET') return handlePurchaseList(env, url);
      if (path === '/api/purchase-orders' && method === 'POST') return handlePurchaseCreate(request, env);
      if (path.startsWith('/api/purchase-orders/') && method === 'PUT') return handlePurchaseUpdate(request, env, path.split('/')[3]);
      if (path.startsWith('/api/purchase-orders/') && method === 'DELETE') return handleDelete(env, 'purchase_orders', path.split('/')[3]);

      // ── 销售订单 ──
      if (path === '/api/sales-orders' && method === 'GET') return handleSalesList(env, url);
      if (path === '/api/sales-orders' && method === 'POST') return handleSalesCreate(request, env);
      if (path.startsWith('/api/sales-orders/') && method === 'PUT') return handleSalesUpdate(request, env, path.split('/')[3]);
      if (path.startsWith('/api/sales-orders/') && method === 'DELETE') return handleDelete(env, 'sales_orders', path.split('/')[3]);

      // ── 员工 ──
      if (path === '/api/employees' && method === 'GET') return handleList(env, 'employees', url);
      if (path === '/api/employees' && method === 'POST') return handleCreate(request, env, 'employees');
      if (path.startsWith('/api/employees/') && method === 'PUT') return handleUpdate(request, env, 'employees', path.split('/')[3]);
      if (path.startsWith('/api/employees/') && method === 'DELETE') return handleDelete(env, 'employees', path.split('/')[3]);

      // ── 公告 ──
      if (path === '/api/announcements' && method === 'GET') return handleList(env, 'announcements', url);
      if (path === '/api/announcements' && method === 'POST') return handleCreate(request, env, 'announcements');
      if (path.startsWith('/api/announcements/') && method === 'PUT') return handleUpdate(request, env, 'announcements', path.split('/')[3]);
      if (path.startsWith('/api/announcements/') && method === 'DELETE') return handleDelete(env, 'announcements', path.split('/')[3]);

      // ── 用户管理 ──
      if (path === '/api/users' && method === 'GET') return handleList(env, 'users', url);
      if (path === '/api/users' && method === 'POST') return handleUserCreate(request, env);
      if (path.startsWith('/api/users/') && method === 'PUT') return handleUpdate(request, env, 'users', path.split('/')[3]);
      if (path.startsWith('/api/users/') && method === 'DELETE') return handleDelete(env, 'users', path.split('/')[3]);

      // ── 角色 ──
      if (path === '/api/roles' && method === 'GET') return handleList(env, 'roles', url);

      return json({ error: 'Not Found' }, 404);
    } catch (e: any) {
      return json({ error: e.message }, 500);
    }
  },
};

// ── Handler 函数 ──

async function handleInit(env: Env): Promise<Response> {
  // 检查是否已有管理员
  const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind('admin').first();
  if (existing) return json({ message: '已初始化' });

  const hash = await hashPassword('admin123');
  await env.DB.prepare(
    'INSERT INTO users (id, username, name, email, password_hash, role_id, department, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(uuid(), 'admin', '系统管理员', 'admin@clouderp.com', hash, 'r1', '技术部', 'active').run();

  await env.DB.prepare(
    'INSERT INTO roles (id, name, code, description, permissions) VALUES (?, ?, ?, ?, ?)'
  ).bind('r1', '超级管理员', 'admin', '拥有系统全部权限', '["全部权限"]').run();

  await env.DB.prepare(
    'INSERT INTO roles (id, name, code, description, permissions) VALUES (?, ?, ?, ?, ?)'
  ).bind('r2', '普通用户', 'user', '基础操作权限', '["OA公告查看","个人设置"]').run();

  return json({ message: '初始化成功' });
}

async function handleLogin(request: Request, env: Env): Promise<Response> {
  const { username, password } = await request.json() as { username: string; password: string };
  if (!username || !password) return json({ error: '用户名和密码不能为空' }, 400);

  const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!user) return json({ error: '用户名或密码错误' }, 401);

  const hash = await hashPassword(password);
  if ((user as any).password_hash !== hash) return json({ error: '用户名或密码错误' }, 401);

  if ((user as any).status !== 'active') return json({ error: '账号已被禁用' }, 403);

  const token = await generateToken({ id: (user as any).id, username: (user as any).username });
  return json({
    token,
    user: {
      id: (user as any).id,
      username: (user as any).username,
      name: (user as any).name,
      email: (user as any).email,
      role: (user as any).role_id,
      department: (user as any).department,
      status: (user as any).status,
    },
  });
}

async function handleMe(user: Record<string, unknown>, env: Env): Promise<Response> {
  const row = await env.DB.prepare('SELECT id, username, name, email, role_id, department, status, created_at FROM users WHERE id = ?').bind(user.id as string).first();
  if (!row) return json({ error: '用户不存在' }, 404);
  const u = row as any;
  return json({ user: { id: u.id, username: u.username, name: u.name, email: u.email, role: u.role_id, department: u.department, status: u.status, createdAt: u.created_at } });
}

async function handleDashboard(env: Env): Promise<Response> {
  const customerCount = (await env.DB.prepare('SELECT COUNT(*) as c FROM customers').first() as any).c;
  const productCount = (await env.DB.prepare('SELECT COUNT(*) as c FROM products WHERE status = ?').bind('active').first() as any).c;
  const salesTotal = (await env.DB.prepare('SELECT COALESCE(SUM(total_amount), 0) as t FROM sales_orders WHERE status = ?').bind('completed').first() as any).t;
  const purchaseTotal = (await env.DB.prepare('SELECT COALESCE(SUM(total_amount), 0) as t FROM purchase_orders WHERE status = ?').bind('received').first() as any).t;
  const employeeCount = (await env.DB.prepare('SELECT COUNT(*) as c FROM employees WHERE status = ?').bind('active').first() as any).c;

  // 月度营收趋势
  const monthlyRevenue = await env.DB.prepare(
    `SELECT substr(created_at, 1, 7) as month, SUM(total_amount) as amount FROM sales_orders WHERE status = 'completed' GROUP BY month ORDER BY month DESC LIMIT 12`
  ).all();

  // 订单状态分布
  const orderStatus = await env.DB.prepare(
    `SELECT status, COUNT(*) as count FROM sales_orders GROUP BY status`
  ).all();

  // 公告列表
  const announcements = await env.DB.prepare(
    'SELECT * FROM announcements ORDER BY is_top DESC, created_at DESC LIMIT 5'
  ).all();

  return json({
    customerCount, productCount, salesTotal, purchaseTotal, employeeCount,
    monthlyRevenue: monthlyRevenue.results,
    orderStatus: orderStatus.results,
    announcements: announcements.results,
  });
}

// 通用列表
async function handleList(env: Env, table: string, url: URL): Promise<Response> {
  const search = url.searchParams.get('search') || '';
  let query = `SELECT * FROM ${table}`;
  const params: string[] = [];

  if (search && table === 'customers') { query += ' WHERE name LIKE ? OR company LIKE ?'; params.push(`%${search}%`, `%${search}%`); }
  else if (search && table === 'products') { query += ' WHERE name LIKE ? OR code LIKE ?'; params.push(`%${search}%`, `%${search}%`); }
  else if (search && table === 'employees') { query += ' WHERE name LIKE ? OR employee_no LIKE ?'; params.push(`%${search}%`, `%${search}%`); }
  else if (search) { query += ' WHERE name LIKE ?'; params.push(`%${search}%`); }

  query += ' ORDER BY created_at DESC LIMIT 200';
  const stmt = env.DB.prepare(query);
  for (const p of params) stmt.bind(p);
  const result = await stmt.all();
  return json(result.results);
}

// 通用创建
async function handleCreate(request: Request, env: Env, table: string): Promise<Response> {
  const body = await request.json() as Record<string, any>;
  const id = uuid();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const columns = ['id'];
  const values = [id];
  const placeholders = ['?'];

  for (const [key, value] of Object.entries(body)) {
    if (value !== undefined && key !== 'id') {
      columns.push(key);
      values.push(value);
      placeholders.push('?');
    }
  }

  if (!columns.includes('created_at')) { columns.push('created_at'); values.push(now); placeholders.push('?'); }
  if (!columns.includes('updated_at')) { columns.push('updated_at'); values.push(now); placeholders.push('?'); }

  const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')})`;
  await env.DB.prepare(sql).bind(...values).run();

  const result = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first();
  return json(result, 201);
}

// 通用更新
async function handleUpdate(request: Request, env: Env, table: string, id: string): Promise<Response> {
  const body = await request.json() as Record<string, any>;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const sets: string[] = [];
  const values: any[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (value !== undefined && key !== 'id') {
      sets.push(`${key} = ?`);
      values.push(value);
    }
  }

  sets.push('updated_at = ?');
  values.push(now);
  values.push(id);

  await env.DB.prepare(`UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`).bind(...values).run();

  const result = await env.DB.prepare(`SELECT * FROM ${table} WHERE id = ?`).bind(id).first();
  return json(result);
}

// 通用删除
async function handleDelete(env: Env, table: string, id: string): Promise<Response> {
  await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
  return json({ success: true });
}

// 采购订单列表（含明细）
async function handlePurchaseList(env: Env, url: URL): Promise<Response> {
  const search = url.searchParams.get('search') || '';
  let query = 'SELECT * FROM purchase_orders';
  if (search) { query += ' WHERE supplier_name LIKE ? OR order_no LIKE ?'; }
  query += ' ORDER BY created_at DESC LIMIT 200';

  let result;
  if (search) {
    result = await env.DB.prepare(query).bind(`%${search}%`, `%${search}%`).all();
  } else {
    result = await env.DB.prepare(query).all();
  }

  const orders = await Promise.all(result.results.map(async (order: any) => {
    const items = await env.DB.prepare('SELECT * FROM purchase_order_items WHERE order_id = ?').bind(order.id).all();
    return { ...order, items: items.results };
  }));

  return json(orders);
}

// 采购订单创建
async function handlePurchaseCreate(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { supplierName: string; totalAmount: number; status: string; items: { productId: string; productName: string; quantity: number; price: number }[] };
  const id = uuid();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const orderNo = 'PO-' + Date.now();

  await env.DB.prepare(
    'INSERT INTO purchase_orders (id, order_no, supplier_name, total_amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, orderNo, body.supplierName, body.totalAmount, body.status || 'draft', now, now).run();

  for (const item of body.items) {
    await env.DB.prepare(
      'INSERT INTO purchase_order_items (id, order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(uuid(), id, item.productId, item.productName, item.quantity, item.price).run();
  }

  const order = await env.DB.prepare('SELECT * FROM purchase_orders WHERE id = ?').bind(id).first();
  const items = await env.DB.prepare('SELECT * FROM purchase_order_items WHERE order_id = ?').bind(id).all();
  return json({ ...order as any, items: items.results }, 201);
}

// 采购订单更新
async function handlePurchaseUpdate(request: Request, env: Env, id: string): Promise<Response> {
  const body = await request.json() as any;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await env.DB.prepare(
    'UPDATE purchase_orders SET status = ?, total_amount = ?, updated_at = ? WHERE id = ?'
  ).bind(body.status, body.totalAmount, now, id).run();

  // 更新明细
  if (body.items) {
    await env.DB.prepare('DELETE FROM purchase_order_items WHERE order_id = ?').bind(id).run();
    for (const item of body.items) {
      await env.DB.prepare(
        'INSERT INTO purchase_order_items (id, order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(uuid(), id, item.productId, item.productName, item.quantity, item.price).run();
    }

    // 如果状态是 received，更新库存
    if (body.status === 'received') {
      for (const item of body.items) {
        await env.DB.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').bind(item.quantity, item.productId).run();
      }
    }
  }

  const order = await env.DB.prepare('SELECT * FROM purchase_orders WHERE id = ?').bind(id).first();
  const items = await env.DB.prepare('SELECT * FROM purchase_order_items WHERE order_id = ?').bind(id).all();
  return json({ ...order as any, items: items.results });
}

// 销售订单列表
async function handleSalesList(env: Env, url: URL): Promise<Response> {
  const search = url.searchParams.get('search') || '';
  let query = 'SELECT so.*, c.name as customer_name FROM sales_orders so LEFT JOIN customers c ON so.customer_id = c.id';
  if (search) { query += ' WHERE c.name LIKE ? OR so.order_no LIKE ?'; }
  query += ' ORDER BY so.created_at DESC LIMIT 200';

  let result;
  if (search) {
    result = await env.DB.prepare(query).bind(`%${search}%`, `%${search}%`).all();
  } else {
    result = await env.DB.prepare(query).all();
  }

  const orders = await Promise.all(result.results.map(async (order: any) => {
    const items = await env.DB.prepare('SELECT * FROM sales_order_items WHERE order_id = ?').bind(order.id).all();
    return { ...order, items: items.results };
  }));

  return json(orders);
}

// 销售订单创建
async function handleSalesCreate(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { customerId: string; totalAmount: number; status: string; items: { productId: string; productName: string; quantity: number; price: number }[] };
  const id = uuid();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const orderNo = 'SO-' + Date.now();

  await env.DB.prepare(
    'INSERT INTO sales_orders (id, order_no, customer_id, total_amount, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, orderNo, body.customerId, body.totalAmount, body.status || 'draft', now, now).run();

  for (const item of body.items) {
    await env.DB.prepare(
      'INSERT INTO sales_order_items (id, order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(uuid(), id, item.productId, item.productName, item.quantity, item.price).run();
  }

  const order = await env.DB.prepare('SELECT so.*, c.name as customer_name FROM sales_orders so LEFT JOIN customers c ON so.customer_id = c.id WHERE so.id = ?').bind(id).first();
  const items = await env.DB.prepare('SELECT * FROM sales_order_items WHERE order_id = ?').bind(id).all();
  return json({ ...order as any, items: items.results }, 201);
}

// 销售订单更新
async function handleSalesUpdate(request: Request, env: Env, id: string): Promise<Response> {
  const body = await request.json() as any;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await env.DB.prepare(
    'UPDATE sales_orders SET status = ?, total_amount = ?, updated_at = ? WHERE id = ?'
  ).bind(body.status, body.totalAmount, now, id).run();

  if (body.items) {
    await env.DB.prepare('DELETE FROM sales_order_items WHERE order_id = ?').bind(id).run();
    for (const item of body.items) {
      await env.DB.prepare(
        'INSERT INTO sales_order_items (id, order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(uuid(), id, item.productId, item.productName, item.quantity, item.price).run();
    }

    // 如果状态是 shipped，扣减库存
    if (body.status === 'shipped') {
      for (const item of body.items) {
        await env.DB.prepare('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?').bind(item.quantity, item.productId, item.quantity).run();
      }
    }
  }

  const order = await env.DB.prepare('SELECT so.*, c.name as customer_name FROM sales_orders so LEFT JOIN customers c ON so.customer_id = c.id WHERE so.id = ?').bind(id).first();
  const items = await env.DB.prepare('SELECT * FROM sales_order_items WHERE order_id = ?').bind(id).all();
  return json({ ...order as any, items: items.results });
}

// 用户创建
async function handleUserCreate(request: Request, env: Env): Promise<Response> {
  const body = await request.json() as { username: string; name: string; email: string; password: string; role_id: string; department: string };
  const id = uuid();
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const hash = await hashPassword(body.password || '123456');

  await env.DB.prepare(
    'INSERT INTO users (id, username, name, email, password_hash, role_id, department, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, body.username, body.name, body.email, hash, body.role_id, body.department, 'active', now, now).run();

  const result = await env.DB.prepare('SELECT id, username, name, email, role_id, department, status, created_at FROM users WHERE id = ?').bind(id).first();
  return json(result, 201);
}
