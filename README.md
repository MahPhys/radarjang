# Radar-e-Jang (War Radar) – دیدبان جنگ

ربات تلگرام چندکاربره و سامانه هوشمند پایش، تحلیل چندعاملی و پیش‌بینی راهبردی تحولات، منازعات و موازنه قوا میان ایران و ایالات متحده آمریکا.

---

## ۱. ساختار و معماری پروژه

```
radar-e-jang-bot/
├── bot.py
├── requirements.txt
├── .env.example
├── Dockerfile
├── README.md
├── handlers/
│   ├── commands.py
│   ├── channel_handlers.py
│   └── group_handlers.py
├── agents/
│   ├── base.py
│   ├── fetcher.py
│   ├── classifier.py
│   ├── analyst.py
│   ├── historian.py
│   └── synthesis.py
├── services/
│   ├── database.py
│   ├── vector_store.py
│   └── llm_service.py
├── models/
│   └── models.py
├── utils/
│   ├── config.py
│   └── logger.py
└── tests/
    ├── test_models.py
    ├── test_classifier.py
    ├── test_state.py
    ├── test_dedup.py
    ├── test_rag.py
    ├── test_handlers.py
    └── test_channel_listener.py
```

---

## ۲. دستورات و دسترسی‌ها

| دستور | دسترسی | شرح عملکرد |
|---|---|---|
| `/start` | عمومی | ثبت‌نام / به‌روزرسانی کاربر و پیام خوش‌آمدگویی رسمی |
| `/help` | عمومی | راهنمای کامل کاربری دستورات |
| `/analyze` | عمومی (محدودیت ۱ بار در ۵ دقیقه) | اجرای خط لوله کامل تحلیل چندعاملی و تولید گزارش راهبردی جامع |
| `/predict` | عمومی | تدوین سناریوهای پیش‌بینی کوتاه‌مدت، میان‌مدت و بلندمدت بر پایه آخرین تحلیل |
| `/history` | عمومی | نمایش تاریخچه گزارش‌های تحلیلی گذشته به صورت صفحه‌بندی‌شده (۵ مورد در هر صفحه) |
| `/status` | عمومی | نمایش وضعیت سلامت سامانه، کانال منبع متصل، مدل‌های فعال و آمار مصرف توکن‌ها |
| `/backfill` | مدیران ارشد (`ADMIN_IDS`) | بررسی وضعیت اتصال و شنود بلادرنگ کانال منبع |

---

## ۳. نحوه راه‌اندازی و اجرای محلی (Local Development)

### گام اول: نصب پیش‌نیازها
```bash
python -m venv venv
source venv/bin/activate  # در ویندوز: venv\Scripts\activate
pip install -r requirements.txt
```

### گام دوم: افزودن ربات به کانال تلگرام به عنوان مدیر (Admin)
۱. در تلگرام وارد کانال مورد نظر خود برای ارسال اخبار شوید (یا کانال اختصاصی بسازید).
۲. ربات خود را به عنوان **Administrator** در کانال عضو کنید تا ربات بتواند پست‌ها و کپشن‌های ارسالی را به صورت بلادرنگ دریافت کند.
۳. آیدی کانال یا یوزرنیم کانال (مثلاً `@databaseradarj`) را در متغیر `SOURCE_CHANNEL` در فایل `.env` قرار دهید.

### گام سوم: تنظیم فایل `.env`
فایل `.env.example` را به `.env` کپی کنید و کلیدهای مورد نیاز را تکمیل نمایید:
```bash
cp .env.example .env
```

### گام چهارم: دانلود مدل امبدینگ در اولین اجرا
در اولین اجرای برنامه، مدل امبدینگ چندزبانه `BAAI/bge-m3` به صورت خودکار توسط کتابخانه `sentence-transformers` بارگیری و در کش ذخیره می‌شود.

### گام پنجم: اجرای ربات
```bash
python bot.py
```

---

## ۴. مهاجرت به پایگاه داده PostgreSQL در محیط پروداکشن

برای استفاده در محیط سرور و مقیاس‌پذیری بالا، تنها کافی است متغیر `DATABASE_URL` را در فایل `.env` به رشته اتصال PostgreSQL تغییر دهید:

```env
DATABASE_URL=postgresql+asyncpg://username:password@db-host:5432/radar_db
```

مدل‌های SQLAlchemy کاملاً سازگار با PostgreSQL طراحی شده‌اند و جداول به صورت خودکار ایجاد و مدیریت می‌شوند.

---

## ۵. اجرای آزمون‌ها (Tests)

برای اجرای تمامی تست‌های خودکار با پوشش بالا:
```bash
pytest -v
```

---

## ۶. استقرار با Docker

```bash
docker build -t radar-e-jang .
docker run -d --name radar_bot --env-file .env radar-e-jang
```
