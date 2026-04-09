import crypto from "crypto";

export function md5(value: string) {
  return crypto.createHash("md5").update(value).digest("hex").toUpperCase();
}

export function buildPayHereHash(params: {
  merchantId: string;
  orderId: string;
  amount: string;
  currency: string;
  merchantSecret: string;
}) {
  return md5(`${params.merchantId}${params.orderId}${params.amount}${params.currency}${md5(params.merchantSecret)}`);
}

export function verifyPayHereSignature(params: {
  merchantId: string;
  orderId: string;
  payhereAmount: string;
  payhereCurrency: string;
  statusCode: string;
  merchantSecret: string;
  md5sig: string;
}) {
  const expected = md5(
    `${params.merchantId}${params.orderId}${params.payhereAmount}${params.payhereCurrency}${params.statusCode}${md5(params.merchantSecret)}`
  );
  return expected === params.md5sig.toUpperCase();
}
