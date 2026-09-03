import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, ChevronLeft, Tag, Layers, X } from 'lucide-react';
import { AnalysisItem, Category, Severity } from '../../types';
import { getCategoryLabel, getSeverityBadge, toPersianDigits } from '../../utils/formatters';

interface AnalysisListPageProps {
  analyses: AnalysisItem[];
  onSelectAnalysis: (id: string) => void;
}

export const AnalysisListPage: React.FC<AnalysisListPageProps> = ({
  analyses,
  onSelectAnalysis
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'همه حوزه‌ها' },
    { id: 'military', label: 'نظامی و تسلیحاتی' },
    { id: 'diplomatic', label: 'دیپلماتیک و سیاسی' },
    { id: 'economic', label: 'اقتصادی و تحریم' },
    { id: 'intelligence', label: 'اطلاعاتی و امنیتی' }
  ];

  const filteredAnalyses = useMemo(() => {
    return analyses
      .filter(a => a.status === 'published')
      .filter(a => {
        // Category filter
        if (selectedCategory !== 'all' && a.category !== selectedCategory) {
          return false;
        }
        // Severity filter
        if (selectedSeverity !== 'all' && a.severity !== selectedSeverity) {
          return false;
        }
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = a.title.toLowerCase().includes(q);
          const matchSummary = a.summary.toLowerCase().includes(q);
          const matchTags = a.tags?.some(t => t.toLowerCase().includes(q));
          return matchTitle || matchSummary || matchTags;
        }
        return true;
      });
  }, [analyses, selectedCategory, selectedSeverity, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
          <span>بانک پژوهش‌های استراتژیک</span>
          <span>•</span>
          <span>{toPersianDigits(filteredAnalyses.length)} تحلیل معتبر</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          تحلیل‌های راهبردی روابط و منازعات ایران و آمریکا
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
          ارزیابی عمیق، تطبیق تاریخی و بررسی سناریوهای موازنه قوا بر پایه اطلاعات آشکار و پردازش متقاطع رویدادها.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl p-4 sm:p-5 space-y-4">
        {/* Search row */}
        <div className="relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عناوین، چکیده‌ها، کلیدواژه‌ها (مثال: هرمز، سنتکام، تحریم)..."
            className="w-full pr-10 pl-10 py-2.5 bg-zinc-900/90 border border-zinc-700/80 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#B91C1C]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-800/80">
          <span className="text-xs text-zinc-500 font-mono ml-2">دسته‌بندی:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#B91C1C] text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analyses Cards List */}
      {filteredAnalyses.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl p-8 space-y-3">
          <Layers className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 text-sm">هیچ تحلیلی با فیلترهای انتخابی یافت نشد.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedSeverity('all');
            }}
            className="text-xs text-red-400 hover:underline"
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((item) => {
            const sev = getSeverityBadge(item.severity);
            return (
              <div
                key={item.id}
                onClick={() => onSelectAnalysis(item.id)}
                className="cursor-pointer group flex flex-col justify-between p-6 rounded-xl border border-zinc-800 bg-[#12131c] hover:border-zinc-700 transition-all shadow-sm"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${sev.bg} ${sev.text} ${sev.border}`}>
                      {sev.label}
                    </span>
                    <span className="text-zinc-400 font-mono">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{item.read_time}</span>
                    <span>•</span>
                    <span>{item.published_at}</span>
                  </div>
                  <div className="text-red-400 group-hover:translate-x-[-3px] transition-transform flex items-center gap-0.5">
                    <span>مطالعه</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
