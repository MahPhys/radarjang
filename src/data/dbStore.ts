import { 
  NewsItem, 
  AnalysisItem, 
  PredictionItem, 
  SiteSettings, 
  ApiUsageLog, 
  MediaFileItem,
  R2FileItem, 
  AdminStats 
} from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: 'رادار جنگ',
  site_title: 'دیدبان و مرجع تحلیل ژئوپلیتیک و منازعات ایران و آمریکا',
  hero_title: 'رصد تحولات راهبردی، توازن قوا و منازعات ایران و آمریکا',
  hero_subtitle: 'دیدبان تحلیلی مستقل و تخصصی مبتنی بر تجمیع داده‌های اطلاعاتی، ارزیابی سناریوهای بحران و بررسی عبرت‌های تاریخی با استانداردهای اندیشکده‌ای.',
  accent_color: '#B91C1C',
  logo_text: 'رادار جنگ',
  announcement_text: 'گزارش راهبردی ویژه: ارزیابی استقرار سامانه‌های پدافندی و آرایش بازدارندگی متقابل منتشر شد.',
  announcement_active: true,
  contact_email: 'contact@radarejang.ir',
  telegram_channel: '@radarejang',
  footer_text: 'تمامی حقوق برای رادار جنگ محفوظ است. ارزیابی‌های مستقل و شواهد متقاطع راهبردی.',
  font_family: 'Vazirmatn',
  updated_at: '۱۴۰۳/۰۶/۱۲'
};

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-101',
    title: 'تغییر آرایش ناوگان پنجم دریایی آمریکا در تنگه هرمز و دریای عمان',
    summary: 'افزایش گشت‌های هوایی شناسایی P-8 Poseidon و ورود ناوگروه ضربت به حوزه استحفاظی سنتکام پس از پایان مانورهای مشترک.',
    content: 'بر اساس داده‌های سامانه‌های ردیابی شناوری و بیانیه‌های رسمی فرماندهی مرکزی ایالات متحده (سنتکام)، ناوگروه رزمی همراه با دو ناوشکن مجهز به سیستم دفاع موشکی ایجیس وارد آب‌های دریای عمان شدند. هم‌زمان گشت‌های هوایی شناسایی دریایی در حریم بین‌المللی خلیج فارس به میزان ۳۵ درصد نسبت به ماه گذشته افزایش یافته است.',
    source: 'سنتکام / تحلیل داده‌های رهگیری دریایی',
    category: 'military',
    priority: 'high',
    status: 'published',
    published_at: '۱۴۰۳/۰۶/۱۲ - ۱۱:۳۰',
    created_at: '2024-09-02T11:30:00Z'
  },
  {
    id: 'news-102',
    title: 'ارسال پیام‌های دیپلماتیک محرمانه از طریق کانال مسقط درباره خطوط قرمز',
    summary: 'دیدار هیئت‌های میانجی در عمان برای بررسی چارچوب مهار تنش و جلوگیری از سوءمحاسبه در مرزهای پیرامونی.',
    content: 'منابع دیپلماتیک در خلیج فارس تأیید کردند که در جریان سفر اخیر معاون وزیر امور خارجه عمان به تهران و پیام‌های ارسالی به واشنگتن، یادداشت‌هایی حاوی تصریح بر خطوط قرمز دفاعی و هسته‌ای تبادل شده است. تمرکز گفت‌وگوها بر ممانعت از اقدامات تحریک‌آمیز در آبراه‌های تجاری بوده است.',
    source: 'کانال دیپلماتیک مسقط / خبرگزاری رسمی',
    category: 'diplomatic',
    priority: 'high',
    status: 'published',
    published_at: '۱۴۰۳/۰۶/۱۱ - ۱۹:۱۵',
    created_at: '2024-09-01T19:15:00Z'
  },
  {
    id: 'news-103',
    title: 'بسته جدید تحریم‌های ثانویه خزانه‌داری آمریکا علیه شبکه‌های ترانزیت مالی',
    summary: 'اداره کنترل دارایی‌های خارجی (OFAC) ۱۲ شرکت و ۳ فروند نفت‌کش را به اتهام تسهیل صادرات انرژی تحریم کرد.',
    content: 'وزارت خزانه‌داری ایالات متحده در تازه‌ترین اقدام تحریمی، شبکه‌ای چندملیتی مستقر در امارات، سنگاپور و هنگ‌کنگ را هدف قرار داد. کارشناسان معتقدند این اقدام بخشی از سیاست انطباق با فشار حداکثری و محدودسازی دسترسی به مبادلات یوآنی و درهمی است.',
    source: 'بیانیه رسمی OFAC',
    category: 'economic',
    priority: 'medium',
    status: 'published',
    published_at: '۱۴۰۳/۰۶/۱۰ - ۱۴:۰۰',
    created_at: '2024-08-31T14:00:00Z'
  },
  {
    id: 'news-104',
    title: 'افزایش سطح آماده‌باش پدافند هوایی یکپارچه در نوار ساحلی جنوب',
    summary: 'استقرار سامانه‌های پدافندی برد متوسط و رادارهای آرایه فازی سه‌بعدی در جزایر سه‌گانه و سواحل مکران.',
    content: 'گزارش‌های میدانی و تصاویر ماهواره‌ای تجاری حاکی از استقرار پرتابگرهای ارتقایافته سوم خرداد و سامانه‌های صیاد در مواضع تثبیت‌شده ساحلی است. این بازآرایی هم‌زمان با ارزیابی احتمال خطاهای محاسباتی در جریان مانورهای منطقه‌ای صورت گرفته است.',
    source: 'رصد ماهواره‌ای / منابع امنیتی دفاعی',
    category: 'military',
    priority: 'high',
    status: 'published',
    published_at: '۱۴۰۳/۰۶/۰۹ - ۰۹:۴۵',
    created_at: '2024-08-30T09:45:00Z'
  },
  {
    id: 'news-105',
    title: 'گزارش فصلی آژانس بین‌المللی انرژی اتمی پیرامون سطح ذخایر غنی‌سازی',
    summary: 'تأیید تداوم غنی‌سازی ۶۰ درصد در سطح تثبیت‌شده قبلی همراه با ابراز نگرانی گروسی پیرامون دسترسی‌های پادمانی.',
    content: 'در پیش‌نویس گزارش محرمانه مدیرکل آژانس که به شورای حکام ارائه شده، میزان ذخایر اورانیوم غنی‌شده با خلوص بالا بدون جهش ناگهانی گزارش شده، اما بر ضرورت پاسخگویی به پرسش‌های باقی‌مانده پادمانی تأکید شده است.',
    source: 'دبیرخانه آژانس بین‌المللی انرژی اتمی (وین)',
    category: 'diplomatic',
    priority: 'medium',
    status: 'published',
    published_at: '۱۴۰۳/۰۶/۰۸ - ۱۶:۳۰',
    created_at: '2024-08-29T16:30:00Z'
  },
  {
    id: 'news-106',
    title: 'کشف و رصد تلاش‌های نفوذ سایبری به زیرساخت‌های حمل‌ونقل دریایی',
    summary: 'مرکز مدیریت راهبردی امنیت سایبری از دفع حملات فیشینگ هدفمند علیه بنادر تجاری خبر داد.',
    content: 'هشدارهای فنی منتشرشده نشان می‌دهد گروه‌های موسوم به تهدید پیشرفته مستمر (APT) با ارسال کدهای مخرب تلاش کرده‌اند به شبکه‌های لجستیکی اسکله‌های جنوبی نفوذ کنند که با ایزولاسیون شبکه دفع شد.',
    source: 'مرکز ماهر / امنیت سایبری دفاعی',
    category: 'intelligence',
    priority: 'low',
    status: 'published',
    published_at: '۱۴۰۳/۰۶/۰۷ - ۲۱:۰۰',
    created_at: '2024-08-28T21:00:00Z'
  }
];

export const INITIAL_ANALYSES: AnalysisItem[] = [
  {
    id: 'analysis-201',
    title: 'معمای بازدارندگی نامتقارن: واکاوی بازآرایی پایگاه‌های سنتکام و واکنش تاکتیکی ایران',
    slug: 'asymmetric-deterrence-centcom-iran-tactical-response',
    summary: 'بررسی تحرکات اخیر نیروی دریایی آمریکا در تنگه هرمز، استقرار پدافندهای ساحلی و ارزیابی شانس گذار از موازنه شکننده به برخورد کنترل‌شده.',
    content: `### گزارش راهبردی و ارزیابی وضعیت
در پی اعزام یگان‌های شناوری پشتیبان و افزایش گشت‌های نظارتی P-8A Poseidon در تنگه هرمز و دریای عمان، سطح آماده‌باش متقابل در منطقه وارد فاز «بازدارندگی فعال» شده است. طرفین با حفظ فاصله‌گذاری احتیاطی، در حال تثبیت خطوط سرخ محاسباتی خویش هستند.

ایالات متحده تلاش می‌کند با حضور مداوم در گلوگاه‌های تردد نفت، به متحدان منطقه‌ای خود پیرامون امنیت کشتیرانی اطمینان داده و مانع از گسترش چتر اعمال حاکمیت نامتقارن شود. در مقابل، راهبرد دفاعی ایران بر پایه «ایجاد عدم‌قطعیت پرهزینه» برای طرف مقابل استوار است که در آن هرگونه تحرک تهاجمی با پاسخ‌های متقارن یا نیابتی در چند جبهه مهار خواهد شد.

### تفکیک بیانیه‌های رسمی از واقعیات میدانی
۱. **ادعاهای تبلیغاتی غرب:** تأکید مداوم بر بازگشایی کامل مسیرها و مهار توان پهپادی، در حالی مطرح می‌شود که کشتی‌های نظامی ترجیح می‌دهند با فاصله ایمن از سواحل جزایر استقرار یابند.
۲. **مواضع رسمی منطقه‌ای:** لحن تند سخنگویان دیپلماتیک بیش از آنکه مقدمه درگیری گرم باشد، کارکرد تثبیت وزن چانه‌زنی در میزهای گفت‌وگوی غیرمستقیم عمان را دارد.

### افق پیش‌رو و سناریوی مبنا
سناریوی اصلی برای هفته‌های آتی، تداوم وضعیت «جنگ سرد مدیریت‌شده» است. هیچ‌یک از طرفین منافع راهبردی خود را در شروع یک منازعه فرسایشی فراگیر نمی‌بینند؛ با این حال، ضریب ریسک ناشی از «سوءمحاسبه میدانی» به بالاترین سطح در شش ماه گذشته رسیده است.`,
    category: 'military',
    severity: 'critical',
    historical_precedent: 'تطبیق با بحران نفت‌کش‌ها در ژوئن ۲۰۱۹ و حوادث پیرامون پهپاد گلوبال هاوک؛ نشان می‌دهد هر دو طرف پس از نمایش قدرت نقطه‌ای، بلافاصله کانال‌های ارتباط اضطراری برای ممانعت از لغزش به جنگ جامع را فعال می‌کنند.',
    counter_analysis: 'دیدگاه جایگزین و منتقدانه: برخی تحلیل‌گران استدلال می‌کنند که تمرکز فعلی سنتکام صرفاً پوشش خروج تدریجی اولویت‌های پنتاگون به سمت شرق آسیا است و نباید آن را نشانه‌ای از طراحی حمله پیش‌دستانه تلقی کرد.',
    model_used: 'xAI Grok 4.3 (Synthetic Consensus)',
    confidence_score: 93,
    read_time: '۷ دقیقه',
    views_count: 3420,
    tags: ['نظامی', 'تنگه هرمز', 'سنتکام', 'بازدارندگی', 'پدافند موشکی'],
    status: 'published',
    published_at: '۱۴۰۳/۰۶/۱۲',
    created_at: '2024-09-02T12:00:00Z',
    linked_news_ids: ['news-101', 'news-104']
  },
  {
    id: 'analysis-202',
    title: 'کانال مسقط و دیپلماسی در سایه: محدودیت‌ها و ظرفیت‌های توافق نانوشته مهار بحران',
    slug: 'muscat-channel-shadow-diplomacy-crisis-containment',
    summary: 'بررسی اثرات مبادله پیام‌های محرمانه بر پایداری تفاهم‌های تنش‌زدایی و بازبینی رفتار طرفین در میانه فشارهای تحریمی و مطالبات کنگره.',
    content: `### گزارش راهبردی و ارزیابی دیپلماتیک
دیپلماسی پشت درهای بسته در پایتخت پادشاهی عمان وارد مقطعی حساس شده است. در غیاب یک ساختار حقوقی جامع مانند برجام، طرفین به فرمول عملگرایانه «تنش کمتر در ازای اصطکاک کمتر» تکیه کرده‌اند.

این الگوی تعامل اگرچه شکننده است، اما تاکنون مانع از تشدید گام‌به‌گام تحریم‌های حداکثری یا وقوع بحران‌های تسلیحاتی غیرقابل مهار گردیده است.

### ارزیابی نقاط آسیب‌پذیر دیپلماسی در سایه
- **فشارهای داخلی در واشنگتن:** با نزدیک شدن به بزنگاه‌های انتخاباتی، هرگونه نرمش در اجرای تحریم‌های انرژی با مقاومت شدید نمایندگان کنگره مواجه می‌شود.
- **تضمین‌های ناپایدار:** نبود یک موافقت‌نامه الزام‌آور بین‌المللی باعث می‌شود هر حادثه میدانی کوچک بتواند کل مسیر پیام‌رسانی را متوقف کند.

### نتیجه‌گیری تحلیلی
کانال عمان کارآمدترین ابزار کنونی برای ارسال علائم هشدار سریع و جلوگیری از فاجعه نظامی است، هرچند ظرفیت ساختاری برای حل ریشه‌ای اختلافات راهبردی تهران و واشنگتن را دارا نیست.`,
    category: 'diplomatic',
    severity: 'medium',
    historical_precedent: 'تطبیق با مذاکرات محرمانه ۲۰۱۲-۲۰۱۳ پیش از توافق موقت ژنو؛ دیپلماسی محرمانه همواره بسترساز تثبیت گزینه‌ها پیش از آشکارسازی عمومی بوده است.',
    counter_analysis: 'دیدگاه جایگزین: تداوم توافق نانوشته ممکن است صرفاً زمان خریدن برای انباشت اهرم‌های فشار بیشتر از سوی کاخ سفید باشد و دستاورد اقتصادی پایداری به همراه نیاورد.',
    model_used: 'xAI Grok 4.3 (Strategic Module)',
    confidence_score: 88,
    read_time: '۵ دقیقه',
    views_count: 2150,
    tags: ['دیپلماسی', 'کانال مسقط', 'تحریم‌ها', 'خطوط قرمز'],
    status: 'published',
    published_at: '۱۴۰3/۰۶/۱۰',
    created_at: '2024-08-31T15:00:00Z',
    linked_news_ids: ['news-102', 'news-103']
  },
  {
    id: 'analysis-203',
    title: 'جنگ ارزی و شریان‌های پنهان تجاری: ارزیابی کارایی ابزارهای تحریمی OFAC در برابر سازوکارهای تسویه منطقه‌ای',
    slug: 'currency-war-hidden-trade-ofac-regional-settlement',
    summary: 'بررسی ساختار انتقال درهمی و صرافی‌های واسط، همراه با راهبردهای مقابله با انسداد دارایی‌ها در شرایط فشار بانکی.',
    content: `### واکاوی ابعاد اقتصادی و ژئوپلیتیک
وزارت خزانه‌داری آمریکا در یک سال گذشته استراتژی تحریمی خود را از مسدودسازی شرکت‌های مادر به سمت پیگیری مویرگی کارگزاری‌های تجاری در امارات و شرق آسیا تغییر داده است.

با این وجود، تطبیق سریع شبکه‌های صرافی و استفاده گسترده از ارزهای محلی در تجارت غیردلاری، کشش‌پذیری قابل توجهی در جریان درآمدهای نفتی پدید آورده است. این دینامیک باعث شده تا بازدهی حاشیه‌ای هر تحریم جدید به مرور کاهش یابد.

### سناریوهای موازنه مالی
- تداوم رشد مبادلات مبتنی بر یوآن و پیام‌رسان‌های بین‌بانکی جایگزین نظیر SPFS و SEPAM.
- افزایش ریسک برای بانک‌های واسط اماراتی که منجر به نوسانات مقطعی در نرخ برابری حواله خواهد شد.`,
    category: 'economic',
    severity: 'medium',
    historical_precedent: 'مقایسه با دوره دور زدن تحریم‌ها در سال‌های ۲۰۱۰ تا ۲۰۱۲؛ افزایش هزینه‌های تراکنش بانکی (Transaction Cost) اجتناب‌ناپذیر است اما جریان کالا را متوقف نمی‌سازد.',
    counter_analysis: 'دیدگاه نقادانه: غلبه تجارت غیررسمی با تخفیف‌های سنگین نفتی ممکن است در بلندمدت ظرفیت مالی دولت را تضعیف کرده و اتکا به خریداران انحصاری را خطرآفرین کند.',
    model_used: 'xAI Grok 4.3',
    confidence_score: 85,
    read_time: '۶ دقیقه',
    views_count: 1890,
    tags: ['اقتصادی', 'تحریم OFAC', 'تسویه ارزی', 'تجارت انرژی'],
    status: 'published',
    published_at: '۱۴۰۳/۰۶/۰۷',
    created_at: '2024-08-28T18:00:00Z',
    linked_news_ids: ['news-103']
  }
];

export const INITIAL_PREDICTIONS: PredictionItem[] = [
  {
    id: 'pred-301',
    title: 'احتمال وقوع درگیری دریایی کنترل‌شده در خلیج فارس و دریای عمان',
    timeframe: 'short',
    timeframe_label: 'کوتاه‌مدت (۱ تا ۴ هفته)',
    probability: 28,
    primary_scenario: 'تداوم رویارویی تاکتیکی، هشدارهای رادیویی متقابل و توقیف احتمالی شناورهای متخلف بدون تبادل آتش مرگبار مستقیم.',
    alternative_scenario: 'بروز سانحه تصادف شناوری یا شلیک اخطار به دلیل سوءمحاسبه در آب‌های سرزمینی و فعال شدن فوری میانجی‌گری عمان.',
    risk_level: 'high',
    trigger_events: [
      'رهگیری نزدیک ناوشکن‌های غربی توسط قایق‌های تندرو',
      'حملات ایذایی به نفت‌کش‌ها در آب‌های سرزمینی پیرامونی',
      'مانورهای موشکی بدون اطلاع قبلی'
    ],
    status: 'published',
    created_at: '۱۴۰۳/۰۶/۱۲'
  },
  {
    id: 'pred-302',
    title: 'جهت‌گیری بازارهای انرژی و سرنوشت معافیت‌های غیررسمی نفتی',
    timeframe: 'mid',
    timeframe_label: 'میان‌مدت (۱ تا ۶ ماه)',
    probability: 72,
    primary_scenario: 'حفظ سطح صادرات فعلی در محدوده ۱.۵ میلیون بشکه روزانه به دلیل تمایل واشنگتن به مهار قیمت بنزین پیش از انتخابات.',
    alternative_scenario: 'تشدید ناگهانی توقیف محموله‌ها در مبادی آسیای شرقی با اعمال فشار بر خریداران اصلی.',
    risk_level: 'medium',
    trigger_events: [
      'نوسانات شدید در قیمت جهانی نفت برنت بالای ۹۵ دلار',
      'تصویب لوایح ضدصادرات نفت در سنای آمریکا'
    ],
    status: 'published',
    created_at: '۱۴۰۳/۰۶/۱۰'
  },
  {
    id: 'pred-303',
    title: 'آینده معماری امنیتی منطقه‌ای و توازن پیمان‌های چندجانبه',
    timeframe: 'long',
    timeframe_label: 'بلندمدت (۶ ماه تا ۲ سال)',
    probability: 65,
    primary_scenario: 'تثبیت الگوهای هم‌زیستی محتاطانه با کشورهای حاشیه جنوبی خلیج فارس همراه با مهار ائتلاف‌های دفاعی با تل‌آویو.',
    alternative_scenario: 'تشکیل پیمان‌های رسمی پدافند هوایی منطقه‌ای با مشارکت مستقیم سنتکام و افزایش انزوای امنیتی متقابل.',
    risk_level: 'critical',
    trigger_events: [
      'تغییر دولت در آمریکا و بازگشت دکترین فشار حداکثری بی‌قیدوشرط',
      'تصمیم به جهش در سطوح بازدارندگی راهبردی'
    ],
    status: 'published',
    created_at: '۱۴۰۳/۰۶/۰۵'
  }
];

export const INITIAL_API_LOGS: ApiUsageLog[] = [
  {
    id: 'log-1',
    provider: 'xai',
    model: 'grok-4.3-latest',
    prompt_tokens: 3840,
    completion_tokens: 920,
    total_tokens: 4760,
    estimated_cost: 0.0476,
    endpoint: '/chat/completions',
    status: 'success',
    created_at: '۱۴۰۳/۰۶/۱۲ - ۱۱:۳۴'
  },
  {
    id: 'log-2',
    provider: 'xai',
    model: 'grok-4.3-latest',
    prompt_tokens: 2450,
    completion_tokens: 610,
    total_tokens: 3060,
    estimated_cost: 0.0306,
    endpoint: '/chat/completions',
    status: 'success',
    created_at: '۱۴۰۳/۰۶/۱۱ - ۱۹:۲۲'
  },
  {
    id: 'log-3',
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    prompt_tokens: 1820,
    completion_tokens: 430,
    total_tokens: 2250,
    estimated_cost: 0.0018,
    endpoint: '/openai/v1/chat/completions',
    status: 'success',
    created_at: '۱۴۰۳/۰۶/۱۰ - ۱۴:۱۵'
  },
  {
    id: 'log-4',
    provider: 'google',
    model: 'gemini-2.5-flash',
    prompt_tokens: 4100,
    completion_tokens: 880,
    total_tokens: 4980,
    estimated_cost: 0.0025,
    endpoint: '/v1beta/models/generateContent',
    status: 'success',
    created_at: '۱۴۰۳/۰۶/۰۹ - ۰۹:۵۲'
  },
  {
    id: 'log-5',
    provider: 'openai',
    model: 'gpt-4o',
    prompt_tokens: 3200,
    completion_tokens: 740,
    total_tokens: 3940,
    estimated_cost: 0.0394,
    endpoint: '/v1/chat/completions',
    status: 'success',
    created_at: '۱۴۰۳/۰۶/۰۸ - ۱۶:۴۰'
  }
];

export const INITIAL_MEDIA_FILES: MediaFileItem[] = [
  {
    id: 'media-1',
    filename: 'satellite_strait_hormuz_radar_sept.jpg',
    size: 1485200, // ~1.4 MB
    mime_type: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    provider: 'cloudinary',
    uploaded_at: '۱۴۰۳/۰۶/۱۲ - ۱۰:۱۵'
  },
  {
    id: 'media-2',
    filename: 'centcom_deployment_chart_q3.png',
    size: 842100, // ~840 KB
    mime_type: 'image/png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    provider: 'local',
    uploaded_at: '۱۴۰۳/۰۶/۱۰ - ۱۷:۳۰'
  },
  {
    id: 'media-3',
    filename: 'iran_us_deterrence_dossier_v4.pdf',
    size: 4210000, // ~4.2 MB
    mime_type: 'application/pdf',
    url: '/uploads/iran_us_deterrence_dossier_v4.pdf',
    provider: 'local',
    uploaded_at: '۱۴۰۳/۰۶/۰۸ - ۱۲:۰۰'
  }
];

export const INITIAL_R2_FILES = INITIAL_MEDIA_FILES;

// Helper to safely load and persist in browser LocalStorage
class DatabaseStore {
  private newsKey = 'radar_pg_news';
  private analysesKey = 'radar_pg_analyses';
  private predictionsKey = 'radar_pg_predictions';
  private settingsKey = 'radar_pg_settings';
  private apiLogsKey = 'radar_pg_api_logs';
  private mediaFilesKey = 'radar_pg_media_files';
  private authKey = 'radar_admin_auth';

  private getItem<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return fallback;
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  // --- Auth ---
  public isAuthenticated(): boolean {
    try {
      return localStorage.getItem(this.authKey) === 'true';
    } catch {
      return false;
    }
  }

  public login(password: string): boolean {
    // Default admin secret or configurable
    if (password === 'admin123' || password === 'radar-admin-secret' || password === 'admin') {
      try {
        localStorage.setItem(this.authKey, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }

  public logout(): void {
    try {
      localStorage.removeItem(this.authKey);
    } catch {
      // ignore
    }
  }

  // --- Settings ---
  public getSettings(): SiteSettings {
    return this.getItem<SiteSettings>(this.settingsKey, DEFAULT_SITE_SETTINGS);
  }

  public updateSettings(updates: Partial<SiteSettings>): SiteSettings {
    const current = this.getSettings();
    const updated: SiteSettings = {
      ...current,
      ...updates,
      updated_at: new Date().toLocaleDateString('fa-IR')
    };
    this.setItem(this.settingsKey, updated);
    return updated;
  }

  // --- News ---
  public getNews(): NewsItem[] {
    return this.getItem<NewsItem[]>(this.newsKey, INITIAL_NEWS);
  }

  public createNews(item: Omit<NewsItem, 'id' | 'created_at'>): NewsItem {
    const list = this.getNews();
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    this.setItem(this.newsKey, [newItem, ...list]);
    return newItem;
  }

  public updateNews(id: string, updates: Partial<NewsItem>): NewsItem | null {
    const list = this.getNews();
    const idx = list.findIndex(n => n.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    this.setItem(this.newsKey, [...list]);
    return updated;
  }

  public deleteNews(id: string): boolean {
    const list = this.getNews();
    const filtered = list.filter(n => n.id !== id);
    this.setItem(this.newsKey, filtered);
    return filtered.length < list.length;
  }

  // --- Analyses ---
  public getAnalyses(): AnalysisItem[] {
    return this.getItem<AnalysisItem[]>(this.analysesKey, INITIAL_ANALYSES);
  }

  public getAnalysisById(idOrSlug: string): AnalysisItem | null {
    const list = this.getAnalyses();
    return list.find(a => a.id === idOrSlug || a.slug === idOrSlug) || null;
  }

  public createAnalysis(item: Omit<AnalysisItem, 'id' | 'views_count' | 'created_at'>): AnalysisItem {
    const list = this.getAnalyses();
    const newAnalysis: AnalysisItem = {
      ...item,
      id: `analysis-${Date.now()}`,
      views_count: 1,
      created_at: new Date().toISOString()
    };
    this.setItem(this.analysesKey, [newAnalysis, ...list]);
    return newAnalysis;
  }

  public updateAnalysis(id: string, updates: Partial<AnalysisItem>): AnalysisItem | null {
    const list = this.getAnalyses();
    const idx = list.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    this.setItem(this.analysesKey, [...list]);
    return updated;
  }

  public deleteAnalysis(id: string): boolean {
    const list = this.getAnalyses();
    const filtered = list.filter(a => a.id !== id);
    this.setItem(this.analysesKey, filtered);
    return filtered.length < list.length;
  }

  // --- Predictions ---
  public getPredictions(): PredictionItem[] {
    return this.getItem<PredictionItem[]>(this.predictionsKey, INITIAL_PREDICTIONS);
  }

  public createPrediction(item: Omit<PredictionItem, 'id' | 'created_at'>): PredictionItem {
    const list = this.getPredictions();
    const newPred: PredictionItem = {
      ...item,
      id: `pred-${Date.now()}`,
      created_at: new Date().toLocaleDateString('fa-IR')
    };
    this.setItem(this.predictionsKey, [newPred, ...list]);
    return newPred;
  }

  public updatePrediction(id: string, updates: Partial<PredictionItem>): PredictionItem | null {
    const list = this.getPredictions();
    const idx = list.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    this.setItem(this.predictionsKey, [...list]);
    return updated;
  }

  public deletePrediction(id: string): boolean {
    const list = this.getPredictions();
    const filtered = list.filter(p => p.id !== id);
    this.setItem(this.predictionsKey, filtered);
    return filtered.length < list.length;
  }

  // --- API Usage Logs ---
  public getApiLogs(): ApiUsageLog[] {
    return this.getItem<ApiUsageLog[]>(this.apiLogsKey, INITIAL_API_LOGS);
  }

  public logApiUsage(log: Omit<ApiUsageLog, 'id' | 'created_at'>): ApiUsageLog {
    const list = this.getApiLogs();
    const newLog: ApiUsageLog = {
      ...log,
      id: `api-log-${Date.now()}`,
      created_at: new Date().toLocaleString('fa-IR')
    };
    this.setItem(this.apiLogsKey, [newLog, ...list]);
    return newLog;
  }

  // --- Media & Storage (Local / Public / Cloudinary) ---
  public getMediaFiles(): MediaFileItem[] {
    return this.getItem<MediaFileItem[]>(this.mediaFilesKey, INITIAL_MEDIA_FILES);
  }

  public addMediaFile(file: Omit<MediaFileItem, 'id' | 'uploaded_at'>): MediaFileItem {
    const list = this.getMediaFiles();
    const newFile: MediaFileItem = {
      ...file,
      id: `media-${Date.now()}`,
      uploaded_at: new Date().toLocaleString('fa-IR')
    };
    this.setItem(this.mediaFilesKey, [newFile, ...list]);
    return newFile;
  }

  public deleteMediaFile(id: string): boolean {
    const list = this.getMediaFiles();
    const filtered = list.filter(f => f.id !== id);
    this.setItem(this.mediaFilesKey, filtered);
    return filtered.length < list.length;
  }

  // Backwards compatibility aliases for R2 methods
  public getR2Files(): MediaFileItem[] {
    return this.getMediaFiles();
  }

  public addR2File(file: Omit<MediaFileItem, 'id' | 'uploaded_at'>): MediaFileItem {
    return this.addMediaFile(file);
  }

  public deleteR2File(id: string): boolean {
    return this.deleteMediaFile(id);
  }

  // --- Stats ---
  public getStats(): AdminStats {
    const news = this.getNews();
    const analyses = this.getAnalyses();
    const predictions = this.getPredictions();
    const apiLogs = this.getApiLogs();
    const mediaFiles = this.getMediaFiles();

    const totalTokens = apiLogs.reduce((acc, l) => acc + l.total_tokens, 0);
    const totalCost = apiLogs.reduce((acc, l) => acc + l.estimated_cost, 0);
    const storageBytes = mediaFiles.reduce((acc, f) => acc + f.size, 0);

    return {
      total_news: news.length,
      total_analyses: analyses.length,
      total_predictions: predictions.length,
      total_api_tokens: totalTokens,
      total_cost_usd: parseFloat(totalCost.toFixed(4)),
      media_storage_bytes: storageBytes,
      r2_storage_bytes: storageBytes
    };
  }

  // Reset database to initial seeds
  public resetToDefaults(): void {
    this.setItem(this.newsKey, INITIAL_NEWS);
    this.setItem(this.analysesKey, INITIAL_ANALYSES);
    this.setItem(this.predictionsKey, INITIAL_PREDICTIONS);
    this.setItem(this.settingsKey, DEFAULT_SITE_SETTINGS);
    this.setItem(this.apiLogsKey, INITIAL_API_LOGS);
    this.setItem(this.mediaFilesKey, INITIAL_MEDIA_FILES);
  }
}

export const dbStore = new DatabaseStore();
