import React from 'react';
import { 
  Shield, 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Radio, 
  FileText, 
  Calendar, 
  Activity,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { AnalysisItem, NewsItem, PredictionItem, SiteSettings } from '../../types';
import { getCategoryColor, getCategoryLabel, getSeverityBadge, toPersianDigits } from '../../utils/formatters';

interface HomePageProps {
  settings: SiteSettings;
  analyses: AnalysisItem[];
  news: NewsItem[];
  predictions: PredictionItem[];
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  settings,
  analyses,
  news,
  predictions,
  onNavigate
}) => {
  const publishedAnalyses = analyses.filter(a => a.status === 'published');
  const featuredAnalysis = publishedAnalyses[0];
  const otherAnalyses = publishedAnalyses.slice(1, 4);
  const recentNews = news.filter(n => n.status === 'published').slice(0, 5);

  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-zinc-800 bg-gradient-to-b from-[#13151f] to-[#0f1117] rounded-xl p-6 sm:p-10 lg:p-14 relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 radar-grid opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B91C1C]/15 border border-[#B91C1C]/40 text-[#ef4444] text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B91C1C]"></span>
              <span>دیدبان زنده تحولات ژئوپلیتیک</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.3] sm:leading-[1.25]">
              {settings.hero_title}
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              {settings.hero_subtitle}
            </p>

            {/* Situation Status Pill Indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('/analysis')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white font-medium text-sm transition-colors shadow-sm"
              >
                <span>مشاهده تحلیل‌های راهبردی</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/predictions')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/70 font-medium text-sm transition-colors"
              >
                <span>برآورد سناریوهای بحران</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Situation Indicators Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-xs text-zinc-400 font-mono">وضعیت توازن کلی</div>
            <div className="text-base sm:text-lg font-bold text-white mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>بازدارندگی فعال</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">مهار تنش کنترل‌شده</div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-xs text-zinc-400 font-mono">کانال‌های دیپلماتیک</div>
            <div className="text-base sm:text-lg font-bold text-blue-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>مسقط / بغداد فعال</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">مبادله یادداشت‌های امنیتی</div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-xs text-zinc-400 font-mono">آمادگی پدافندی سنتکام</div>
            <div className="text-base sm:text-lg font-bold text-amber-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>سطح DEFCON-3</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">گشت‌های مداوم خلیج فارس</div>
          </div>

          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/80">
            <div className="text-xs text-zinc-400 font-mono">فشار تحریمی خزانه‌داری</div>
            <div className="text-base sm:text-lg font-bold text-red-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              <span>پیگیری مویرگی OFAC</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">هدف‌گیری صرافی‌های واسط</div>
          </div>
        </div>
      </section>

      {/* 3. Featured Analysis Card */}
      {featuredAnalysis && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-5 bg-[#B91C1C] rounded-sm"></span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">تحلیل برجسته روز</h2>
            </div>
            <button
              onClick={() => onNavigate('/analysis')}
              className="text-xs sm:text-sm text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>همه تحلیل‌ها</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div 
            onClick={() => onNavigate(`/analysis/${featuredAnalysis.id}`)}
            className="group cursor-pointer rounded-xl border border-zinc-800 bg-[#12141c] hover:border-zinc-700 p-6 sm:p-8 lg:p-10 transition-all"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs mb-4">
              <span className="px-2.5 py-1 rounded bg-[#B91C1C]/15 border border-[#B91C1C]/30 text-[#ef4444] font-medium">
                {getSeverityBadge(featuredAnalysis.severity).label}
              </span>
              <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">
                {getCategoryLabel(featuredAnalysis.category)}
              </span>
              <span className="text-zinc-400 flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5" />
                <span>زمان مطالعه: {featuredAnalysis.read_time}</span>
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-400">{featuredAnalysis.published_at}</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-extrabold text-white group-hover:text-red-400 transition-colors leading-snug mb-4">
              {featuredAnalysis.title}
            </h3>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
              {featuredAnalysis.summary}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="font-mono text-zinc-500">مدل تحلیلی:</span>
                <span className="font-mono text-zinc-300">{featuredAnalysis.model_used}</span>
              </div>
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-red-400 group-hover:translate-x-[-4px] transition-transform">
                <span>مطالعه کامل گزارش</span>
                <ChevronLeft className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Two-Column Layout: Recent Analyses & Intelligence Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Recent Analyses Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 bg-zinc-500 rounded-sm"></span>
                <h3 className="text-lg sm:text-xl font-bold text-white">تحلیل‌های اخیر</h3>
              </div>
              <button
                onClick={() => onNavigate('/analysis')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <span>آرشیو کامل</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {otherAnalyses.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate(`/analysis/${item.id}`)}
                  className="cursor-pointer group p-5 rounded-lg border border-zinc-800 bg-[#111219] hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-mono">
                    <span className="text-zinc-300">{getCategoryLabel(item.category)}</span>
                    <span>•</span>
                    <span>{item.published_at}</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors leading-snug mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Raw Intelligence News Feed (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#B91C1C]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  رویدادها و اخبار پالایش‌شده
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">منبع متقاطع</span>
            </div>

            <div className="space-y-3">
              {recentNews.map((newsItem) => (
                <div
                  key={newsItem.id}
                  className="p-3.5 rounded-lg bg-zinc-900/50 border border-zinc-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span className="text-zinc-400">{newsItem.source}</span>
                    <span>{newsItem.published_at.split('-')[1] || newsItem.published_at}</span>
                  </div>
                  <h5 className="text-xs sm:text-sm font-semibold text-zinc-200 leading-snug">
                    {newsItem.title}
                  </h5>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-normal">
                    {newsItem.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Strategic Predictions Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-zinc-800 bg-[#12131b] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>برآورد احتمالات و آینده‌پژوهی</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                سناریوهای محتمل منازعه در افق‌های زمانی
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/predictions')}
              className="self-start sm:self-auto px-4 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-xs sm:text-sm font-medium text-white border border-zinc-700 transition-colors"
            >
              مشاهده تمامی پیش‌بینی‌ها
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {predictions.map((pred) => (
              <div
                key={pred.id}
                className="p-4 rounded-lg bg-zinc-900/70 border border-zinc-800/80 space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-400">{pred.timeframe_label}</span>
                  <span className="font-bold text-red-400">{toPersianDigits(pred.probability)}٪ احتمال</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div 
                    className="h-full bg-[#B91C1C]"
                    style={{ width: `${pred.probability}%` }}
                  ></div>
                </div>

                <h4 className="text-sm font-bold text-zinc-200 leading-snug">
                  {pred.title}
                </h4>

                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {pred.primary_scenario}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
