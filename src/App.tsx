import React, { useState, useEffect } from 'react';
import { dbStore } from './data/dbStore';
import { 
  NewsItem, 
  AnalysisItem, 
  PredictionItem, 
  SiteSettings, 
  ApiUsageLog, 
  R2FileItem, 
  AdminStats 
} from './types';

// Public Components
import { Navbar } from './components/public/Navbar';
import { PublicFooter } from './components/public/PublicFooter';
import { HomePage } from './components/public/HomePage';
import { AnalysisListPage } from './components/public/AnalysisListPage';
import { AnalysisDetailPage } from './components/public/AnalysisDetailPage';
import { PredictionsPage } from './components/public/PredictionsPage';
import { AboutPage } from './components/public/AboutPage';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ManageNews } from './components/admin/ManageNews';
import { ManageAnalyses } from './components/admin/ManageAnalyses';
import { ManagePredictions } from './components/admin/ManagePredictions';
import { ManageSettings } from './components/admin/ManageSettings';
import { ManageR2Uploads } from './components/admin/ManageR2Uploads';
import { ManageApiLogs } from './components/admin/ManageApiLogs';

export default function App() {
  // DB State synced from local D1 store
  const [settings, setSettings] = useState<SiteSettings>(() => dbStore.getSettings());
  const [news, setNews] = useState<NewsItem[]>(() => dbStore.getNews());
  const [analyses, setAnalyses] = useState<AnalysisItem[]>(() => dbStore.getAnalyses());
  const [predictions, setPredictions] = useState<PredictionItem[]>(() => dbStore.getPredictions());
  const [apiLogs, setApiLogs] = useState<ApiUsageLog[]>(() => dbStore.getApiLogs());
  const [r2Files, setR2Files] = useState<R2FileItem[]>(() => dbStore.getR2Files());
  const [stats, setStats] = useState<AdminStats>(() => dbStore.getStats());

  // Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    return p && p !== '' ? p : '/';
  });

  // Admin Tab State
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => dbStore.isAuthenticated());

  // Refresh helper
  const refreshDbState = () => {
    setSettings(dbStore.getSettings());
    setNews(dbStore.getNews());
    setAnalyses(dbStore.getAnalyses());
    setPredictions(dbStore.getPredictions());
    setApiLogs(dbStore.getApiLogs());
    setR2Files(dbStore.getR2Files());
    setStats(dbStore.getStats());
    setIsAuthenticated(dbStore.isAuthenticated());
  };

  // Synchronize Browser URL
  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check if viewing a single analysis detail (/analysis/:id)
  const isAnalysisDetail = currentPath.startsWith('/analysis/') && currentPath.length > 10;
  const currentAnalysisId = isAnalysisDetail ? currentPath.replace('/analysis/', '') : null;
  const currentAnalysis = currentAnalysisId ? dbStore.getAnalysisById(currentAnalysisId) : null;

  // Render Admin View
  if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated) {
      return (
        <div dir="rtl" className="bg-[#0b0c10] text-[#e2e8f0] min-h-screen">
          <AdminLogin
            settings={settings}
            onSuccess={() => {
              setIsAuthenticated(true);
              refreshDbState();
            }}
            onBackToSite={() => navigate('/')}
          />
        </div>
      );
    }

    return (
      <div dir="rtl" className="bg-[#0b0c10] text-[#e2e8f0] min-h-screen">
        <AdminLayout
          activeTab={adminTab}
          onTabChange={setAdminTab}
          settings={settings}
          onLogout={() => {
            dbStore.logout();
            setIsAuthenticated(false);
            navigate('/');
          }}
          onBackToSite={() => navigate('/')}
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              stats={stats}
              analyses={analyses}
              news={news}
              predictions={predictions}
              onNavigateTab={setAdminTab}
            />
          )}
          {adminTab === 'news' && (
            <ManageNews news={news} onRefresh={refreshDbState} />
          )}
          {adminTab === 'analyses' && (
            <ManageAnalyses analyses={analyses} onRefresh={refreshDbState} />
          )}
          {adminTab === 'predictions' && (
            <ManagePredictions predictions={predictions} onRefresh={refreshDbState} />
          )}
          {adminTab === 'settings' && (
            <ManageSettings settings={settings} onRefresh={refreshDbState} />
          )}
          {adminTab === 'uploads' && (
            <ManageR2Uploads files={r2Files} onRefresh={refreshDbState} />
          )}
          {adminTab === 'api_logs' && (
            <ManageApiLogs logs={apiLogs} />
          )}
        </AdminLayout>
      </div>
    );
  }

  // Render Public Website Views
  return (
    <div dir="rtl" className="bg-[#0f1117] text-[#e2e8f0] min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentPath={currentPath}
        onNavigate={navigate}
        settings={settings}
        isAuthenticated={isAuthenticated}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {isAnalysisDetail && currentAnalysis ? (
          <AnalysisDetailPage
            analysis={currentAnalysis}
            allNews={news}
            onBack={() => navigate('/analysis')}
          />
        ) : currentPath === '/analysis' ? (
          <AnalysisListPage
            analyses={analyses}
            onSelectAnalysis={(id) => navigate(`/analysis/${id}`)}
          />
        ) : currentPath === '/predictions' ? (
          <PredictionsPage predictions={predictions} />
        ) : currentPath === '/about' ? (
          <AboutPage settings={settings} onNavigate={navigate} />
        ) : (
          <HomePage
            settings={settings}
            analyses={analyses}
            news={news}
            predictions={predictions}
            onNavigate={navigate}
          />
        )}
      </main>

      {/* Public Footer */}
      <PublicFooter settings={settings} onNavigate={navigate} />
    </div>
  );
}
