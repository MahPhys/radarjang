import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  Check, 
  RotateCcw, 
  Palette, 
  Type, 
  Radio, 
  Mail, 
  Send, 
  Bell 
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { dbStore, DEFAULT_SITE_SETTINGS } from '../../data/dbStore';

interface ManageSettingsProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const ManageSettings: React.FC<ManageSettingsProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dbStore.updateSettings(formData);
    setSavedSuccess(true);
    onRefresh();
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (window.confirm('آیا از بازگردانی تنظیمات به مقادیر پیش‌فرض اطمینان دارید؟')) {
      dbStore.updateSettings(DEFAULT_SITE_SETTINGS);
      setFormData({ ...DEFAULT_SITE_SETTINGS });
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">تنظیمات تارنما و هویت بصری (جدول site_settings)</h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            شخصی‌سازی نام سایت، تیترها، پالت رنگی (#B91C1C) و نوار اطلاعیه فوری
          </p>
        </div>
        <button
          onClick={handleResetDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>بازنشانی پیش‌فرض</span>
        </button>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-400 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>تنظیمات با موفقیت در پایگاه داده ذخیره شد و در کل تارنما اعمال گردید.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="border border-zinc-800 bg-[#12141c] rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* General Branding Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Radio className="w-4 h-4 text-[#B91C1C]" />
            <span>هویت و عناوین اصلی</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">نام سایت (Site Name)</label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                required
                className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">شعار یا زیرعنوان سایت</label>
              <input
                type="text"
                value={formData.site_title}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                required
                className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">تیتر بخش قهرمان صفحه اصلی (Hero Title)</label>
            <input
              type="text"
              value={formData.hero_title}
              onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
              required
              className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">متن توضیح بخش قهرمان (Hero Subtitle)</label>
            <textarea
              value={formData.hero_subtitle}
              onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
              required
              rows={3}
              className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
            />
          </div>
        </div>

        {/* Accent Color & Visual Design */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Palette className="w-4 h-4 text-[#B91C1C]" />
            <span>پالت رنگی و تایپوگرافی (طبق مشخصات پروژه)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">رنگ شاخص و نشانه (Accent Color)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                  className="w-10 h-10 rounded border border-zinc-700 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={formData.accent_color}
                  onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                  className="flex-1 p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono text-white"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accent_color: '#B91C1C' })}
                  className="px-2.5 py-2 text-xs bg-zinc-800 rounded hover:bg-zinc-700 text-zinc-300"
                >
                  قرمز راهبردی (#B91C1C)
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">فونت سازمانی</label>
              <div className="flex items-center gap-2 p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white">
                <Type className="w-4 h-4 text-zinc-400" />
                <span className="font-bold">وزیرمتن (Vazirmatn)</span>
                <span className="text-[10px] text-zinc-500 font-mono mr-auto">الزام سخت پروژه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Banner */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>نوار اطلاعیه فوری بالای تارنما</span>
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="announcement_active"
              checked={formData.announcement_active}
              onChange={(e) => setFormData({ ...formData, announcement_active: e.target.checked })}
              className="w-4 h-4 accent-[#B91C1C] rounded cursor-pointer"
            />
            <label htmlFor="announcement_active" className="text-xs font-medium text-zinc-300 cursor-pointer">
              نمایش نوار هشدار یا اطلاعیه قرمز در بالای تمام صفحات
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">متن اطلاعیه</label>
            <input
              type="text"
              value={formData.announcement_text}
              onChange={(e) => setFormData({ ...formData, announcement_text: e.target.value })}
              placeholder="مثال: گزارش فوری: توازن بازدارندگی در تنگه هرمز منتشر شد..."
              className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-[#B91C1C]"
            />
          </div>
        </div>

        {/* Communication & Footer */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Mail className="w-4 h-4 text-blue-400" />
            <span>راه‌های ارتباطی و پاورقی</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">ایمیل ارتباطی تحریریه</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono text-white text-left"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">شناسه کانال تلگرام</label>
              <input
                type="text"
                value={formData.telegram_channel}
                onChange={(e) => setFormData({ ...formData, telegram_channel: e.target.value })}
                className="w-full p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono text-white text-left"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">متن کپی‌رایت پاورقی</label>
            <input
              type="text"
              value={formData.footer_text}
              onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
              className="w-full p-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#B91C1C] hover:bg-[#991b1b] text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>ذخیره کلیه تنظیمات در D1</span>
          </button>
        </div>
      </form>
    </div>
  );
};
