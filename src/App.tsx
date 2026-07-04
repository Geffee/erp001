import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

// Lazy load pages
import LoginPage from '@/pages/login';
import DashboardPage from '@/pages/dashboard';
import CustomersPage from '@/pages/crm/customers';
import ContractsPage from '@/pages/crm/contracts';
import ProductsPage from '@/pages/erp/products';
import PurchasesPage from '@/pages/erp/purchases';
import SalesPage from '@/pages/erp/sales';
import InventoryPage from '@/pages/erp/inventory';
import EmployeesPage from '@/pages/hrm/employees';
import AnnouncementsPage from '@/pages/oa/announcements';
import UsersPage from '@/pages/system/users';
import RolesPage from '@/pages/system/roles';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/crm/customers" element={<CustomersPage />} />
        <Route path="/crm/contracts" element={<ContractsPage />} />
        <Route path="/erp/products" element={<ProductsPage />} />
        <Route path="/erp/purchases" element={<PurchasesPage />} />
        <Route path="/erp/sales" element={<SalesPage />} />
        <Route path="/erp/inventory" element={<InventoryPage />} />
        <Route path="/hrm/employees" element={<EmployeesPage />} />
        <Route path="/oa/announcements" element={<AnnouncementsPage />} />
        <Route path="/system/users" element={<UsersPage />} />
        <Route path="/system/roles" element={<RolesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
