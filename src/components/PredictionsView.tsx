import React from 'react';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, Target, ArrowRight } from 'lucide-react';
import { PredictionScenario } from '../types';

interface PredictionsViewProps {
  predictions: PredictionScenario[];
}

export const PredictionsView: React.FC<PredictionsViewProps> = ({ predictions }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0b0e] overflow-y-auto p-4 md:p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-5 bg-amber-500 rounded-sm"></div>
          <h2 className="text-base md:text-lg font-bold text-slate-100">
            سناریوهای آینده‌پژوهی و پیش‌بینی چندزمانه
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          تولید شده توسط عامل Synthesis و Historian با اتکا به مدل‌های پیش‌بینی منازعه
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((pred) => (
          <div
            key={pred.id}
            className="bg-[#11141b] border border-slate-800 rounded-lg p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                  افق زمانی: {pred.timeframe}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  ثبت: {pred.generatedAt}
                </span>
              </div>

              <h3 className="text-sm md:text-base font-bold text-slate-100 mb-3">
                {pred.topic}
              </h3>

              {/* Primary Scenario */}
              <div className="p-3 bg-[#0d0f14] border-r-2 border-emerald-500 rounded mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    سناریوی محتمل اصلی
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {pred.probability}٪
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {pred.primaryOutcome}
                </p>
              </div>

              {/* Alternative Scenario */}
              <div className="p-3 bg-[#0d0f14] border-r-2 border-amber-500/60 rounded mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400/90 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    سناریوی جایگزین / شوک
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {100 - pred.probability}٪
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pred.alternativeOutcome}
                </p>
              </div>

              {/* Key Indicators */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Target className="w-3 h-3 text-amber-500" />
                  شاخص‌های راستی‌آزمایی (Key Indicators):
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {pred.indicators.map((ind, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-800/80 text-slate-300 border border-slate-700/50 px-2 py-1 rounded"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
