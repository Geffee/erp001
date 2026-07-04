-- CloudERP D1 Database Schema
-- 用于 Cloudflare D1 (SQLite)

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  password_hash TEXT NOT NULL,
  avatar TEXT,
  role_id TEXT,
  department TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- 角色表
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  permissions TEXT, -- JSON array
  created_at TEXT DEFAULT (datetime('now'))
);

-- 客户表
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  email TEXT,
  level TEXT DEFAULT 'C' CHECK(level IN ('VIP', 'A', 'B', 'C')),
  source TEXT,
  industry TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 合同表
CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending', 'signed', 'completed', 'cancelled')),
  signed_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 产品表
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  category TEXT,
  unit TEXT,
  price REAL NOT NULL,
  cost REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 采购订单表
CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  order_no TEXT NOT NULL UNIQUE,
  supplier_name TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending', 'approved', 'received', 'cancelled')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 采购订单明细表
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES purchase_orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 销售订单表
CREATE TABLE IF NOT EXISTS sales_orders (
  id TEXT PRIMARY KEY,
  order_no TEXT NOT NULL UNIQUE,
  customer_id TEXT NOT NULL,
  total_amount REAL NOT NULL,
  status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'pending', 'shipped', 'completed', 'cancelled')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- 销售订单明细表
CREATE TABLE IF NOT EXISTS sales_order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES sales_orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 员工表
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  employee_no TEXT NOT NULL UNIQUE,
  department TEXT,
  position TEXT,
  phone TEXT,
  email TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'resigned')),
  hire_date TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- 公告表
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'notice' CHECK(type IN ('notice', 'policy', 'event')),
  publisher TEXT,
  is_top INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 插入默认管理员（密码: admin123，使用 bcrypt）
-- 实际使用时需要替换 password_hash
INSERT INTO roles (id, name, code, description, permissions) VALUES
  ('r1', '超级管理员', 'admin', '拥有系统全部权限', '["全部权限"]'),
  ('r2', '普通用户', 'user', '基础操作权限', '["OA公告查看","个人设置"]');
