import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/lib/mock-data';
import { api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('clouderp_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // 尝试调用真实 API
      const userData = await api.login(username, password);
      const mappedUser: User = {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email || '',
        role: userData.role || '',
        department: userData.department || '',
        status: userData.status || 'active',
        createdAt: userData.createdAt || new Date().toISOString(),
      };
      setUser(mappedUser);
      localStorage.setItem('clouderp_user', JSON.stringify(mappedUser));
      setIsLoading(false);
      return true;
    } catch {
      // API 不可用时回退到 mock 数据
      await new Promise(r => setTimeout(r, 800));
      const foundUser = mockUsers.find(
        u => u.username === username && u.status === 'active'
      );
      if (foundUser && password === 'admin123') {
        setUser(foundUser);
        localStorage.setItem('clouderp_user', JSON.stringify(foundUser));
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    api.logout();
    localStorage.removeItem('clouderp_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
