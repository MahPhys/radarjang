import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CommandSidebar } from './components/CommandSidebar';
import { AnalysisFeed } from './components/AnalysisFeed';
import { CommandTerminal } from './components/CommandTerminal';
import { PredictionsView } from './components/PredictionsView';
import { TelemetryPanel } from './components/TelemetryPanel';
import { Footer } from './components/Footer';
import { 
  initialSystemMetrics, 
  sampleAnalyses, 
  samplePredictions, 
  systemLogs 
} from './data/mockData';
import { Category, AnalysisRecord, SystemMetrics, LogMessage } from './types';

export default function App() {
  const [metrics, setMetrics] = useState<SystemMetrics>(initialSystemMetrics);
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>(sampleAnalyses);
  const [predictions] = useState(samplePredictions);
  const [logs, setLogs] = useState<LogMessage[]>(systemLogs);
  
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<'feed' | 'terminal' | 'predictions' | 'status'>('feed');
  const [activeCommand, setActiveCommand] = useState<string>('/analyze');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('14:45:22');

  // Live Clock (Tehran Time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tehranTime = now.toLocaleTimeString('fa-IR', {
        timeZone: 'Asia/Tehran',
        hour12: false
      });
      setCurrentTime(tehranTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        todayTokens: prev.todayTokens + Math.floor(Math.random() * 450) + 120,
        lastFetch: 'چند لحظه پیش'
      }));
      setLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour12: false }),
          level: 'INFO',
          message: 'Manual refresh triggered: Synchronized Telethon & ChromaDB state.'
        }
      ]);
      setIsRefreshing(false);
    }, 800);
  };

  const handleExecuteCommand = (cmd: string) => {
    setActiveCommand(cmd);
    if (cmd === '/predict') {
      setActiveView('predictions');
    } else if (cmd === '/analyze' || cmd === '/backfill') {
      setActiveView('terminal');
    } else {
      setActiveView('feed');
    }
  };

  const handleAddAnalysis = (newAnalysis: AnalysisRecord) => {
    setAnalyses((prev) => [newAnalysis, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      todayTokens: prev.todayTokens + newAnalysis.tokensUsed,
      totalNews: prev.totalNews + 1
    }));
  };

  return (
    <div dir="rtl" className="bg-[#0a0b0e] text-[#e2e8f0] h-screen w-screen flex flex-col font-sans overflow-hidden select-none">
      {/* Top Tactical Header */}
      <Header
        metrics={metrics}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        activeView={activeView}
        setActiveView={setActiveView}
        currentTime={currentTime}
      />

      {/* Main Grid Layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
        {/* Left/Start Sidebar: Bot Commands & Filter (col-span-3 or 2 on XL) */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2 h-full overflow-hidden">
          <CommandSidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onExecuteCommand={handleExecuteCommand}
            activeCommand={activeCommand}
          />
        </div>

        {/* Center Main Stage (col-span-6 or 7 on XL) */}
        <div className="col-span-12 md:col-span-9 lg:col-span-7 xl:col-span-7 h-full flex flex-col overflow-hidden border-x border-slate-800/80">
          {activeView === 'feed' && (
            <AnalysisFeed
              analyses={analyses}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          )}

          {activeView === 'terminal' && (
            <CommandTerminal
              onAddAnalysis={handleAddAnalysis}
              executedCommand={activeCommand}
            />
          )}

          {activeView === 'predictions' && (
            <PredictionsView predictions={predictions} />
          )}
        </div>

        {/* Right/End Sidebar: Telemetry, Tokens & RAG Status (col-span-3 on LG+) */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-3 h-full overflow-hidden">
          <TelemetryPanel metrics={metrics} logs={logs} />
        </div>
      </main>

      {/* Tactical Bottom Footer Bar */}
      <Footer
        channelName={metrics.channelName}
        totalMessages={metrics.totalNews}
      />
    </div>
  );
}
