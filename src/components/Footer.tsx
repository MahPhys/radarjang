import React from 'react';
import { Terminal, Shield, Activity } from 'lucide-react';

interface FooterProps {
  channelName: string;
  totalMessages: number;
}

export const Footer: React.FC<FooterProps> = ({ channelName, totalMessages }) => {
  return (
    <footer className="h-10 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center px-4 md:px-6 text-[10px] md:text-[11px] font-mono text-slate-400 justify-between select-none shrink-0 z-10 gap-2">
      <div className="flex items-center gap-2 text-slate-300">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        <span className="text-amber-500 font-bold">LOG:</span>
        <span className="text-slate-300 truncate">Bot API Channel Listener active @ UTC 11:15:00... OK</span>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-slate-400">
        <span className="text-slate-500">منبع داده:</span>
        <span className="text-amber-400 font-bold">{channelName}</span>
        <span className="text-slate-600">(شناسه پیام: {totalMessages.toLocaleString()})</span>
      </div>

      <div className="flex items-center gap-3 text-slate-400">
        <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
          MEM: <strong className="text-slate-200">412 MB</strong>
        </span>
        <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
          CPU: <strong className="text-slate-200">4.2%</strong>
        </span>
      </div>
    </footer>
  );
};
