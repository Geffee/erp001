import {
  User, Customer, Contract, Product, PurchaseOrder, PurchaseOrderItem,
  SalesOrder, SalesOrderItem, Employee, Announcement, DashboardStats,
} from '@/types';

export type { User, Customer, Contract, Product, PurchaseOrder, PurchaseOrderItem, SalesOrder, SalesOrderItem, Employee, Announcement, DashboardStats };

// ── Users ──
export const mockUsers: User[] = [
  { id: '1', username: 'admin', name: '系统管理员', email: 'admin@clouderp.com', role: '超级管理员', department: '技术部', status: 'active', createdAt: '2024-01-01' },
  { id: '2', username: 'zhangsan', name: '张三', email: 'zhangsan@clouderp.com', role: '销售经理', department: '销售部', status: 'active', createdAt: '2024-02-15' },
  { id: '3', username: 'lisi', name: '李四', email: 'lisi@clouderp.com', role: '采购主管', department: '采购部', status: 'active', createdAt: '2024-03-10' },
  { id: '4', username: 'wangwu', name: '王五', email: 'wangwu@clouderp.com', role: 'HR经理', department: '人力资源部', status: 'active', createdAt: '2024-04-01' },
  { id: '5', username: 'zhaoliu', name: '赵六', email: 'zhaoliu@clouderp.com', role: '仓库管理员', department: '仓储部', status: 'active', createdAt: '2024-05-20' },
  { id: '6', username: 'sunqi', name: '孙七', email: 'sunqi@clouderp.com', role: '财务主管', department: '财务部', status: 'active', createdAt: '2024-06-15' },
];

// ── Customers ──
export const mockCustomers: Customer[] = [
  { id: '1', name: '张伟', company: '星辰科技有限公司', phone: '13800138001', email: 'zhangwei@xingchen.com', level: 'VIP', source: '展会', industry: '互联网', address: '北京市朝阳区', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: '李娜', company: '蓝海集团', phone: '13800138002', email: 'lina@lanhai.com', level: 'A', source: '转介绍', industry: '金融', address: '上海市浦东新区', status: 'active', createdAt: '2024-02-20' },
  { id: '3', name: '王强', company: '创新工场', phone: '13800138003', email: 'wangqiang@cxgc.com', level: 'B', source: '网站', industry: '教育', address: '深圳市南山区', status: 'active', createdAt: '2024-03-05' },
  { id: '4', name: '赵敏', company: '东方集团', phone: '13800138004', email: 'zhaomin@dongfang.com', level: 'A', source: '广告', industry: '制造', address: '广州市天河区', status: 'active', createdAt: '2024-03-18' },
  { id: '5', name: '刘洋', company: '瑞科信息技术有限公司', phone: '13800138005', email: 'liuyang@ruike.com', level: 'C', source: '电话营销', industry: '软件', address: '杭州市西湖区', status: 'active', createdAt: '2024-04-10' },
  { id: '6', name: '陈静', company: '天元数据有限公司', phone: '13800138006', email: 'chenjing@tianyuan.com', level: 'VIP', source: '合作伙伴', industry: '大数据', address: '成都市高新区', status: 'active', createdAt: '2024-04-25' },
  { id: '7', name: '杨磊', company: '极光科技', phone: '13800138007', email: 'yanglei@jiguang.com', level: 'B', source: '展会', industry: '人工智能', address: '武汉市洪山区', status: 'active', createdAt: '2024-05-12' },
  { id: '8', name: '周婷', company: '华创资本', phone: '13800138008', email: 'zhouting@huachuang.com', level: 'A', source: '转介绍', industry: '投资', address: '南京市鼓楼区', status: 'inactive', createdAt: '2024-05-30' },
];

// ── Contracts ──
export const mockContracts: Contract[] = [
  { id: '1', name: 'ERP系统实施合同', customerId: '1', customerName: '星辰科技有限公司', amount: 580000, status: 'signed', signedAt: '2024-02-01', createdAt: '2024-01-20' },
  { id: '2', name: 'OA协同办公系统', customerId: '2', customerName: '蓝海集团', amount: 320000, status: 'signed', signedAt: '2024-03-15', createdAt: '2024-03-01' },
  { id: '3', name: 'CRM客户管理系统', customerId: '3', customerName: '创新工场', amount: 180000, status: 'pending', createdAt: '2024-04-10' },
  { id: '4', name: 'WMS仓储管理系统', customerId: '4', customerName: '东方集团', amount: 450000, status: 'signed', signedAt: '2024-04-20', createdAt: '2024-04-05' },
  { id: '5', name: '企业数据分析平台', customerId: '6', customerName: '天元数据有限公司', amount: 680000, status: 'pending', createdAt: '2024-05-15' },
  { id: '6', name: '智能客服系统', customerId: '7', customerName: '极光科技', amount: 250000, status: 'draft', createdAt: '2024-06-01' },
  { id: '7', name: '财务管理系统升级', customerId: '1', customerName: '星辰科技有限公司', amount: 150000, status: 'completed', signedAt: '2024-01-10', createdAt: '2023-12-20' },
  { id: '8', name: 'MES制造执行系统', customerId: '4', customerName: '东方集团', amount: 920000, status: 'draft', createdAt: '2024-06-15' },
];

// ── Products ──
export const mockProducts: Product[] = [
  { id: '1', name: '笔记本电脑 Pro 15', code: 'NB-PRO15', category: '电子产品', unit: '台', price: 8999, cost: 6500, stock: 120, minStock: 20, status: 'active', createdAt: '2024-01-10' },
  { id: '2', name: '机械键盘 K100', code: 'KB-K100', category: '外设', unit: '个', price: 599, cost: 350, stock: 300, minStock: 50, status: 'active', createdAt: '2024-01-15' },
  { id: '3', name: '27寸4K显示器', code: 'MN-4K27', category: '电子产品', unit: '台', price: 3299, cost: 2200, stock: 85, minStock: 15, status: 'active', createdAt: '2024-02-01' },
  { id: '4', name: '无线鼠标 M3', code: 'MS-M3', category: '外设', unit: '个', price: 199, cost: 80, stock: 500, minStock: 100, status: 'active', createdAt: '2024-02-10' },
  { id: '5', name: '企业级路由器', code: 'RT-ENT1', category: '网络设备', unit: '台', price: 2599, cost: 1800, stock: 45, minStock: 10, status: 'active', createdAt: '2024-03-01' },
  { id: '6', name: '固态硬盘 1TB', code: 'SSD-1TB', category: '存储', unit: '个', price: 699, cost: 450, stock: 200, minStock: 30, status: 'active', createdAt: '2024-03-15' },
  { id: '7', name: '智能投影仪 P200', code: 'PJ-P200', category: '电子产品', unit: '台', price: 4599, cost: 3200, stock: 30, minStock: 5, status: 'active', createdAt: '2024-04-01' },
  { id: '8', name: '网络摄像头 C10', code: 'CAM-C10', category: '安防', unit: '个', price: 899, cost: 550, stock: 8, minStock: 20, status: 'active', createdAt: '2024-04-10' },
  { id: '9', name: '激光打印机 L300', code: 'PR-L300', category: '办公设备', unit: '台', price: 1899, cost: 1200, stock: 60, minStock: 10, status: 'active', createdAt: '2024-05-01' },
  { id: '10', name: 'UPS不间断电源', code: 'UPS-1000', category: '电源', unit: '台', price: 1299, cost: 850, stock: 40, minStock: 8, status: 'inactive', createdAt: '2024-05-15' },
];

// ── Purchase Orders ──
export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: '1', orderNo: 'PO-2024-001', supplierName: '深圳华强电子', totalAmount: 156000, status: 'received', items: [{ productId: '1', productName: '笔记本电脑 Pro 15', quantity: 20, price: 6500 }, { productId: '3', productName: '27寸4K显示器', quantity: 10, price: 2200 }], createdAt: '2024-01-05' },
  { id: '2', orderNo: 'PO-2024-002', supplierName: '东莞键鼠工厂', totalAmount: 45000, status: 'received', items: [{ productId: '2', productName: '机械键盘 K100', quantity: 100, price: 350 }, { productId: '4', productName: '无线鼠标 M3', quantity: 100, price: 80 }], createdAt: '2024-02-10' },
  { id: '3', orderNo: 'PO-2024-003', supplierName: '北京存储科技', totalAmount: 96000, status: 'approved', items: [{ productId: '6', productName: '固态硬盘 1TB', quantity: 200, price: 450 }], createdAt: '2024-03-20' },
  { id: '4', orderNo: 'PO-2024-004', supplierName: '上海网络设备', totalAmount: 90000, status: 'pending', items: [{ productId: '5', productName: '企业级路由器', quantity: 50, price: 1800 }], createdAt: '2024-05-01' },
  { id: '5', orderNo: 'PO-2024-005', supplierName: '广州安防科技', totalAmount: 11000, status: 'draft', items: [{ productId: '8', productName: '网络摄像头 C10', quantity: 20, price: 550 }], createdAt: '2024-06-10' },
];

// ── Sales Orders ──
export const mockSalesOrders: SalesOrder[] = [
  { id: '1', orderNo: 'SO-2024-001', customerId: '1', customerName: '星辰科技有限公司', totalAmount: 113880, status: 'completed', items: [{ productId: '1', productName: '笔记本电脑 Pro 15', quantity: 10, price: 8999 }, { productId: '2', productName: '机械键盘 K100', quantity: 20, price: 599 }, { productId: '4', productName: '无线鼠标 M3', quantity: 60, price: 199 }], createdAt: '2024-02-15' },
  { id: '2', orderNo: 'SO-2024-002', customerId: '2', customerName: '蓝海集团', totalAmount: 65980, status: 'completed', items: [{ productId: '3', productName: '27寸4K显示器', quantity: 20, price: 3299 }], createdAt: '2024-03-20' },
  { id: '3', orderNo: 'SO-2024-003', customerId: '4', customerName: '东方集团', totalAmount: 78550, status: 'shipped', items: [{ productId: '5', productName: '企业级路由器', quantity: 15, price: 2599 }, { productId: '6', productName: '固态硬盘 1TB', quantity: 50, price: 699 }], createdAt: '2024-04-25' },
  { id: '4', orderNo: 'SO-2024-004', customerId: '6', customerName: '天元数据有限公司', totalAmount: 45990, status: 'pending', items: [{ productId: '7', productName: '智能投影仪 P200', quantity: 10, price: 4599 }], createdAt: '2024-05-20' },
  { id: '5', orderNo: 'SO-2024-005', customerId: '3', customerName: '创新工场', totalAmount: 23740, status: 'draft', items: [{ productId: '9', productName: '激光打印机 L300', quantity: 10, price: 1899 }, { productId: '2', productName: '机械键盘 K100', quantity: 8, price: 599 }], createdAt: '2024-06-05' },
];

// ── Employees ──
export const mockEmployees: Employee[] = [
  { id: '1', name: '张三', employeeNo: 'EMP001', department: '销售部', position: '销售经理', phone: '13800138001', email: 'zhangsan@clouderp.com', status: 'active', hireDate: '2024-01-01' },
  { id: '2', name: '李四', employeeNo: 'EMP002', department: '采购部', position: '采购主管', phone: '13800138002', email: 'lisi@clouderp.com', status: 'active', hireDate: '2024-01-15' },
  { id: '3', name: '王五', employeeNo: 'EMP003', department: '人力资源部', position: 'HR经理', phone: '13800138003', email: 'wangwu@clouderp.com', status: 'active', hireDate: '2024-02-01' },
  { id: '4', name: '赵六', employeeNo: 'EMP004', department: '仓储部', position: '仓库管理员', phone: '13800138004', email: 'zhaoliu@clouderp.com', status: 'active', hireDate: '2024-02-15' },
  { id: '5', name: '孙七', employeeNo: 'EMP005', department: '财务部', position: '财务主管', phone: '13800138005', email: 'sunqi@clouderp.com', status: 'active', hireDate: '2024-03-01' },
  { id: '6', name: '钱八', employeeNo: 'EMP006', department: '技术部', position: '高级工程师', phone: '13800138006', email: 'qianba@clouderp.com', status: 'active', hireDate: '2024-03-15' },
  { id: '7', name: '吴九', employeeNo: 'EMP007', department: '市场部', position: '市场总监', phone: '13800138007', email: 'wujiu@clouderp.com', status: 'active', hireDate: '2024-04-01' },
  { id: '8', name: '郑十', employeeNo: 'EMP008', department: '客服部', position: '客服专员', phone: '13800138008', email: 'zhengshi@clouderp.com', status: 'inactive', hireDate: '2024-05-01' },
];

// ── Announcements ──
export const mockAnnouncements: Announcement[] = [
  { id: '1', title: '关于2024年春节放假安排的通知', content: '根据国家法定节假日安排，公司将于2月10日至2月17日放假...', type: 'notice', publisher: '系统管理员', isTop: true, createdAt: '2024-01-25' },
  { id: '2', title: 'CloudERP系统V2.0版本更新公告', content: '新增CRM客户管理、ERP进销存等模块...', type: 'notice', publisher: '系统管理员', isTop: false, createdAt: '2024-03-01' },
  { id: '3', title: '2024年第二季度绩效考核通知', content: '请各部门负责人于6月30日前完成绩效考核...', type: 'notice', publisher: '王五', isTop: false, createdAt: '2024-06-01' },
  { id: '4', title: '公司信息安全管理制度', content: '为加强公司信息安全管理，特制定本制度...', type: 'policy', publisher: '系统管理员', isTop: true, createdAt: '2024-02-15' },
  { id: '5', title: '2024年团建活动通知', content: '公司将于7月15日组织全体员工团建活动...', type: 'event', publisher: '王五', isTop: false, createdAt: '2024-06-20' },
];

// ── Dashboard Stats ──
export const mockDashboardStats: DashboardStats = {
  totalCustomers: 156,
  totalRevenue: 2865000,
  totalOrders: 428,
  totalProducts: 245,
  revenueGrowth: 12.5,
  customerGrowth: 8.3,
  orderGrowth: 15.2,
  productGrowth: 5.7,
  monthlyRevenue: [
    { month: '1月', revenue: 180000, orders: 25 },
    { month: '2月', revenue: 220000, orders: 32 },
    { month: '3月', revenue: 250000, orders: 38 },
    { month: '4月', revenue: 280000, orders: 42 },
    { month: '5月', revenue: 310000, orders: 48 },
    { month: '6月', revenue: 350000, orders: 55 },
    { month: '7月', revenue: 320000, orders: 50 },
    { month: '8月', revenue: 290000, orders: 44 },
    { month: '9月', revenue: 260000, orders: 39 },
    { month: '10月', revenue: 240000, orders: 36 },
    { month: '11月', revenue: 270000, orders: 41 },
    { month: '12月', revenue: 300000, orders: 46 },
  ],
  orderStatusDistribution: [
    { name: '已完成', value: 280 },
    { name: '进行中', value: 85 },
    { name: '待审核', value: 40 },
    { name: '已取消', value: 23 },
  ],
  topCustomers: [
    { name: '星辰科技有限公司', revenue: 580000 },
    { name: '蓝海集团', revenue: 450000 },
    { name: '东方集团', revenue: 420000 },
    { name: '天元数据有限公司', revenue: 350000 },
    { name: '创新工场', revenue: 280000 },
  ],
};
