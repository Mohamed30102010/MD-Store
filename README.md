# 🛍️ متجرك الإلكتروني — صفر عمولة

متجر إلكتروني كامل وجاهز للتشغيل **النهاردة**: صفحة هبوط + سلة + إتمام طلب (كاش عند الاستلام أو تحويل بإثبات دفع) + تتبّع طلبات + لوحة تحكم كاملة — من غير ما تدفع عمولة لأي منصة.

مبني بـ **Next.js 16 + Prisma + PostgreSQL + Tailwind** — قاعدة بيانات سحابية جاهزة للنشر على أي استضافة (بما فيها المجانية زي Vercel).

## ✨ اللي جواه

| للعميل | ليك (لوحة التحكم `/admin`) |
|---|---|
| صفحة هبوط بمنتجات مميزة | إحصائيات: إيراد، طلبات، عملاء |
| سلة + إتمام طلب كزائر أو بحساب | إدارة المنتجات (إضافة/تعديل/صور) |
| دفع كاش أو تحويل (مع رفع إيصال) | إدارة الطلبات وتغيير حالتها |
| 💳 دفع أونلاين بالبطاقة (Stripe، اختياري) | حالات: قيد المراجعة → مؤكّد → تم التسليم / ملغي / مرتجع |
| تتبّع الطلب برقم `SYX-XXXXXX` | قائمة العملاء |
| حساب شحن تلقائي + شحن مجاني فوق حد | ⚙️ إعدادات: بكسلات التتبّع + العرض الإضافي |
| صفحة سياسة الشحن والاسترجاع `/policy` | 📡 بكسلات Meta / TikTok / GA4 / Snap بحدث Purchase حقيقي |
| 🎁 عرض إضافي (Order Bump) وقت إتمام الطلب | |

## 🚀 التشغيل في 5 دقايق

المتطلبات:
- [Node.js](https://nodejs.org) نسخة 20 أو أحدث
- قاعدة بيانات **PostgreSQL** — أسهل حل مجاني: اعمل حساب على [Neon](https://neon.tech) أو [Supabase](https://supabase.com) وهاتلك رابط اتصال (Connection String) في ثواني (مش محتاج تثبّت حاجة على جهازك)

```bash
# 1) التبعيات
npm install

# 2) ملف البيئة — حط رابط الـ Postgres بتاعك في DATABASE_URL، وعدّل AUTH_SECRET
cp .env.example .env

# 3) قاعدة البيانات (بتنشئ الجداول تلقائيًا من migrations الجاهزة)
npx prisma migrate deploy

# 4) بيانات تجريبية + حساب الأدمن
npm run db:seed

# 5) شغّل
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) — المتجر شغّال 🎉

**لوحة التحكم:** [http://localhost:3000/admin](http://localhost:3000/admin)
الدخول الافتراضي: `admin@syntax.eg` / `Admin@12345` — **غيّرهم فورًا** (من `.env` قبل الـ seed، أو عدّل المستخدم بعدها).

## 🛠️ اعمله بتاعك (كل التخصيص في ملف واحد)

افتح **`lib/site.ts`** وعدّل:

- **اسم المتجر والوصف** — بيظهروا في الهيدر والفوتر وكل الصفحات.
- **بيانات التواصل** — الإيميل ورقم الواتساب.
- **بيانات الدفع بالتحويل** — رقم المحفظة / انستاباي / الحساب البنكي.
- **الشحن** 🚚 — التكلفة الثابتة، وحد الشحن المجاني (أو `null` لإلغائه)، ومدة التوصيل. بيتطبّق تلقائيًا على الطلبات اللي فيها منتجات ملموسة فقط.
- **سياسة الاسترجاع** ↩️ — مدة الاسترجاع ومدة رد المبلغ، وبيظهروا تلقائيًا في صفحة `/policy`.

بعد التعديل مش محتاج أي حاجة تانية — كل الصفحات بتقرا من الملف ده.

### 📡 البكسلات والعرض الإضافي (من لوحة التحكم مباشرة)

من **`/admin/settings`**:
- **البكسلات:** حط الـ ID وفعّل — Meta Pixel / TikTok / Google Analytics 4 / Snap. بتتحقن في كل الصفحات تلقائيًا، وحدث **Purchase** بيتسجّل بقيمة الطلب مع كل عملية شراء (جاهز لحملات إعادة الاستهداف من أول يوم).
- **العرض الإضافي (Order Bump):** اختار منتج + سعر خاص + عنوان مغري — بيظهر كصندوق بضغطة واحدة في صفحة إتمام الطلب، وبيرفع متوسط قيمة الطلب. السعر بيتحسب على السيرفر فمفيش تلاعب.

### 💳 الدفع الأونلاين بالبطاقة (Stripe — اختياري)

المتجر شغّال زي ما هو من غير أي إعداد (كاش + تحويل بس). لو عايز تضيف دفع بالبطاقة فوري:

1. اعمل حساب على [stripe.com](https://stripe.com) وهات مفاتيح الاختبار من [Dashboard → API keys](https://dashboard.stripe.com/apikeys).
2. في ملف `.env` حط:
   ```
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```
3. عشان الطلب يتأكّد أوتوماتيك بعد الدفع، لازم الـ webhook:
   ```bash
   # للتجربة المحلية (يحتاج Stripe CLI: stripe.com/docs/stripe-cli)
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   هيديك `whsec_...` — حطّه في `STRIPE_WEBHOOK_SECRET`. في الإنتاج، ضيف endpoint حقيقي من [Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) على `https://your-domain.com/api/stripe/webhook` واختار حدث `checkout.session.completed`.
4. `npm run dev` تاني — زرار "بطاقة (دفع أونلاين)" هيظهر في صفحة إتمام الطلب تلقائيًا.

لو سبت `STRIPE_SECRET_KEY` فاضي، خيار البطاقة بيختفي تلقائيًا والمتجر يشتغل بالكاش/التحويل زي الأول — مفيش أي كسر.

## 📦 أوامر مفيدة

```bash
npm run dev        # تشغيل التطوير
npm run build      # بناء نسخة الإنتاج
npm start          # تشغيل نسخة الإنتاج
npm run db:seed    # بيانات تجريبية + أدمن
npm run db:studio  # واجهة رسومية لقاعدة البيانات
npm run db:reset   # مسح كل حاجة والبدء من جديد
```

## 🌍 النشر (الإنتاج)

قاعدة البيانات بقت PostgreSQL سحابية، فتقدر تنشر على أي منصة تحب — بما فيها **Vercel** المجانية:

```bash
npm install && npx prisma migrate deploy && npm run build && npm start
```

- حط `DATABASE_URL` و`AUTH_SECRET` قوي في متغيرات البيئة بتاعة الاستضافة.
- لو هتضيف الدفع بالبطاقة، حط `STRIPE_SECRET_KEY` و`STRIPE_WEBHOOK_SECRET` و`NEXT_PUBLIC_SITE_URL` (برابط الدومين الحقيقي) هناك كمان.

⚠️ **حاجة واحدة لسه على القرص:** صور إثبات التحويل بتتخزّن في `public/uploads/proofs` محليًا. ده شغّال تمام على VPS عادي، لكن على منصات serverless زي **Vercel** الملفات دي بتتمسح مع كل نشر (deploy) جديد — يعني لو حد بعت إثبات دفع، ممكن تضيع الصورة لما تعمل تحديث للموقع. الحل: نخزّن الصور على تخزين سحابي (زي Cloudflare R2 أو AWS S3) بدل القرص. لو عايزني أضيفها قولّي.

### 📱 النشر من التليفون بس (من غير كمبيوتر ولا تيرمينال)

كل الخطوات دي تتعمل من متصفح الموبايل عادي:

1. **قاعدة البيانات:** اعمل مشروع على [Neon](https://neon.tech) وهات الـ connection string (شرحناه فوق).
2. **الكود:** ارفع مجلد المشروع (بعد فك الضغط) على ريبو GitHub جديد (Add file → Upload files).
3. **الاستضافة:** ادخل [vercel.com](https://vercel.com)، سجّل دخول بحساب GitHub، اختار **Add New → Project**، واختار الريبو اللي رفعته.
4. قبل ما تدوس Deploy، افتح **Environment Variables** وضيف:
   - `DATABASE_URL` = رابط Neon بتاعك
   - `AUTH_SECRET` = أي نص عشوائي طويل
   - `SEED_SECRET` = أي نص سري (هتستخدمه مرة واحدة بس دلوقتي)
   - (اختياري) `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
5. دوس **Deploy** وانتظر لحد ما يخلص (بيعمل `prisma migrate deploy` تلقائيًا كجزء من الـ build، فالجداول هتتبني لوحدها).
6. لما يخلص، هتاخد رابط زي `your-store.vercel.app`. افتح المتصفح على:
   ```
   https://your-store.vercel.app/api/seed?secret=القيمة-اللي-حطيتها-في-SEED_SECRET
   ```
   مرة واحدة بس — ده هيعمل منتجات تجريبية وحساب أدمن. هيرجّعلك رسالة تأكيد في الصفحة.
7. ادخل `https://your-store.vercel.app/admin` بـ `admin@syntax.eg` / `Admin@12345` (أو الإيميل/الباسورد اللي حطيتهم في `ADMIN_EMAIL`/`ADMIN_PASSWORD` لو ضفتهم كمتغيرات بيئة) — **وغيّر الباسورد فورًا**.
8. (اختياري لكن مستحسن) بعد ما تتأكد إن كل حاجة شغالة، امسح متغيّر `SEED_SECRET` من إعدادات Vercel عشان تقفل مسار الـ seed خالص.

كده المتجر شغّال بجد على الإنترنت بلينك حقيقي، كل ده من غير ما تحتاج كمبيوتر أو تيرمينال.

## 🧱 فين إيه؟

```
app/            الصفحات (المتجر + /admin + /policy + /track)
app/actions/    منطق السيرفر (الطلبات، الدخول، الأدمن)
app/api/        نقاط API (زي stripe webhook)
components/     مكوّنات الواجهة
lib/site.ts     ⭐ كل إعدادات متجرك
lib/orders.ts   منطق الطلبات وحالاتها
prisma/         قاعدة البيانات (schema + migrations + seed)
```

## ⬆️ رفع المشروع على GitHub

أهم حاجة: **متعملش رفع للملف الـ .zip نفسه** من واجهة GitHub — لازم تفك الضغط الأول، وبعدين تستخدم git. أسهل طريقة (من جهازك، مش من المتصفح):

```bash
# 1) فُك الضغط عن المشروع وادخل المجلد (لو لسه معملتش كده)
cd ecommerce-ai-builders

# 2) اعمل ريبو جديد فاضي على github.com (من غير README ولا .gitignore — المشروع فيهم أصلاً)
#    وانسخ رابطه، هيكون شكله: https://github.com/USERNAME/REPO.git

# 3) جهّز الريبو المحلي وارفعه
git init
git add .
git commit -m "أول نسخة من المتجر"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main
```

لو ظهرلك خطأ إن git مش معروف كأمر، لازم تثبّت [Git](https://git-scm.com/downloads) الأول. ولو ظهرلك خطأ صلاحيات (`Permission denied` أو `403`)، يبقى لازم تسجّل دخول GitHub من التيرمينال (اعمل [Personal Access Token](https://github.com/settings/tokens) واستخدمه بدل الباسورد وقت الـ push).

⚠️ **متعملش commit لملف `.env`** — فيه مفاتيحك السرية. الملف `.gitignore` أصلاً بيستثنيه، فمتلمسوش.
