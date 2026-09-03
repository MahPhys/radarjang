import React, { useState } from 'react';
import { Lock, Radio, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { dbStore } from '../../data/dbStore';
import { SiteSettings } from '../../types';

interface AdminLoginProps {
  settings: SiteSettings;
  onSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  settings,
  onSuccess,
  onBackToSite
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const ok = dbStore.login(password);
      setIsLoading(false);
      if (ok) {
        onSuccess();
      } else {
        setError('رمز عبور وارد شده نادرست است. (رمز پیش‌فرض جهت تست: admin123)');
      }
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md p-8 rounded-2xl border border-zinc-800 bg-[#12141c] shadow-2xl space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-[#B91C1C] mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            ورود به پنل مدیریت {settings.site_name}
          </h2>
          <p className="text-xs text-zinc-400">
            سامانه امن کنترل محتوا، تحلیل‌ها و پایگاه داده Cloudflare D1
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-300">
              رمز عبور تحریریه (Admin Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور ادمین را وارد نمایید..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-700/80 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#B91C1C]"
              required
              autoFocus
            />
          </div>

          <div className="p-2.5 rounded-md bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
            کلید پیش‌فرض جهت تست اولیه در دمو: <strong className="text-zinc-200">admin123</strong>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? 'در حال راستی‌آزمایی...' : 'ورود به داشبورد مدیریت'}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center pt-2 border-t border-zinc-800/80">
          <button
            onClick={onBackToSite}
            className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به سایت عمومی</span>
          </button>
        </div>
      </div>
    </div>
  );
};
