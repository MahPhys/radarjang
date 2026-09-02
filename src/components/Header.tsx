import React from 'react';
import { ShieldAlert, RefreshCw, Radio, Clock, ShieldCheck, Terminal } from 'lucide-react';
import { SystemMetrics } from '../types';

interface HeaderProps {
  metrics: SystemMetrics;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeView: 'feed' | 'terminal' | 'predictions' | 'status';
  setActiveView: (view: 'feed' | 'terminal' | 'predictions' | 'status') => void;
  currentTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  metrics,
  onRefresh,
  isRefreshing,
  activeView,
  setActiveView,
  currentTime
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0f1117] flex items-center justify-between px-4 md:px-8 select-none shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/80 flex items-center justify-center rounded-sm relative">
          <div className="w-3.5 h-3.5 bg-amber-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.6)]"></div>
          <div className="absolute inset-0 border border-amber-500/20 rounded-sm scale-125 animate-ping opacity-25"></div>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
              رادار جنگ
              <span className="text-[10px] font-mono font-normal text-amber-500/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                PROD v1.0.4
              </span>
            </h1>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            سامانه پایش اطلاعاتی، هوش چندعاملی و تحلیل مخاصمات ایران–آمریکا
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 text-sm">
        {/* Navigation Tabs */}
        <div className="hidden lg:flex items-center bg-[#0a0b0e] p-1 rounded-md border border-slate-800 gap-1 text-xs">
          <button
            onClick={() => setActiveView('feed')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeView === 'feed'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            جریان تحلیل‌ها
          </button>
          <button
            onClick={() => setActiveView('terminal')}
            className={`px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeView === 'terminal'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            شبیه‌ساز ربات
          </button>
          <button
            onClick={() => setActiveView('predictions')}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeView === 'predictions'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            سناریوهای پیش‌بینی
          </button>
        </div>

        {/* Operational Status indicator */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded border border-slate-800 text-xs">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-slate-300 font-medium hidden sm:inline">وضعیت:</span>
          <span className="text-emerald-400 font-mono">عملیاتی</span>
        </div>

        {/* Clock */}
        <div className="hidden sm:flex items-center gap-2 text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded border border-slate-800 text-xs font-mono">
          <span className="text-amber-500/80 text-[10px] font-bold">تهران (UTC+3:30)</span>
          <span className="text-slate-200">{currentTime}</span>
        </div>

        {/* Manual Refresh */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="تازه سازی بلادرنگ"
          className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 p-2 md:px-3 md:py-1.5 text-xs rounded border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          <span className="hidden md:inline">بروزرسانی</span>
        </button>
      </div>
    </header>
  );
};
