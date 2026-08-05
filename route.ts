import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed-data";

// المسار ده بيسمحلك تعمل seed لقاعدة البيانات (منتجات تجريبية + حساب أدمن)
// بمجرد فتح رابط في المتصفح — مفيد لو بتنشر من غير ما يكون معاك تيرمينال
// (مثلاً بتنشر من التليفون على Vercel). لازم متغيّر SEED_SECRET يكون
// متظبط في بيئة التشغيل، ولازم تحطه في الرابط عشان يشتغل:
//   https://your-site.vercel.app/api/seed?secret=YOUR_SECRET
//
// آمن تعمله أكتر من مرة (idempotent). بعد ما تخلّص، تقدر تمسح SEED_SECRET
// من إعدادات البيئة عشان تقفل المسار خالص.

export async function GET(req: NextRequest) {
  const expected = process.env.SEED_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "SEED_SECRET مش متظبط في بيئة التشغيل — المسار ده مقفول." },
      { status: 404 }
    );
  }

  const provided = req.nextUrl.searchParams.get("secret");
  if (provided !== expected) {
    return NextResponse.json({ error: "secret غلط." }, { status: 401 });
  }

  try {
    const result = await seedDatabase(prisma);
    return NextResponse.json({
      ok: true,
      message: `تم بنجاح — ${result.productsCount} منتج، وحساب الأدمن جاهز.`,
      adminEmail: result.adminEmail,
      note: "لو معملتش ADMIN_PASSWORD في متغيرات البيئة، الباسورد الافتراضي Admin@12345 — غيّره بعد أول دخول.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "حصل خطأ غير متوقع." },
      { status: 500 }
    );
  }
}
