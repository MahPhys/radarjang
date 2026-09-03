import React from 'react';
import { Radio, Mail, Send, ShieldAlert, ArrowUp } from 'lucide-react';
import { SiteSettings } from '../../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const PublicFooter: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-800/80 bg-[#0b0c10] text-zinc-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* Brand Col */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-[#B91C1C]">
              <Radio className="w-4 h-4" />
            </div>
            <span className="text-white font-bold text-lg">{settings.site_name}</span>
          </div>
          <p className="text-sm leading-relaxed text-zinc-400 max-w-md">
            {settings.site_title}. تحلیل مستقل شواهد اطلاعاتی، رصد تحرکات نظامی منطقه‌ای و واکاوی موازنه قدرت بین ایران و ایالات متحده آمریکا.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs text-zinc-500 font-mono">
            <span>نسخه ۴.۳ ژئوپلیتیک</span>
            <span>•</span>
            <span>بومی‌سازی Cloudflare Pages & D1</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            بخش‌های تارنما
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button 
                onClick={() => onNavigate('/')} 
                className="hover:text-white transition-colors"
              >
                صفحه نخست و آخرین وضعیت
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('/analysis')} 
                className="hover:text-white transition-colors"
              >
                بانک تحلیل‌های راهبردی
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('/predictions')} 
                className="hover:text-white transition-colors"
              >
                سناریوها و افق‌های احتمالی
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigate('/about')} 
                className="hover:text-white transition-colors"
              >
                روش‌شناسی و مرام‌نامه تحلیلی
              </button>
            </li>
          </ul>
        </div>

        {/* Communication & Admin */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            ارتباط و دسترسی
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 text-zinc-400">
              <Mail className="w-4 h-4 text-zinc-500" />
              <span>{settings.contact_email}</span>
            </li>
            <li className="flex items-center gap-2 text-zinc-400">
              <Send className="w-4 h-4 text-zinc-500" />
              <span>کانال تلگرام: {settings.telegram_channel}</span>
            </li>
            <li className="pt-2">
              <button
                onClick={() => onNavigate('/admin')}
                className="text-xs text-red-400/90 hover:text-red-300 hover:underline flex items-center gap-1.5"
              >
                <span>ورود به سامانه مدیریت محتوا (Admin Portal)</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <div>
          {settings.footer_text}
        </div>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
        >
          <span>بازگشت به بالا</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
