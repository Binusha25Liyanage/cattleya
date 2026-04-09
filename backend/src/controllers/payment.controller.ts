import type { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/db";
import { buildPayHereHash, verifyPayHereSignature } from "../services/payment.service";
import { emailService } from "../services/email.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-01-27.acacia" as Stripe.LatestApiVersion });

export async function initiatePayHere(req: Request, res: Response) {
  const order = await prisma.order.findUnique({ where: { id: req.body.orderId }, include: { user: true } });
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  const merchantId = process.env.PAYHERE_MERCHANT_ID || "";
  const merchantSecret = process.env.PAYHERE_SECRET || "";
  const amount = Number(order.total).toFixed(2);
  const hash = buildPayHereHash({ merchantId, orderId: order.id, amount, currency: "LKR", merchantSecret });
  res.json({
    success: true,
    data: {
      merchant_id: merchantId,
      return_url: `${process.env.FRONTEND_URL}/orders`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
      notify_url: `${process.env.FRONTEND_URL}/api/payment/payhere/notify`,
      order_id: order.id,
      items: `CATTLEYA Order ${order.id}`,
      amount,
      currency: "LKR",
      first_name: order.user.name.split(" ")[0] || order.user.name,
      last_name: order.user.name.split(" ").slice(1).join(" ") || order.user.name,
      email: order.user.email,
      phone: order.user.phone || "",
      address: "",
      city: "",
      country: "Sri Lanka",
      hash,
    },
  });
}

export async function payHereNotify(req: Request, res: Response) {
  const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig, payment_id } = req.body;
  const valid = verifyPayHereSignature({
    merchantId: merchant_id,
    orderId: order_id,
    payhereAmount: payhere_amount,
    payhereCurrency: payhere_currency,
    statusCode: status_code,
    merchantSecret: process.env.PAYHERE_SECRET || "",
    md5sig,
  });
  if (status_code === "2" && valid) {
    const order = await prisma.order.update({ where: { id: order_id }, data: { paymentStatus: "PAID", status: "CONFIRMED", paymentRef: payment_id, paymentMethod: "PAYHERE" }, include: { user: true } });
    await emailService.sendOrderConfirmation(order.user.email, `Order #${order.id} has been paid.`).catch(() => null);
  }
  res.json({ success: true, data: { received: true } });
}

export async function createStripeIntent(req: Request, res: Response) {
  const intent = await stripe.paymentIntents.create({ amount: Math.round(Number(req.body.amount) * 100), currency: "usd", metadata: { orderId: req.body.orderId } });
  res.json({ success: true, data: { clientSecret: intent.client_secret } });
}

export async function stripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata.orderId;
      if (orderId) {
        await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: "PAID", status: "CONFIRMED", paymentRef: intent.id, paymentMethod: "STRIPE" } });
      }
    }
    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error instanceof Error ? error.message : "Unknown"}`);
  }
}
