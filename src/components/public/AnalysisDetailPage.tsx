import React, { useState } from 'react';
import { 
  ArrowRight, 
  Clock, 
  Share2, 
  Check, 
  Calendar, 
  History, 
  AlertCircle, 
  Radio, 
  ShieldCheck, 
  Tag, 
  FileText 
} from 'lucide-react';
import { AnalysisItem, NewsItem } from '../../types';
import { getCategoryLabel, getSeverityBadge, toPersianDigits } from '../../utils/formatters';

interface AnalysisDetailPageProps {
  analysis: AnalysisItem;
  allNews: NewsItem[];
  onBack: () => void;
  onNavigateNews?: (newsId: string) => void;
}

export const AnalysisDetailPage: React.FC<AnalysisDetailPageProps> = ({
  analysis,
  allNews,
  onBack
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sev = getSeverityBadge(analysis.severity);
  const linkedNews = (analysis.linked_news_ids || [])
    .map(id => allNews.find(n => n.id === id))
    .filter(Boolean) as NewsItem[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Breadcrumbs & Back Action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست تحلیل‌ها</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">پیوند کپی شد</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>اشتراک‌گذاری</span>
            </>
          )}
        </button>
      </div>

      {/* Article Header */}
      <header className="space-y-4 border-b border-zinc-800 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={`px-2.5 py-1 rounded border font-medium ${sev.bg} ${sev.text} ${sev.border}`}>
            {sev.label}
          </span>
          <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">
            {getCategoryLabel(analysis.category)}
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>زمان مطالعه: {analysis.read_time}</span>
          </span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">{analysis.published_at}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          {analysis.title}
        </h1>

        <div className="flex items-center gap-3 pt-2 text-xs text-zinc-500 font-mono">
          <span>پردازش سنتز: <strong className="text-zinc-300 font-normal">{analysis.model_used}</strong></span>
          <span>•</span>
          <span>شاخص اطمینان راهبردی: <strong className="text-emerald-400 font-normal">{toPersianDigits(analysis.confidence_score)}٪</strong></span>
        </div>
      </header>

      {/* Key Takeaways Box */}
      <div className="p-5 sm:p-6 rounded-xl border border-[#B91C1C]/40 bg-[#B91C1C]/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#ef4444] uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#ef4444]" />
          <span>چکیده اجرایی و نکات کلیدی راهبردی</span>
        </div>
        <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Main Analysis Body */}
      <article className="prose prose-invert max-w-none text-zinc-300 text-base sm:text-lg leading-[1.8] space-y-6">
        {analysis.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white pt-4 pb-1 border-b border-zinc-800/80 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#B91C1C] rounded-sm"></span>
                <span>{paragraph.replace('### ', '')}</span>
              </h2>
            );
          }
          if (paragraph.startsWith('۱. ') || paragraph.startsWith('۲. ') || paragraph.startsWith('- ')) {
            return (
              <div key={idx} className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800/70 text-sm sm:text-base leading-relaxed whitespace-pre-line text-zinc-300">
                {paragraph}
              </div>
            );
          }
          return (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </article>

      {/* Historical Precedent Card */}
      {analysis.historical_precedent && (
        <div className="p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <History className="w-4 h-4 text-amber-400" />
            <span>عبرت‌ها و تطبیق تاریخی (Historical Precedent)</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {analysis.historical_precedent}
          </p>
        </div>
      )}

      {/* Counter-Analysis Perspective Card */}
      {analysis.counter_analysis && (
        <div className="p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <AlertCircle className="w-4 h-4 text-blue-400" />
            <span>دیدگاه جایگزین و تحلیل متقابل (Counter-Analysis)</span>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {analysis.counter_analysis}
          </p>
        </div>
      )}

      {/* Linked News Items */}
      {linkedNews.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-400" />
            <span>شواهد خبری و داده‌های مبنای تحلیل</span>
          </h3>
          <div className="space-y-3">
            {linkedNews.map(newsItem => (
              <div key={newsItem.id} className="p-3.5 rounded-lg bg-zinc-900/40 border border-zinc-800/80">
                <div className="text-xs text-zinc-500 font-mono mb-1">{newsItem.source} • {newsItem.published_at}</div>
                <div className="text-sm font-semibold text-zinc-200">{newsItem.title}</div>
                <div className="text-xs text-zinc-400 mt-1">{newsItem.summary}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags Strip */}
      {analysis.tags && analysis.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-zinc-800/60">
          <span className="text-xs text-zinc-500 ml-2">کلیدواژه‌ها:</span>
          {analysis.tags.map(tag => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
