import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Archive, 
  Activity, 
  RotateCcw, 
  UserCheck, 
  Filter, 
  CheckCircle2,
  Terminal as TerminalIcon,
  HelpCircle
} from 'lucide-react';
import { Category } from '../types';

interface CommandSidebarProps {
  activeCategory: Category;
  setActiveCategory: (cat: Category) => void;
  onExecuteCommand: (cmd: string) => void;
  activeCommand: string;
}

export const CommandSidebar: React.FC<CommandSidebarProps> = ({
  activeCategory,
  setActiveCategory,
  onExecuteCommand,
  activeCommand
}) => {
  const commands = [
    { cmd: '/analyze', label: 'تحلیل فوری رخدادها', icon: Zap, desc: 'تحلیل ترکیبی با استناد به RAG' },
    { cmd: '/predict', label: 'پیش‌بینی و سناریونویسی', icon: TrendingUp, desc: 'افق‌های ۲۴ساعت تا ۳۰روز' },
    { cmd: '/history', label: 'آرشیو رخدادها', icon: Archive, desc: 'مرور پیام‌های پیشین و تطبیق' },
    { cmd: '/status', label: 'وضعیت سلامت سیستم', icon: Activity, desc: 'سرویس‌ها، ترافیک و توکن‌ها' },
    { cmd: '/help', label: 'راهنمای کاربری', icon: HelpCircle, desc: 'لیست دستورات و قواعد کاربری' },
  ];

  const adminCommands = [
    { cmd: '/backfill', label: 'بازخوانی کانال (Backfill)', icon: RotateCcw, desc: 'پایش تاریخی در پس‌زمینه' },
  ];

  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'همه حوزه‌ها', count: 18 },
    { id: 'military', label: 'نظامی و میدانی', count: 8 },
    { id: 'diplomatic', label: 'دیپلماتیک و سیاسی', count: 5 },
    { id: 'economic', label: 'تحریم و اقتصاد', count: 3 },
    { id: 'intelligence', label: 'اطلاعاتی و سایبری', count: 2 },
  ];

  return (
    <aside className="border-l border-slate-800 bg-[#0d0f14] p-4 flex flex-col gap-6 select-none shrink-0 h-full overflow-y-auto">
      {/* Bot Commands */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center gap-1.5">
            <TerminalIcon className="w-3 h-3 text-amber-500" />
            دستورات ربات تلگرام
          </h3>
          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded">آنلاین</span>
        </div>
        
        <nav className="space-y-1">
          {commands.map((item) => {
            const Icon = item.icon;
            const isActive = activeCommand === item.cmd;
            return (
              <button
                key={item.cmd}
                onClick={() => onExecuteCommand(item.cmd)}
                className={`w-full text-right px-3 py-2.5 rounded-sm text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-800/80 text-amber-400 border-r-2 border-amber-500 font-semibold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/40 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : 'text-slate-500'}`} />
                  <span className="font-mono text-sm">{item.cmd}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-sans hidden xl:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Categories Filter */}
      <div>
        <h3 className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-amber-500" />
          فیلتر دسته‌بندی موضوعی
        </h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full text-right px-3 py-1.5 rounded-sm text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium'
                  : 'text-slate-400 hover:bg-slate-800/30 hover:text-slate-200'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-800/60 px-1.5 py-0.5 rounded">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Admin Section */}
      <div>
        <h3 className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          مدیریت ارشد سیستم
        </h3>
        <nav className="space-y-1">
          {adminCommands.map((item) => {
            const Icon = item.icon;
            const isActive = activeCommand === item.cmd;
            return (
              <button
                key={item.cmd}
                onClick={() => onExecuteCommand(item.cmd)}
                className={`w-full text-right px-3 py-2 rounded-sm text-xs flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-500/10 text-red-400 border-r-2 border-red-500 font-semibold'
                    : 'text-red-400/80 hover:bg-red-500/10 hover:text-red-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-red-400" />
                  <span className="font-mono text-xs">{item.cmd}</span>
                </div>
                <span className="text-[10px] font-sans text-red-500/70 hidden xl:inline">مدیر</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Admin Info */}
      <div className="mt-auto pt-4 border-t border-slate-800 text-xs">
        <div className="text-[10px] text-slate-500 mb-2 uppercase font-mono flex items-center justify-between">
          <span>ادمین تایید شده</span>
          <span className="flex items-center gap-1 text-emerald-400 text-[10px]">
            <CheckCircle2 className="w-3 h-3" />
            مجاز
          </span>
        </div>
        <div className="flex items-center gap-2.5 p-2 bg-slate-800/40 rounded border border-slate-700/50">
          <div className="w-7 h-7 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-mono text-slate-200">ID: 8936968493</span>
            <span className="text-[10px] text-slate-500">دسترسی ریشه و کانال</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
