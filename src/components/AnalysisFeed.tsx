import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  GitCompare, 
  Sparkles, 
  Cpu, 
  Radio, 
  Flame, 
  BookmarkCheck,
  Share2
} from 'lucide-react';
import { AnalysisRecord, Category } from '../types';

interface AnalysisFeedProps {
  analyses: AnalysisRecord[];
  activeCategory: Category;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectAnalysis?: (analysis: AnalysisRecord) => void;
}

export const AnalysisFeed: React.FC<AnalysisFeedProps> = ({
  analyses,
  activeCategory,
  searchQuery,
  setSearchQuery,
  onSelectAnalysis
}) => {
  const [expandedId, setExpandedId] = useState<string | null>('an-1049');

  const filteredAnalyses = analyses.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesQuery = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2.5 py-0.5 bg-red-500/15 text-red-400 text-[11px] font-bold border border-red-500/30 rounded flex items-center gap-1 shadow-[0_0_8px_rgba(239,68,68,0.2)]">
            <Flame className="w-3 h-3 text-red-400 animate-pulse" />
            بسیار مهم (تنش بالا)
          </span>
        );
      case 'medium':
        return (
          <span className="px-2.5 py-0.5 bg-amber-500/15 text-amber-400 text-[11px] font-bold border border-amber-500/30 rounded flex items-center gap-1">
            <Radio className="w-3 h-3 text-amber-400" />
            متوسط (پایش مستمر)
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 bg-slate-800 text-slate-400 text-[11px] font-medium border border-slate-700 rounded">
            عادی / زمینه‌ای
          </span>
        );
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'military': return 'نظامی و راهبردی';
      case 'diplomatic': return 'دیپلماتیک و روابط خارجی';
      case 'economic': return 'اقتصادی و تحریم‌ها';
      case 'intelligence': return 'اطلاعاتی و سایبری';
      default: return category;
    }
  };

  return (
    <section className="flex-1 flex flex-col h-full bg-[#0a0b0e] overflow-hidden">
      {/* Header and Controls */}
      <div className="p-4 md:p-6 border-b border-slate-800/80 bg-[#0c0e13] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-amber-500 rounded-sm"></div>
            <h2 className="text-base md:text-lg font-bold text-slate-100">
              خروجی تحلیل‌های چندعاملی رادار
            </h2>
            <span className="text-xs font-mono text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
              {filteredAnalyses.length} سند پردازش‌شده
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            تلفیق بلادرنگ اخبار کانال اختصاصی با الگوهای تاریخی و دیدگاه‌های جایگزین
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجو در کلیدواژه‌ها، تحلیل‌ها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11141b] text-slate-200 text-xs pr-9 pl-3 py-2 rounded border border-slate-800 focus:outline-none focus:border-amber-500/60 transition-colors placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Analysis Feed List */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {filteredAnalyses.length === 0 ? (
          <div className="p-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-lg">
            <p className="text-sm">هیچ سندی با فیلترهای انتخابی یافت نشد.</p>
          </div>
        ) : (
          filteredAnalyses.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <article
                key={item.id}
                className={`bg-[#11141b] border transition-all duration-200 rounded-lg overflow-hidden ${
                  item.severity === 'critical'
                    ? 'border-red-900/30 hover:border-red-600/50 shadow-sm'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-4 md:p-5">
                  {/* Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded text-[11px]">
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono text-slate-400 text-[11px]">{item.channel}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-[11px]">{item.timeAgo}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getSeverityBadge(item.severity)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base md:text-lg font-bold text-slate-100 mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Core Summary */}
                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* Expanded Sections: Precedent and Counter-Analysis */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-slate-800/80 my-3">
                      {/* Historical Precedent / RAG Match */}
                      <div className="p-3 bg-[#0d0f14] border border-slate-800 rounded flex gap-3 items-start">
                        <GitCompare className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-400 mb-1">
                            تطبیق تاریخی با بستر ChromaDB (عامل Historian):
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {item.historicalPrecedent}
                          </p>
                        </div>
                      </div>

                      {/* Counter-Analysis / Alternative Viewpoint */}
                      <div className="p-3 bg-[#0d0f14] border border-slate-800 rounded flex gap-3 items-start">
                        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-cyan-400 mb-1">
                            دیدگاه جایگزین و ارزیابی بلوف (عامل Synthesis):
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {item.counterAnalysis}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags and Footer Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/50 mt-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono bg-slate-800/80 px-2 py-1 rounded text-slate-300 border border-slate-700/60 flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-amber-400" />
                        مدل: {item.model}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-800/80 px-2 py-1 rounded text-emerald-400 border border-slate-700/60">
                        اطمینان: {item.confidence}٪
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded">
                        {item.tokensUsed.toLocaleString()} توکن
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="text-xs text-amber-400/90 hover:text-amber-300 flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            بستن جزئیات <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            مشاهده تحلیل عمیق و RAG <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
};
