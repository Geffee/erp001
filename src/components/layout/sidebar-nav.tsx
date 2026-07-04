import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  ClipboardList,
  FileText,
  UserRound,
  Building2,
  Truck,
  Megaphone,
  Settings,
  ChevronDown,
  BarChart3,
  Store,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  title: string;
  icon: React.ElementType;
  href?: string;
  children?: { title: string; href: string }[];
}

const navItems: NavItem[] = [
  { title: '仪表盘', icon: LayoutDashboard, href: '/' },
  {
    title: 'CRM 客户管理',
    icon: Users,
    children: [
      { title: '客户列表', href: '/crm/customers' },
      { title: '合同管理', href: '/crm/contracts' },
    ],
  },
  {
    title: 'ERP 进销存',
    icon: Store,
    children: [
      { title: '产品管理', href: '/erp/products' },
      { title: '采购管理', href: '/erp/purchases' },
      { title: '销售管理', href: '/erp/sales' },
      { title: '库存管理', href: '/erp/inventory' },
    ],
  },
  {
    title: 'HRM 人力资源',
    icon: UserRound,
    children: [
      { title: '员工管理', href: '/hrm/employees' },
    ],
  },
  {
    title: 'OA 协同办公',
    icon: Building2,
    children: [
      { title: '通知公告', href: '/oa/announcements' },
    ],
  },
  {
    title: '系统管理',
    icon: Settings,
    children: [
      { title: '用户管理', href: '/system/users' },
      { title: '角色管理', href: '/system/roles' },
    ],
  },
];

export function SidebarNav() {
  const location = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (title: string) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="flex flex-col gap-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isExpanded = expanded[item.title] ?? true;

        if (item.href) {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.title}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground/80'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{item.title}</span>
            </NavLink>
          );
        }

        return (
          <div key={item.title}>
            <button
              onClick={() => toggleExpand(item.title)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                'text-sidebar-foreground/80'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="flex-1 text-left">{item.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 shrink-0 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            </button>
            {isExpanded && item.children && (
              <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-sidebar-border pl-4">
                {item.children.map((child) => {
                  const isChildActive = location.pathname === child.href;
                  return (
                    <NavLink
                      key={child.href}
                      to={child.href}
                      className={cn(
                        'rounded-md px-3 py-2 text-sm transition-all duration-200',
                        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isChildActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground/60'
                      )}
                    >
                      {child.title}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
