import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  HelpCircle 
} from 'lucide-react';
import { PredictionItem, Timeframe } from '../../types';
import { toPersianDigits } from '../../utils/formatters';

interface PredictionsPageProps {
  predictions: PredictionItem[];
}

export const PredictionsPage: React.FC<PredictionsPageProps> = ({ predictions }) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const publishedPreds = predictions.filter(p => p.status === 'published');

  const filteredPreds = publishedPreds.filter(p => {
    if (activeTab === 'all') return true;
    return p.timeframe === activeTab;
  });

  const tabs: { id: string; label: string }[] = [
    { id: 'all', label: 'همه سناریوها' },
    { id: 'short', label: 'کوتاه‌مدت (۱ تا ۴ هفته)' },
    { id: 'mid', label: 'میان‌مدت (۱ تا ۶ ماه)' },
    { id: 'long', label: 'بلندمدت (۶ ماه تا ۲ سال)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-amber-400 font-mono">
          <Compass className="w-3.5 h-3.5" />
          <span>دیدبان آینده‌پژوهی و سناریونویسی راهبردی</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          برآوردهای احتمالی و سناریوهای موازنه قوا
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
          مدل‌سازی شانس وقوع رویدادهای سرنوشت‌ساز در روابط و منازعات ایران و آمریکا، شناسایی ماشه‌های بحران و سناریوهای جایگزین.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#B91C1C] text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPreds.map(pred => {
          let riskBadge = { text: 'ریسک متوسط', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
          if (pred.risk_level === 'critical') {
            riskBadge = { text: 'ریسک بحرانی', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
          } else if (pred.risk_level === 'high') {
            riskBadge = { text: 'ریسک بالا', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
          } else if (pred.risk_level === 'low') {
            riskBadge = { text: 'ریسک کنترل‌شده', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
          }

          return (
            <div
              key={pred.id}
              className="p-6 rounded-xl border border-zinc-800 bg-[#12131c] flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-400">{pred.timeframe_label}</span>
                  <span className={`px-2 py-0.5 rounded border text-[11px] font-medium ${riskBadge.color}`}>
                    {riskBadge.text}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {pred.title}
                </h3>

                {/* Probability Bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-mono">احتمال وقوع برآورد شده:</span>
                    <span className="font-mono font-bold text-red-400">{toPersianDigits(pred.probability)}٪</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-[#B91C1C]"
                      style={{ width: `${pred.probability}%` }}
                    ></div>
                  </div>
                </div>

                {/* Primary Scenario */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-xs font-semibold text-zinc-300">سناریوی مبنا (محتمل‌ترین مسیر):</span>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                    {pred.primary_scenario}
                  </p>
                </div>

                {/* Alternative Scenario */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-zinc-400">سناریوی جایگزین (رویداد غافلگیرکننده):</span>
                  <p className="text-xs text-zinc-500 leading-relaxed bg-zinc-900/30 p-2.5 rounded-lg border border-zinc-800/50">
                    {pred.alternative_scenario}
                  </p>
                </div>

                {/* Trigger Events */}
                {pred.trigger_events && pred.trigger_events.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                    <span className="text-xs text-zinc-400 font-medium">ماشه‌های شتاب‌دهنده بحران:</span>
                    <ul className="space-y-1 text-xs text-zinc-400">
                      {pred.trigger_events.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#B91C1C] mt-0.5">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-zinc-600 font-mono pt-3 border-t border-zinc-800/50">
                تاریخ ثبت برآورد: {pred.created_at}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
