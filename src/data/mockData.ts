import { AnalysisRecord, PredictionScenario, SystemMetrics, LogMessage } from '../types';

export const initialSystemMetrics: SystemMetrics = {
  status: 'operational',
  uptime: '۹۹.۹۴٪ (۱۴ روز، ۶ ساعت)',
  totalNews: 12402,
  chromaVectors: 34210,
  activeAdmins: 8936968493,
  todayTokens: 142502,
  tokenBudget: 250000,
  gptCost: 12.40,
  claudeCost: 8.15,
  geminiCost: 3.20,
  lastFetch: '۱ دقیقه پیش',
  channelName: '@databaseradarj',
  activeRateLimit: '۵ درخواست / دقیقه'
};

export const sampleAnalyses: AnalysisRecord[] = [
  {
    id: 'an-1049',
    title: 'تحرکات ناوگروه تهاجمی آبراهام لینکلن در دریای عمان و خلیج فارس',
    category: 'military',
    severity: 'critical',
    channel: '@databaseradarj',
    timestamp: '۱۴:۴۲:۱۰',
    timeAgo: '۲ دقیقه پیش',
    summary: 'افزایش گشت‌های هوایی شناسایی P-8 Poseidon در آب‌های سرزمینی و استقرار یگان‌های دفاع موشکی تاد در منطقه، نشان‌دهنده آمادگی سطح DEFCON-3 برای سناریوی بازدارندگی تهاجمی است.',
    historicalPrecedent: 'تطبیق با بحران تنگه هرمز در ژوئن ۲۰۱۹ و مانور مشترک دسامبر ۲۰۲۱؛ تغییر آرایش پدافندی معمولاً پیش‌درآمد اقدام عملیاتی محدود است.',
    counterAnalysis: 'دیدگاه جایگزین (Historian Agent): آرایش فعلی حرکتی با هدف فشار حداکثری و نمایش قدرت دیپلماتیک پیش از دور جدید مذاکرات غیرمستقیم است، نه آغاز درگیری فراگیر.',
    model: 'Claude-3.5 Sonnet',
    confidence: 94,
    tokensUsed: 2180,
    tags: ['نظامی', 'خلیج فارس', 'سنتکام', 'پدافند موشکی'],
    newsSourcesCount: 5
  },
  {
    id: 'an-1048',
    title: 'سیگنال‌های غیررسمی تبادل پیام دیپلماتیک در مسقط و دوحه',
    category: 'diplomatic',
    severity: 'medium',
    channel: '@databaseradarj',
    timestamp: '۱۳:۲۵:۰۰',
    timeAgo: '۱ ساعت پیش',
    summary: 'گزارش‌های غیرعلنی حاکی از رد و بدل شدن پیش‌نویس آتش‌بس موقت منطقه‌ای با واسطه‌گری عمان است. واشنگتن شروط عدم گسترش دامنه غنی‌سازی ۶۰٪ را مجدداً پیش کشیده است.',
    historicalPrecedent: 'مشابه با مذاکرات محرمانه مارس ۲۰۲۳ که منجر به توافق نانوشته آزادسازی دارایی‌های ارزی و کاهش موقت حملات پهپادی شد.',
    counterAnalysis: 'دیدگاه جایگزین: لفاظی‌های تند همزمان نمایندگان کنگره نشان می‌دهد احتمال دست‌یابی به توافق پایدار بدون امتیازدهی‌های چشمگیر بسیار پایین است.',
    model: 'GPT-4o',
    confidence: 88,
    tokensUsed: 1840,
    tags: ['دیپلماسی', 'عمان', 'تحریم', 'غنی‌سازی'],
    newsSourcesCount: 3
  },
  {
    id: 'an-1047',
    title: 'بسته جدید تحریم‌های ثانویه وزارت خزانه‌داری آمریکا علیه شبکه کشتیرانی',
    category: 'economic',
    severity: 'medium',
    channel: '@databaseradarj',
    timestamp: '۱۰:۱۴:۲۲',
    timeAgo: '۴ ساعت پیش',
    summary: 'اعمال تحریم علیه ۱۲ نفتکش حامل سوخت و ۵ شرکت صرافی ثبت شده در امارات و هنگ‌کنگ. اثر روانی کوتاه‌مدت بر نرخ برابری ارز مشاهده شده است.',
    historicalPrecedent: 'تکرار الگوی تحریم‌های نفتکش‌های شبح (Ghost Fleet) در تابستان ۲۰۲۲ که منجر به تغییر مسیرهای ترانزیت به بنادر آسیای شرقی شد.',
    counterAnalysis: 'تحلیل متقابل: اثرات ساختاری این تحریم به دلیل کانال‌های موازی از پیش تعیین‌شده ظرف ۳ تا ۵ هفته تا حد زیادی خنثی خواهد شد.',
    model: 'Gemini 1.5 Pro',
    confidence: 91,
    tokensUsed: 1420,
    tags: ['اقتصادی', 'OFAC', 'نفت', 'نرخ ارز'],
    newsSourcesCount: 4
  },
  {
    id: 'an-1046',
    title: 'رصد فعالیت‌های سایبری تهاجمی علیه زیرساخت‌های بندری و انرژی',
    category: 'intelligence',
    severity: 'low',
    channel: '@databaseradarj',
    timestamp: '۰۸:۵۰:۱۸',
    timeAgo: '۶ ساعت پیش',
    summary: 'حملات سایبری از نوع DDoS و تلاش برای نفوذ به سیستم‌های کنترل صنعتی SCADA بندر شهید رجایی رهگیری و مهار شد.',
    historicalPrecedent: 'مشابه با حمله بدافزار استاکس‌نت و حملات سایبری متقابل سال ۲۰۲۰ به تاسیسات بندری خلیج فارس.',
    counterAnalysis: 'دیدگاه جایگزین: این حملات ممکن است صرفاً سنجش زمان واکنش سامانه‌های پدافند غیرعامل بوده باشد.',
    model: 'DeepSeek-V3',
    confidence: 85,
    tokensUsed: 1650,
    tags: ['سایبری', 'پدافند غیرعامل', 'بندر رجایی', 'SCADA'],
    newsSourcesCount: 2
  }
];

export const samplePredictions: PredictionScenario[] = [
  {
    id: 'pr-201',
    topic: 'پاسخ موشکی و پدافندی به تجاوزات احتمالی در آب‌های پیرامونی',
    timeframe: '۲۴ ساعت',
    primaryOutcome: 'افزایش سطح هشدار قرمز پدافند هوایی و پروازهای شناسایی بدون درگیری مستقیم فیزیکی (احتمال ۷۵٪)',
    alternativeOutcome: 'تبادل محدود آتش موشکی هشداردهنده در حاشیه تنگه هرمز (احتمال ۲۵٪)',
    probability: 75,
    indicators: ['جابجایی لانچرهای ساحلی', 'صدور نوتام (NOTAM) هوانوردی در خلیج فارس', 'کاهش ترافیک تانکرهای تجاری'],
    generatedAt: '۱۴:۳۰ امروز'
  },
  {
    id: 'pr-202',
    topic: 'روند شاخص‌های ارزی و واکنش بازار سرمایه به تنش‌های ژئوپلیتیک',
    timeframe: '۷ روز',
    primaryOutcome: 'نوسان محدود در دامنه ۲ الی ۴ درصدی و ورود بازارساز برای تثبیت قیمت (احتمال ۸۲٪)',
    alternativeOutcome: 'صعود هیجانی در صورت وقوع بیانیه تند در شورای امنیت سازمان ملل (احتمال ۱۸٪)',
    probability: 82,
    indicators: ['تزریق درهم در بازار دبی', 'حجم معاملات صندوق‌های طلا', 'بیانیه‌های رسمی بانک مرکزی'],
    generatedAt: '۱۲:۰۰ امروز'
  }
];

export const systemLogs: LogMessage[] = [
  {
    id: 'log-1',
    timestamp: '۱۴:۴۵:۰۱',
    level: 'INFO',
    message: 'Fetcher loop started @ UTC 11:15:00... OK'
  },
  {
    id: 'log-2',
    timestamp: '۱۴:۴۳:۱۲',
    level: 'AGENT',
    message: 'Historian Agent: Retrieved 4 historical vectors from ChromaDB (similarity > 0.72)'
  },
  {
    id: 'log-3',
    timestamp: '۱۴:۴۲:۱۰',
    level: 'EXEC',
    message: 'Analysis #an-1049 synthesized with Claude-3.5 Sonnet (2,180 tokens)'
  },
  {
    id: 'log-4',
    timestamp: '۱۴:۴۰:۵۰',
    level: 'INFO',
    message: 'Bot API Channel Listener: Post received from @databaseradarj (MsgID: 125,102)'
  },
  {
    id: 'log-5',
    timestamp: '۱۴:۳۵:۰۰',
    level: 'AGENT',
    message: 'Classifier Agent: 18 raw items parsed, 3 marked HIGH priority'
  }
];
