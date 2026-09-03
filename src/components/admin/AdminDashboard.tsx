import React from 'react';
import { 
  Newspaper, 
  FileText, 
  TrendingUp, 
  Cpu, 
  UploadCloud, 
  DollarSign, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Activity, 
  ChevronLeft 
} from 'lucide-react';
import { AdminStats, AnalysisItem, NewsItem, PredictionItem } from '../../types';
import { formatBytes, formatNumber, toPersianDigits } from '../../utils/formatters';
import { AdminTab } from './AdminLayout';

interface AdminDashboardProps {
  stats: AdminStats;
  analyses: AnalysisItem[];
  news: NewsItem[];
  predictions: PredictionItem[];
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  analyses,
  news,
  predictions,
  onNavigateTab
}) => {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* News Card */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-[#12141c] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">رویدادهای ثبت‌شده</span>
            <Newspaper className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {toPersianDigits(stats.total_news)}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            پایگاه داده PostgreSQL
          </div>
        </div>

        {/* Analyses Card */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-[#12141c] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">تحلیل‌های راهبردی</span>
            <FileText className="w-4 h-4 text-[#B91C1C]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {toPersianDigits(stats.total_analyses)}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            منتشرشده در تارنما
          </div>
        </div>

        {/* Predictions Card */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-[#12141c] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">سناریوهای آینده‌پژوهی</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {toPersianDigits(stats.total_predictions)}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            افق‌های کوتاه‌مدت تا بلندمدت
          </div>
        </div>

        {/* API Tokens Card */}
        <div className="p-5 rounded-xl border border-zinc-800 bg-[#12141c] space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-medium">مصرف کل توکن API</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {formatNumber(stats.total_api_tokens)}
          </div>
          <div className="text-[11px] text-zinc-500 font-mono">
            هزینه تخمینی: ${stats.total_cost_usd}
          </div>
        </div>
      </div>

      {/* 2. Quick Management Actions */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          عملیات سریع تحریریه
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('news')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت رویداد جدید (News)</span>
          </button>

          <button
            onClick={() => onNavigateTab('analyses')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs sm:text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>نگارش تحلیل راهبردی جدید</span>
          </button>

          <button
            onClick={() => onNavigateTab('predictions')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs sm:text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت برآورد سناریو</span>
          </button>

          <button
            onClick={() => onNavigateTab('uploads')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs sm:text-sm font-medium transition-colors"
          >
            <UploadCloud className="w-4 h-4" />
            <span>آپلود تصویر / نقشه ماهواره‌ای (Media)</span>
          </button>
        </div>
      </div>

      {/* 3. Recent Activity & Overview Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Analyses Box */}
        <div className="border border-zinc-800 bg-[#12141c] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" />
              <span>آخرین تحلیل‌های منتشرشده</span>
            </h4>
            <button
              onClick={() => onNavigateTab('analyses')}
              className="text-xs text-red-400 hover:underline flex items-center gap-0.5"
            >
              <span>مدیریت همه</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {analyses.slice(0, 4).map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span>{item.published_at}</span>
                  <span className="text-emerald-400 font-mono">وضعیت: {item.status === 'published' ? 'منتشرشده' : 'پیش‌نویس'}</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-zinc-200 line-clamp-1">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent News Box */}
        <div className="border border-zinc-800 bg-[#12141c] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-zinc-400" />
              <span>آخرین رویدادهای رصدشده</span>
            </h4>
            <button
              onClick={() => onNavigateTab('news')}
              className="text-xs text-red-400 hover:underline flex items-center gap-0.5"
            >
              <span>مدیریت اخبار</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {news.slice(0, 4).map((n) => (
              <div key={n.id} className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                  <span className="text-zinc-400">{n.source}</span>
                  <span>{n.published_at}</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-zinc-200 line-clamp-1">
                  {n.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
