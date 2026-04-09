import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { createStripeIntent, initiatePayHere, payHereNotify, stripeWebhook } from "../controllers/payment.controller";

const router = Router();

router.post("/payhere/initiate", authenticate, initiatePayHere);
router.post("/payhere/notify", payHereNotify);
router.post("/stripe/create-intent", authenticate, createStripeIntent);
router.post("/stripe/webhook", stripeWebhook);

export default router;
