import { Outlet } from 'react-router-dom';
import { SidebarNav } from './sidebar-nav';
import { Header } from './header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState, useEffect } from 'react';
import { Package2 } from 'lucide-react';

export function AppLayout() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('clouderp_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('clouderp_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Package2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">CloudERP</span>
            <span className="text-[10px] text-sidebar-foreground/50">企业办公一体化平台</span>
          </div>
        </div>
        <ScrollArea className="flex-1 py-3">
          <SidebarNav />
        </ScrollArea>
        <div className="border-t border-sidebar-border p-4">
          <p className="text-xs text-sidebar-foreground/40 text-center">
            CloudERP v2.0.0
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onToggleTheme={toggleTheme} isDark={isDark} />
        <main className="flex-1 overflow-auto bg-muted/30">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
