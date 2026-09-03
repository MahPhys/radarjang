import React, { useState } from 'react';
import { 
  Cpu, 
  Search, 
  Filter, 
  DollarSign, 
  Activity, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { ApiUsageLog, LLMProvider } from '../../types';
import { formatNumber, toPersianDigits } from '../../utils/formatters';

interface ManageApiLogsProps {
  logs: ApiUsageLog[];
}

export const ManageApiLogs: React.FC<ManageApiLogsProps> = ({ logs }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  const filteredLogs = logs.filter(l => {
    if (selectedProvider === 'all') return true;
    return l.provider === selectedProvider;
  });

  const totalTokens = filteredLogs.reduce((acc, l) => acc + l.total_tokens, 0);
  const totalCost = filteredLogs.reduce((acc, l) => acc + l.estimated_cost, 0);

  const getProviderBadge = (provider: LLMProvider) => {
    switch (provider) {
      case 'xai':
        return { label: 'xAI Grok', color: 'bg-zinc-800 text-white border-zinc-700' };
      case 'groq':
        return { label: 'Groq Cloud', color: 'bg-orange-950/50 text-orange-400 border-orange-800/40' };
      case 'google':
        return { label: 'Google Gemini', color: 'bg-blue-950/50 text-blue-400 border-blue-800/40' };
      case 'openai':
        return { label: 'OpenAI GPT', color: 'bg-emerald-950/50 text-emerald-400 border-emerald-800/40' };
      default:
        return { label: provider, color: 'bg-zinc-800 text-zinc-300' };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">گزارش مصرف مدل‌های زبانی (جدول api_usage)</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            ردیابی توکن‌ها و برآورد هزینه‌های استخراج و خلاصه‌سازی هوشمند ژئوپلیتیک (xAI، Groq، Google، OpenAI)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>کل هزینه تخمینی: ${totalCost.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#12141c] space-y-1">
          <div className="text-xs text-zinc-500 font-mono">درخواست‌های ثبت‌شده</div>
          <div className="text-xl font-bold text-white">{toPersianDigits(filteredLogs.length)} فراخوانی</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#12141c] space-y-1">
          <div className="text-xs text-zinc-500 font-mono">مجموع توکن‌های مصرفی</div>
          <div className="text-xl font-bold text-emerald-400 font-mono">{formatNumber(totalTokens)}</div>
        </div>
        <div className="p-4 rounded-xl border border-zinc-800 bg-[#12141c] space-y-1">
          <div className="text-xs text-zinc-500 font-mono">مدل پیش‌فرض اصلی</div>
          <div className="text-base font-bold text-zinc-200 font-mono">grok-4.3-latest (xAI)</div>
        </div>
      </div>

      {/* Provider Filter Tabs */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl p-4 flex items-center gap-2 overflow-x-auto">
        <span className="text-xs text-zinc-400 ml-2 shrink-0">ارائه‌دهنده:</span>
        {[
          { id: 'all', label: 'همه سرویس‌ها' },
          { id: 'xai', label: 'xAI (Grok)' },
          { id: 'groq', label: 'Groq (Llama)' },
          { id: 'google', label: 'Google (Gemini)' },
          { id: 'openai', label: 'OpenAI (GPT-4o)' },
        ].map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProvider(p.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
              selectedProvider === p.id
                ? 'bg-[#B91C1C] text-white'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="border border-zinc-800 bg-[#12141c] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-mono text-[11px]">
              <tr>
                <th className="p-3 sm:p-4">سرویس</th>
                <th className="p-3 sm:p-4">مدل</th>
                <th className="p-3 sm:p-4">توکن ورودی</th>
                <th className="p-3 sm:p-4">توکن خروجی</th>
                <th className="p-3 sm:p-4">مجموع توکن</th>
                <th className="p-3 sm:p-4">هزینه (USD)</th>
                <th className="p-3 sm:p-4">اندپوینت</th>
                <th className="p-3 sm:p-4">زمان ثبت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono text-xs">
              {filteredLogs.map((log) => {
                const badge = getProviderBadge(log.provider);
                return (
                  <tr key={log.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="p-3 sm:p-4 font-sans">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-zinc-300 font-semibold">
                      {log.model}
                    </td>
                    <td className="p-3 sm:p-4 text-zinc-400">
                      {formatNumber(log.prompt_tokens)}
                    </td>
                    <td className="p-3 sm:p-4 text-zinc-400">
                      {formatNumber(log.completion_tokens)}
                    </td>
                    <td className="p-3 sm:p-4 text-white font-bold">
                      {formatNumber(log.total_tokens)}
                    </td>
                    <td className="p-3 sm:p-4 text-emerald-400">
                      ${log.estimated_cost.toFixed(4)}
                    </td>
                    <td className="p-3 sm:p-4 text-zinc-500">
                      {log.endpoint}
                    </td>
                    <td className="p-3 sm:p-4 text-zinc-400 font-sans text-[11px]">
                      {log.created_at}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
