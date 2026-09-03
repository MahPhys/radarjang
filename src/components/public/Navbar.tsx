import React, { useState } from 'react';
import { Shield, Radio, Menu, X, Lock, ExternalLink, ChevronLeft } from 'lucide-react';
import { SiteSettings } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  settings: SiteSettings;
  isAuthenticated: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  settings,
  isAuthenticated
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'صفحه نخست', path: '/' },
    { label: 'تحلیل‌های راهبردی', path: '/analysis' },
    { label: 'پیش‌بینی‌ها و سناریوها', path: '/predictions' },
    { label: 'درباره رادار جنگ', path: '/about' }
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#0f1117]/95 backdrop-blur-md">
      {/* Optional Announcement Banner */}
      {settings.announcement_active && settings.announcement_text && (
        <div className="bg-[#B91C1C]/15 border-b border-[#B91C1C]/30 px-4 py-2 text-center text-xs sm:text-sm text-zinc-200 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B91C1C] animate-pulse"></span>
          <span className="font-medium text-[#fca5a5]">ویژه رصد راهبردی:</span>
          <span>{settings.announcement_text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Right Logo & Title */}
          <div 
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-[#B91C1C] group-hover:border-[#B91C1C]/50 transition-colors">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-zinc-100">
                  {settings.site_name}
                </span>
                <span className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                  RADAR-JANG
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                دیدبان منازعات و توازن قوا
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || 
                (link.path === '/analysis' && currentPath.startsWith('/analysis'));
              return (
                <button
                  key={link.path}
                  onClick={() => handleLinkClick(link.path)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-zinc-800/80 text-white border border-zinc-700/80'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Left Actions: Situation Status & Admin Entry */}
          <div className="flex items-center gap-3">
            {/* Status Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>توازن فعال / سطح ۳</span>
            </div>

            {/* Admin Panel Button */}
            <button
              onClick={() => handleLinkClick('/admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-colors border ${
                currentPath.startsWith('/admin')
                  ? 'bg-[#B91C1C] text-white border-[#B91C1C]'
                  : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-zinc-400" />
              <span>{isAuthenticated ? 'پنل ادمین' : 'ورود تحریریه'}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
              aria-label="منوی اصلی"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0f1117] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full text-right px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <ChevronLeft className="w-4 h-4 text-zinc-500" />
              </button>
            );
          })}
          <div className="pt-2 border-t border-zinc-800/80 mt-2">
            <button
              onClick={() => handleLinkClick('/admin')}
              className="w-full text-right px-3 py-2.5 rounded-md text-sm font-medium text-red-400 hover:bg-zinc-900 flex items-center justify-between"
            >
              <span>ورود به پنل مدیریت رادار</span>
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
