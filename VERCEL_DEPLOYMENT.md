# راهنمای استقرار پروژه رادار جنگ روی Vercel با پایگاه داده PostgreSQL

این سند راهنمای کامل استقرار نسخه جدید **رادار جنگ (Radar-e-Jang)** بر روی پلتفرم **Vercel** به همراه پایگاه داده رابطه‌ای **PostgreSQL** و مدیریت ساده‌شده فایل‌ها می‌باشد.

---

## ۱. پیش‌نیازها و فناوری‌های مورد استفاده

- **فرانت‌اند:** React + Vite + Tailwind CSS + Lucide Icons (کاملاً RTL و بهینه‌سازی‌شده برای فونت وزیرمتن)
- **پایگاه داده:** PostgreSQL (سازگار با Vercel Postgres، Neon، Supabase، Railway یا دیتابیس اختصاصی)
- **ORM / مدیریت اسکیما:** Prisma (`prisma/schema.prisma`) به همراه فایل SQL خام (`prisma/schema.sql`)
- **ذخیره‌سازی تصاویر و رسانه‌ها:** پوشه `public/uploads/` یا استفاده اختیاری از CDN رایگان مانند Cloudinary
- **موتور هوش مصنوعی:** سرویس‌های خارجی LLM (xAI Grok، Groq، Google Gemini، OpenAI)

---

## ۲. متغیرهای محیطی مورد نیاز در Vercel (Environment Variables)

در داشبورد ورسل، به بخش **Settings > Environment Variables** رفته و متغیرهای زیر را وارد کنید:

| نام متغیر | نوع | توضیح / نمونه مقدار |
|---|---|---|
| `DATABASE_URL` | الزامی | آدرس اتصال به دیتابیس PostgreSQL با فعال بودن SSL<br>`postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `ADMIN_PASSWORD` | الزامی | رمز عبور ورود به پنل مدیریت رادار جنگ (پیش‌فرض: `radar-admin-secret` یا مقدار دلخواه) |
| `JWT_SECRET` | الزامی | یک کلید تصادفی امن برای امضای توکن‌های احراز هویت ادمین |
| `CLOUDINARY_CLOUD_NAME` | اختیاری | نام حساب رایگان Cloudinary در صورت فعال‌سازی آپلود ابری |
| `CLOUDINARY_API_KEY` | اختیاری | کلید API سرویس Cloudinary |
| `CLOUDINARY_API_SECRET` | اختیاری | کلید محرمانه سرویس Cloudinary |
| `XAI_API_KEY` | اختیاری | کلید ارتباط با مدل‌های استراتژیک xAI Grok |
| `GROQ_API_KEY` | اختیاری | کلید API برای استنتاج فوق‌سریع متن در Groq |
| `GOOGLE_API_KEY` | اختیاری | کلید API جمینای گوگل (Google Gemini) |
| `OPENAI_API_KEY` | اختیاری | کلید API شرکت OpenAI |

---

## ۳. ایجاد و راه‌اندازی پایگاه داده PostgreSQL

### روش اول: استفاده از Vercel Storage (Vercel Postgres / Neon)
1. در داشبورد Vercel، به برگه **Storage** رفته و گزینه **Create Database > Postgres** را انتخاب کنید.
2. ورسل به طور خودکار متغیر `DATABASE_URL` را به پروژه شما متصل می‌کند.
3. در کنسول **Query Editor** ورسل، محتویات فایل `prisma/schema.sql` را کپی کرده و دکمه **Run** را بزنید تا تمام جداول (`news`، `analyses`، `predictions`، `site_settings`، `api_usage`، `media_files`) با کلیدها و ایندکس‌های لازم ایجاد شوند.

### روش دوم: استفاده از Prisma CLI
اگر به سیستم خود یا خط فرمان دسترسی دارید:
```bash
# نصب وابستگی‌ها
npm install

# همگام‌سازی اسکیما با دیتابیس PostgreSQL
npx prisma db push

# (اختیاری) مشاهده و ویرایش داده‌ها در رابط کاربری گرافیکی پریسما
npx prisma studio
```

---

## ۴. آپلود فایل و تصاویر (جایگزین Cloudflare R2)

طبق درخواست، مدیریت فایل‌ها اکنون به دو روش ساده و منعطف در دسترس است:
1. **آپلود در پوشه `/public/uploads` یا پیش‌نمایش مستقیم محلی:**
   - مدیر می‌تواند فایل‌ها را در تب «فایل‌ها و چندرسانه‌ای» مستقیماً درگ‌وان‌دراپ کند.
2. **استفاده از نشانی مستقیم وب / Cloudinary:**
   - با کلیک روی دکمه «افزودن لینک Cloudinary / وب»، نشانی هر تصویر یا فایل ماهواره‌ای را وارد کنید تا بلافاصله به آرشیو افزوده شده و دکمه کپی لینک در اختیارتان قرار گیرد.

---

## ۵. استقرار روی Vercel (Deployment Steps)

پروژه به گونه‌ای پیکربندی شده است که با یک کلیک روی ورسل مستقر می‌شود:

### روش ۱: اتصال ریپازیتوری گیت (GitHub / GitLab)
1. کد پروژه را در مخزن گیت‌هاب پوش (Push) کنید.
2. وارد [vercel.com/new](https://vercel.com/new) شوید و مخزن را انتخاب کنید.
3. ورسل به صورت خودکار پروژه را به عنوان **Vite** شناسایی می‌کند:
   - **Build Command:** `vite build`
   - **Output Directory:** `dist`
4. متغیرهای محیطی بخش ۲ را وارد نموده و دکمه **Deploy** را بزنید.

### روش ۲: استقرار با خط فرمان (Vercel CLI)
```bash
npm install -g vercel
vercel login
vercel
# جهت استقرار مستقیم روی پروداکشن:
vercel --prod
```

فایل `vercel.json` در ریشه پروژه قرار دارد و تنظیمات لازم برای SPA Routing (هدایت مسیرها به `index.html`) و توابع Serverless در مسیر `/api/` را کنترل می‌نماید.
