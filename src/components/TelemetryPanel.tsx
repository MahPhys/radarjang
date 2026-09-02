import React from 'react';
import { 
  BarChart3, 
  Database, 
  AlertTriangle, 
  Cpu, 
  Coins, 
  Layers, 
  Flame, 
  Activity,
  Terminal,
  Radio
} from 'lucide-react';
import { SystemMetrics, LogMessage } from '../types';

interface TelemetryPanelProps {
  metrics: SystemMetrics;
  logs: LogMessage[];
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ metrics, logs }) => {
  const tokenPercent = Math.min(100, Math.round((metrics.todayTokens / metrics.tokenBudget) * 100));

  return (
    <aside className="border-r border-slate-800 bg-[#0d0f14] p-4 md:p-6 space-y-6 select-none shrink-0 h-full overflow-y-auto w-full">
      {/* API Resource Consumption */}
      <div>
        <h3 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            مصرف منابع و سهمیه API
          </span>
          <span className="text-[10px] text-amber-400 font-mono">{tokenPercent}٪</span>
        </h3>

        <div className="space-y-3 bg-[#11141b] p-3.5 rounded-lg border border-slate-800">
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-slate-400">توکن‌های مصرفی (امروز)</span>
            <span className="text-xs font-mono font-bold text-slate-200">
              {metrics.todayTokens.toLocaleString()} / {metrics.tokenBudget.toLocaleString()}
            </span>
          </div>

          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              style={{ width: `${tokenPercent}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/80">
            <div className="bg-slate-800/30 p-2 border border-slate-700/50 rounded text-center">
              <div className="text-[10px] font-mono text-slate-400">GPT-4o</div>
              <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">${metrics.gptCost.toFixed(2)}</div>
            </div>
            <div className="bg-slate-800/30 p-2 border border-slate-700/50 rounded text-center">
              <div className="text-[10px] font-mono text-slate-400">Claude-3.5</div>
              <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">${metrics.claudeCost.toFixed(2)}</div>
            </div>
            <div className="bg-slate-800/30 p-2 border border-slate-700/50 rounded text-center">
              <div className="text-[10px] font-mono text-slate-400">Gemini Pro</div>
              <div className="text-xs font-mono font-bold text-slate-200 mt-0.5">${metrics.geminiCost.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Database & RAG Status */}
      <div>
        <h3 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-amber-500" />
          وضعیت پایگاه داده و بردارها
        </h3>

        <div className="space-y-2.5 font-mono text-xs bg-[#11141b] p-3.5 rounded-lg border border-slate-800">
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400 font-sans text-xs">جدول اخبار (News):</span>
            <span className="text-slate-200 font-bold">{metrics.totalNews.toLocaleString()} رکورد</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400 font-sans text-xs">پایگاه برداری ChromaDB:</span>
            <span className="text-amber-400 font-bold">{metrics.chromaVectors.toLocaleString()} بردار</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400 font-sans text-xs">وضعیت پایش (Backfill):</span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">تکمیل شده</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400 font-sans text-xs">آخرین دریافت Bot API:</span>
            <span className="text-slate-300">{metrics.lastFetch}</span>
          </div>
        </div>
      </div>

      {/* Radar Tactical Alert Box */}
      <div className="p-4 bg-amber-500/5 border border-amber-500/30 rounded-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1.5 h-full bg-amber-500"></div>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h4 className="text-xs font-bold text-amber-400">هشدار زودهنگام رادار</h4>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
          تراکم سیگنال‌های نظامی و هوانوردی در منطقه خلیج فارس طی ۲ ساعت اخیر ۴۸۰٪ افزایش یافته است. پیشنهاد اجرای فرمان <code className="text-amber-400 font-mono">/analyze</code> روی داده‌های مکران.
        </p>
      </div>

      {/* Live System Logs stream */}
      <div>
        <h3 className="text-[10px] uppercase font-mono tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-500" />
          لاگ‌های زنده عامل‌های هوش مصنوعی
        </h3>
        <div className="bg-[#090a0d] border border-slate-800 rounded p-3 font-mono text-[10px] text-slate-400 space-y-1.5 max-h-36 overflow-y-auto">
          {logs.slice(-4).map((log) => (
            <div key={log.id} className="flex items-start gap-1.5 leading-tight">
              <span className="text-slate-600 shrink-0">{log.timestamp}</span>
              <span className={`px-1 py-0.2 rounded text-[9px] shrink-0 font-bold ${
                log.level === 'EXEC' ? 'bg-amber-500/20 text-amber-400' :
                log.level === 'AGENT' ? 'bg-cyan-500/20 text-cyan-400' :
                'bg-slate-800 text-slate-400'
              }`}>
                {log.level}
              </span>
              <span className="text-slate-300 truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
