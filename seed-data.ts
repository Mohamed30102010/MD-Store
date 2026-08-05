import bcrypt from "bcryptjs";
import type { PrismaClient } from "@/app/generated/prisma/client";

// منتجات تجريبية — مزيج رقمي وملموس
export const SEED_PRODUCTS = [
  {
    slug: "course-fullstack",
    name: "كورس فُل-ستاك من الصفر للاحتراف",
    shortDesc: "أكتر من 40 ساعة عملي + مشاريع حقيقية",
    description:
      "كورس شامل يمشي معاك خطوة بخطوة من أساسيات الويب لحد ما تبني وتنشر مشاريع كاملة. يشمل تمارين، مشاريع، وشهادة إتمام.",
    priceCents: 79900,
    compareAtCents: 149900,
    type: "digital",
    images: JSON.stringify(["/products/course-fullstack.svg"]),
    featured: true,
  },
  {
    slug: "ebook-freelance",
    name: "كتاب: دليل الفريلانسر المصري",
    shortDesc: "PDF عملي لبدء دخلك بالدولار",
    description:
      "دليل عملي (PDF) بيشرح إزاي تبدأ شغل حر، تظبط بروفايلك، وتجيب أول عميل — بأمثلة من السوق المصري.",
    priceCents: 14900,
    compareAtCents: 24900,
    type: "digital",
    images: JSON.stringify(["/products/ebook-freelance.svg"]),
    featured: true,
  },
  {
    slug: "notebook-dev",
    name: "نوتة المبرمج الأنيقة",
    shortDesc: "نوتة A5 غلاف صلب + تصميم خاص",
    description:
      "نوتة عملية بغلاف صلب وورق فاخر، مصممة لملاحظات الأكواد والأفكار. مقاس A5، 200 صفحة.",
    priceCents: 18000,
    compareAtCents: null,
    type: "physical",
    images: JSON.stringify(["/products/notebook-dev.svg"]),
    featured: true,
  },
  {
    slug: "tshirt-code",
    name: 'تيشيرت "It works on my machine"',
    shortDesc: "قطن 100% — مقاسات متعددة",
    description:
      "تيشيرت قطن مريح بطبعة عالية الجودة. متوفر بمقاسات S / M / L / XL بألوان متعددة.",
    priceCents: 29900,
    compareAtCents: 39900,
    type: "physical",
    images: JSON.stringify(["/products/tshirt-code.svg"]),
    featured: true,
  },
  {
    slug: "template-portfolio",
    name: "قالب بورتفوليو جاهز (Next.js)",
    shortDesc: "قالب احترافي تنشره في دقايق",
    description:
      "قالب بورتفوليو جاهز بتقنية Next.js + Tailwind، سهل التخصيص وجاهز للنشر. يشمل صفحات أعمال ومدونة وتواصل.",
    priceCents: 24900,
    compareAtCents: null,
    type: "digital",
    images: JSON.stringify(["/products/template-portfolio.svg"]),
    featured: true,
  },
  {
    slug: "mug-coffee",
    name: 'مج القهوة "while(alive) code()"',
    shortDesc: "سيراميك 350ml — يدخل الميكروويف",
    description:
      "مج سيراميك بجودة عالية وطبعة ثابتة لا تبهت. سعة 350ml، آمن للميكروويف والغسالة.",
    priceCents: 12000,
    compareAtCents: 16000,
    type: "physical",
    images: JSON.stringify(["/products/mug-coffee.svg"]),
    featured: false,
  },
];

export type SeedResult = {
  productsCount: number;
  adminEmail: string;
};

/**
 * بيعمل seed للمنتجات التجريبية وحساب الأدمن. Idempotent (upsert) — تقدر
 * تناديها أكتر من مرة من غير ما تتكرر البيانات.
 */
export async function seedDatabase(prisma: PrismaClient): Promise<SeedResult> {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@syntax.eg";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@12345";

  for (const p of SEED_PRODUCTS) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "admin", passwordHash },
    create: {
      name: "أدمن المتجر",
      email: ADMIN_EMAIL,
      passwordHash,
      role: "admin",
    },
  });

  const productsCount = await prisma.product.count();
  return { productsCount, adminEmail: ADMIN_EMAIL };
}
