import "server-only";
import Stripe from "stripe";

// الدفع بالبطاقة اختياري بالكامل — لو المفتاح مش موجود في .env
// بنرجّع null وخيار "بطاقة" بيختفي من صفحة الدفع تلقائيًا (شوف checkout.ts).
let _stripe: Stripe | null | undefined;

export function getStripe(): Stripe | null {
  if (_stripe !== undefined) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  _stripe = key ? new Stripe(key) : null;
  return _stripe;
}

export function isCardPaymentEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
    /\/+$/,
    ""
  );
}

export type CheckoutLine = {
  name: string;
  priceCents: number; // بالقروش/السنت
  qty: number;
};

/**
 * ينشئ جلسة دفع Stripe Checkout لطلب معين ويرجّع رابط التحويل.
 * السعر بيتحسب هنا من بيانات السيرفر (snapshot الطلب) — مش من أي حاجة جاية من العميل.
 */
export async function createCheckoutSession(params: {
  orderId: string;
  orderNumber: string;
  currency: string; // مثال: "egp"
  lines: CheckoutLine[];
  shippingCents: number;
  customerEmail?: string | null;
}): Promise<{ url: string; sessionId: string } | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const currency = (params.currency || "egp").toLowerCase();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
    params.lines.map((l) => ({
      quantity: l.qty,
      price_data: {
        currency,
        unit_amount: l.priceCents,
        product_data: { name: l.name },
      },
    }));

  if (params.shippingCents > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency,
        unit_amount: params.shippingCents,
        product_data: { name: "الشحن" },
      },
    });
  }

  const base = siteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    customer_email: params.customerEmail || undefined,
    success_url: `${base}/orders/${params.orderNumber}?paid=1`,
    cancel_url: `${base}/checkout?cancelled=1`,
    metadata: { orderId: params.orderId, orderNumber: params.orderNumber },
  });

  if (!session.url) return null;
  return { url: session.url, sessionId: session.id };
}
