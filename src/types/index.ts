export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  level: 'VIP' | 'A' | 'B' | 'C';
  source: string;
  industry: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Contract {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  amount: number;
  status: 'draft' | 'pending' | 'signed' | 'completed' | 'cancelled';
  signedAt?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  unit: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplierName: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  createdAt: string;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface SalesOrder {
  id: string;
  orderNo: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'shipped' | 'completed' | 'cancelled';
  items: SalesOrderItem[];
  createdAt: string;
}

export interface SalesOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Employee {
  id: string;
  name: string;
  employeeNo: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'resigned';
  hireDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'policy' | 'event';
  publisher: string;
  isTop: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  revenueGrowth: number;
  customerGrowth: number;
  orderGrowth: number;
  productGrowth: number;
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  orderStatusDistribution: { name: string; value: number }[];
  topCustomers: { name: string; revenue: number }[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
