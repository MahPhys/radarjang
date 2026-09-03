import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  FileText, 
  TrendingUp, 
  Settings, 
  UploadCloud, 
  Cpu, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Radio, 
  ChevronLeft 
} from 'lucide-react';
import { SiteSettings } from '../../types';

export type AdminTab = 
  | 'dashboard'
  | 'news'
  | 'analyses'
  | 'predictions'
  | 'settings'
  | 'uploads'
  | 'api_logs';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  settings: SiteSettings;
  onLogout: () => void;
  onBackToSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  onTabChange,
  settings,
  onLogout,
  onBackToSite,
  children
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'داشبورد وضعیت', icon: LayoutDashboard },
    { id: 'news', label: 'مدیریت رویدادها (News)', icon: Newspaper },
    { id: 'analyses', label: 'مدیریت تحلیل‌ها (Analyses)', icon: FileText },
    { id: 'predictions', label: 'مدیریت سناریوها (Predictions)', icon: TrendingUp },
    { id: 'settings', label: 'تنظیمات و هویت سایت', icon: Settings },
    { id: 'uploads', label: 'فایل‌ها و چندرسانه‌ای (Media)', icon: UploadCloud },
    { id: 'api_logs', label: 'لاگ و مصرف API مدل‌ها', icon: Cpu },
  ];

  const currentMenu = menuItems.find(m => m.id === activeTab);

  return (
    <div className="min-h-screen bg-[#0d0e14] text-[#e2e8f0] flex flex-col md:flex-row font-sans">
      {/* 1. Desktop Sidebar (Right side in RTL) */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#10121a] border-l border-zinc-800/90 shrink-0 select-none">
        {/* Sidebar Brand Header */}
        <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-[#B91C1C]">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight">
                {settings.site_name}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">پنل مدیریت تحریریه</div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#B91C1C] text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronLeft className="w-4 h-4" />}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom Footer */}
        <div className="p-4 border-t border-zinc-800/80 space-y-2">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>مشاهده تارنمای عمومی</span>
            </span>
            <ChevronLeft className="w-3.5 h-3.5 text-zinc-600" />
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از پنل مدیریت</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-zinc-800/90 bg-[#10121a]/95 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-base sm:text-lg font-bold text-white">
              {currentMenu?.label || 'داشبورد'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400">
              <span>Cloudflare D1: متصل</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            </div>

            <button
              onClick={onBackToSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>مشاهده سایت</span>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Dropdown */}
        {mobileSidebarOpen && (
          <div className="md:hidden bg-[#10121a] border-b border-zinc-800 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium ${
                    isActive ? 'bg-[#B91C1C] text-white' : 'text-zinc-400 hover:bg-zinc-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <div className="pt-2 border-t border-zinc-800 mt-2 flex gap-2">
              <button
                onClick={onBackToSite}
                className="flex-1 py-2 text-center text-xs text-zinc-300 bg-zinc-900 rounded"
              >
                مشاهده سایت
              </button>
              <button
                onClick={onLogout}
                className="flex-1 py-2 text-center text-xs text-red-400 bg-red-950/40 rounded"
              >
                خروج
              </button>
            </div>
          </div>
        )}

        {/* Child Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
