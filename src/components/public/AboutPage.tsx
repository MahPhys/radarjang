import React from 'react';
import { 
  Radio, 
  Shield, 
  CheckCircle2, 
  Database, 
  Cpu, 
  FileCheck, 
  Send, 
  Mail, 
  Lock 
} from 'lucide-react';
import { SiteSettings } from '../../types';

interface AboutPageProps {
  settings: SiteSettings;
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-zinc-800 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono">
          <span>درباره دیدبان رادار جنگ</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          مرام‌نامه و روش‌شناسی تحلیلی «رادار جنگ»
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
          دیدبان تخصصی و غیروابسته برای رصد شواهد اطلاعاتی، تحرکات نظامی منطقه‌ای و توازن راهبردی میان ایران و ایالات متحده آمریکا.
        </p>
      </div>

      {/* Mission & Purpose */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#B91C1C] rounded-sm"></span>
          <span>هدف و مأموریت راهبردی</span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          فضای رسانه‌ای پیرامون منازعات خاورمیانه و روابط واشنگتن–تهران همواره آکنده از جنگ روانی، بیانیه‌های اغراق‌آمیز تبلیغاتی و گزارش‌های سوگیرانه است. رسالت «رادار جنگ» ایجاد بستری مستقل، مستند و مبتنی بر شواهد متقاطع برای پالایش اطلاعات خام، تفکیک ژست‌های سیاسی از تحرکات واقعی میدانی و ارائه برآوردهای منطقی و قابل‌اتکاست.
        </p>
      </section>

      {/* Methodology Pipeline */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#B91C1C] rounded-sm"></span>
          <span>متدولوژی اعتبارسنجی چندلایه</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border border-zinc-800 bg-[#12131c] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Database className="w-4 h-4 text-red-400" />
              <span>۱. تجمیع شواهد چندگانه (Multi-Source OSINT)</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              بررسی هم‌زمان داده‌های رهگیری شناوری و هوایی، بیانیه‌های پنتاگون و ستاد کل نیروهای مسلح، گزارش‌های اندیشکده‌ها و اسناد تحریمی خزانه‌داری.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-[#12131c] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>۲. پردازش هوشمند و سنتز مفهومی (xAI Grok)</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              استخراج گزاره‌های دارای ارزش استراتژیک، حذف محتواهای تکراری و جنگ روانی توسط موتور تحلیل ساختاریافته xAI Grok.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-[#12131c] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <FileCheck className="w-4 h-4 text-blue-400" />
              <span>۳. تطبیق با عبرت‌های تاریخی</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              مقایسه رویدادهای جاری با بحران‌های مشابه گذشته (از سال ۱۹۷۹ تا دوران معاصر) جهت پیش‌بینی دقیق‌تر رفتار بازیگران در شرایط اضطراری.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-zinc-800 bg-[#12131c] space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>۴. تحلیل متقابل (Red-Teaming)</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              به چالش کشیدن فرضیات اولیه از طریق تولید سناریوهای آلترناتیو برای جلوگیری از خطای تعصب شناختی و خوش‌بینی یا بدبینی کاذب.
            </p>
          </div>
        </div>
      </section>

      {/* Vercel & PostgreSQL Cloud Architecture */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-4 bg-[#B91C1C] rounded-sm"></span>
          <span>معماری فنی و زیرساخت ابری</span>
        </h2>
        <div className="p-5 sm:p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3 text-sm text-zinc-300 leading-relaxed">
          <p>
            تارنمای رادار جنگ برای تضمین حداکثر سرعت، پایداری بالا و مقیاس‌پذیری جهانی، بر بستر زیرساخت مدرن Vercel و پایگاه داده رابطه‌ای قدرتمند PostgreSQL پیاده‌سازی گردیده است:
          </p>
          <ul className="space-y-1.5 list-disc list-inside text-xs sm:text-sm text-zinc-400">
            <li><strong>Vercel Edge Network:</strong> استقرار جهانی با شبکه تحویل محتوای فوق سریع (Global CDN) و معماری بدون سرور (Serverless).</li>
            <li><strong>PostgreSQL Database:</strong> پایگاه داده ساختاریافته رابطه‌ای مبتنی بر استاندارد Prisma/SQL برای ثبت امن اخبار، تحلیل‌ها و سناریوها.</li>
            <li><strong>Media & Asset Pipeline:</strong> پشتیبانی از توزیع بهینه تصاویر و نقشه‌های ماهواره‌ای با ساختار Static Public و CDNهای ابری نظیر Cloudinary.</li>
          </ul>
        </div>
      </section>

      {/* Editorial Independence & Contact */}
      <section className="p-6 rounded-xl border border-zinc-800 bg-[#12131b] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-right">
          <h3 className="text-base font-bold text-white">ارتباط با هیئت تحریریه و ارسال گزارش‌های تکمیلی</h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            پژوهشگران و ناظران بین‌المللی می‌توانند ارزیابی‌ها و گزارش‌های میدانی خود را از طریق کانال‌های امن برای ما ارسال نمایند.
          </p>
          <div className="text-xs text-zinc-500 pt-1">
            ایمیل: <span className="font-mono text-zinc-300">{settings.contact_email}</span> | تلگرام: <span className="font-mono text-zinc-300">{settings.telegram_channel}</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/admin')}
          className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs sm:text-sm text-zinc-200 border border-zinc-700 flex items-center gap-1.5 shrink-0"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>ورود تحریریه (Admin)</span>
        </button>
      </section>
    </div>
  );
};
