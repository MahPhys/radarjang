// Persian number conversion and formatting utilities

export function toPersianDigits(num: number | string): string {
  if (num === null || num === undefined) return '';
  const str = String(num);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[+w]);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '۰ بایت';
  const k = 1024;
  const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const val = parseFloat((bytes / Math.pow(k, i)).toFixed(1));
  return `${toPersianDigits(val)} ${sizes[i]}`;
}

export function formatNumber(num: number): string {
  return toPersianDigits(num.toLocaleString('en-US'));
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'military':
      return 'نظامی و تسلیحاتی';
    case 'diplomatic':
      return 'دیپلماتیک و سیاسی';
    case 'economic':
      return 'اقتصادی و تحریم';
    case 'intelligence':
      return 'اطلاعاتی و امنیتی';
    default:
      return 'عمومی';
  }
}

export function getCategoryColor(category: string): { bg: string; text: string; border: string } {
  switch (category) {
    case 'military':
      return { bg: 'bg-red-950/40', text: 'text-red-400', border: 'border-red-800/50' };
    case 'diplomatic':
      return { bg: 'bg-blue-950/40', text: 'text-blue-400', border: 'border-blue-800/50' };
    case 'economic':
      return { bg: 'bg-emerald-950/40', text: 'text-emerald-400', border: 'border-emerald-800/50' };
    case 'intelligence':
      return { bg: 'bg-amber-950/40', text: 'text-amber-400', border: 'border-amber-800/50' };
    default:
      return { bg: 'bg-zinc-900', text: 'text-zinc-400', border: 'border-zinc-800' };
  }
}

export function getSeverityBadge(severity: string): { label: string; bg: string; text: string; border: string } {
  switch (severity) {
    case 'critical':
      return { label: 'هشدار بحرانی', bg: 'bg-[#B91C1C]/15', text: 'text-[#ef4444]', border: 'border-[#B91C1C]/40' };
    case 'medium':
      return { label: 'سطح متوسط', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' };
    case 'low':
      return { label: 'نظارتی عادی', bg: 'bg-zinc-800/60', text: 'text-zinc-400', border: 'border-zinc-700/50' };
    default:
      return { label: 'عادی', bg: 'bg-zinc-800/50', text: 'text-zinc-400', border: 'border-zinc-700/50' };
  }
}
