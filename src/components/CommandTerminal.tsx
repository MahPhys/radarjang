import React, { useState } from 'react';
import { 
  Terminal as TerminalIcon, 
  Send, 
  Play, 
  CheckCircle, 
  Loader2, 
  Database, 
  BrainCircuit, 
  Shield, 
  Clock,
  Sparkles
} from 'lucide-react';
import { AnalysisRecord } from '../types';

interface CommandTerminalProps {
  onAddAnalysis: (record: AnalysisRecord) => void;
  executedCommand: string;
}

interface StepProgress {
  agent: string;
  role: string;
  status: 'pending' | 'running' | 'done';
  detail: string;
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({ onAddAnalysis, executedCommand }) => {
  const [inputCommand, setInputCommand] = useState(executedCommand || '/analyze تنش در خلیج فارس');
  const [isRunning, setIsRunning] = useState(false);
  const [outputLogs, setOutputLogs] = useState<string[]>([
    'سیستم تلگرام دیدبان جنگ (Radar-e-Jang Bot v1.0.4-PROD) آماده دریافت فرامین است.',
    'برای شروع یکی از فرامین /analyze، /predict یا /status را وارد نمایید.',
  ]);

  const [pipelineSteps, setPipelineSteps] = useState<StepProgress[]>([
    { agent: 'Fetcher Agent', role: 'گردآوری پیام‌ها از کانال @databaseradarj', status: 'done', detail: '۱۲۵,۱۰۲ پیام خوانده شد' },
    { agent: 'Classifier Agent', role: 'تحلیل اولویت و دسته‌بندی موضوعی', status: 'done', detail: 'سطح فوریت: HIGH' },
    { agent: 'Analyst & Historian', role: 'استخراج داده‌های RAG از ChromaDB', status: 'done', detail: '۴ بردار متناظر با شباهت ۰.۸۴' },
    { agent: 'Synthesis Agent', role: 'سنتز چندعاملی با Claude-3.5 و فرمت‌بندی تلگرام', status: 'done', detail: 'تولید گزارش با ۲,۱۸۰ توکن' },
  ]);

  const handleRunCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCommand.trim() || isRunning) return;

    setIsRunning(true);
    const cmd = inputCommand.trim();

    setOutputLogs((prev) => [
      ...prev,
      `\n❯ ${cmd} [کاربر ID: 8936968493 - ادمین]`,
      `[Fetcher] در حال ارزیابی کانال @databaseradarj...`
    ]);

    setPipelineSteps([
      { agent: 'Fetcher Agent', role: 'گردآوری پیام‌ها از کانال', status: 'running', detail: 'ارتباط Bot API برقرار شد' },
      { agent: 'Classifier Agent', role: 'تحلیل اولویت و دسته‌بندی موضوعی', status: 'pending', detail: 'در انتظار خروجی Fetcher' },
      { agent: 'Analyst & Historian', role: 'استخراج داده‌های RAG از ChromaDB', status: 'pending', detail: 'آماده‌سازی پرس‌وجو' },
      { agent: 'Synthesis Agent', role: 'سنتز چندعاملی و دیدگاه جایگزین', status: 'pending', detail: 'انتخاب مدل زبانی' },
    ]);

    // Simulated pipeline delay
    setTimeout(() => {
      setPipelineSteps((prev) => [
        { ...prev[0], status: 'done', detail: '۳ خبر جدید در حوزه تنش دریایی شناسایی شد' },
        { ...prev[1], status: 'running', detail: 'طبقه‌بندی اولویت: نظامی / بحرانی' },
        prev[2],
        prev[3]
      ]);
    }, 700);

    setTimeout(() => {
      setPipelineSteps((prev) => [
        prev[0],
        { ...prev[1], status: 'done', detail: 'اولویت: HIGH (امتیاز ۹۵/۱۰۰)' },
        { ...prev[2], status: 'running', detail: 'بازیابی تطبیق‌های تاریخی سال ۲۰۱۹ و ۲۰۲۱' },
        prev[3]
      ]);
    }, 1400);

    setTimeout(() => {
      setPipelineSteps((prev) => [
        prev[0],
        prev[1],
        { ...prev[2], status: 'done', detail: 'تطبیق بحران تنگه هرمز در ژوئن ۲۰۱۹ بازیابی شد' },
        { ...prev[3], status: 'running', detail: 'ترکیب گزارش با Claude-3.5 Sonnet' },
      ]);
    }, 2100);

    setTimeout(() => {
      setPipelineSteps((prev) => [
        prev[0],
        prev[1],
        prev[2],
        { ...prev[3], status: 'done', detail: 'سنتز نهایی تکمیل و در تلگرام ارسال شد.' },
      ]);

      const newAnalysis: AnalysisRecord = {
        id: `an-${Date.now().toString().slice(-4)}`,
        title: `تحلیل فوری: ${cmd.replace(/^\/[a-z]+\s*/, '') || 'پایش تحرکات پیرامونی'}`,
        category: 'military',
        severity: 'critical',
        channel: '@databaseradarj',
        timestamp: new Date().toLocaleTimeString('fa-IR'),
        timeAgo: 'هم‌اکنون',
        summary: 'ارزیابی خط لوله چندعاملی نشان‌دهنده تقویت تدابیر پیشگیرانه و مانورهای موشکی محدود جهت تثبیت موازنه وحشت در منطقه است.',
        historicalPrecedent: 'تطبیق با اقدامات بازدارنده بحران ۲۰۱۹؛ هرگونه سیگنال‌دهی مستقیم با پاسخ متقارن هدایت خواهد شد.',
        counterAnalysis: 'دیدگاه جایگزین: هدف‌گذاری اصلی تحرکات، جلب حمایت منطقه‌ای در آستانه نشست آژانس بین‌المللی انرژی اتمی است.',
        model: 'Claude-3.5 Sonnet',
        confidence: 96,
        tokensUsed: 2240,
        tags: ['پایش فوری', 'خلیج فارس', 'RAG'],
        newsSourcesCount: 4
      };

      onAddAnalysis(newAnalysis);

      setOutputLogs((prev) => [
        ...prev,
        `[Classifier] اولویت پیام: بحرانی (نظامی)`,
        `[ChromaDB] ۴ بردار امبدینگ bge-m3 با شباهت ۰.۸۴ بازیابی شد.`,
        `[Synthesis] تحلیل جامع با موفقیت آماده و منتشر شد (شناسه سند: ${newAnalysis.id}).`
      ]);

      setIsRunning(false);
    }, 2800);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0b0e] overflow-hidden p-4 md:p-6 gap-4">
      {/* Terminal Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-100">
            شبیه‌ساز بلادرنگ خط لوله تلگرام و هوش چندعاملی
          </h2>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Agent Pipeline: READY
        </span>
      </div>

      {/* Agents Multi-Step Progress Visualizer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pipelineSteps.map((step, idx) => (
          <div
            key={idx}
            className={`p-3 rounded border transition-all ${
              step.status === 'running'
                ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                : step.status === 'done'
                ? 'bg-[#11141b] border-slate-800'
                : 'bg-[#0d0f14] border-slate-900 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-200">{step.agent}</span>
              {step.status === 'running' && <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
              {step.status === 'done' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400 mb-1">{step.role}</p>
            <span className="text-[10px] font-mono text-amber-500/90 block bg-slate-900/60 p-1 rounded">
              {step.detail}
            </span>
          </div>
        ))}
      </div>

      {/* Terminal Log Output Window */}
      <div className="flex-1 bg-[#090a0d] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 overflow-y-auto space-y-2 radar-grid">
        <div className="text-slate-500 border-b border-slate-800 pb-2 text-[11px] flex justify-between">
          <span>CONSOLE LOG STREAM (PTY: /dev/pts/1)</span>
          <span>ENCODING: UTF-8</span>
        </div>
        {outputLogs.map((log, idx) => (
          <div key={idx} className="leading-relaxed whitespace-pre-wrap">
            {log.startsWith('❯') ? (
              <span className="text-amber-400 font-bold">{log}</span>
            ) : log.includes('INFO') ? (
              <span className="text-slate-400">{log}</span>
            ) : log.includes('Synthesis') || log.includes('Classifier') ? (
              <span className="text-emerald-400">{log}</span>
            ) : (
              <span>{log}</span>
            )}
          </div>
        ))}
      </div>

      {/* Command Input Bar */}
      <form onSubmit={handleRunCommand} className="flex gap-2 shrink-0">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder="دستور تلگرام یا موضوع تحلیل را وارد کنید (مثال: /analyze تنش در مکران)"
            className="w-full bg-[#11141b] text-slate-100 text-xs px-4 py-3 rounded border border-slate-800 focus:outline-none focus:border-amber-500 transition-colors font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={isRunning}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded text-xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              در حال پردازش خط لوله...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              اجرای دستور
            </>
          )}
        </button>
      </form>
    </div>
  );
};
