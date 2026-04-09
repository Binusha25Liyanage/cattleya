import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import passport from "passport";
import { configurePassport } from "./config/passport";
import { generalRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import customizeRoutes from "./routes/customize.routes";
import paymentRoutes from "./routes/payment.routes";
import reviewRoutes from "./routes/review.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import { createSocketServer } from "./socket/socketServer";

configurePassport();

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(generalRateLimiter);

app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customize", customizeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
const server = http.createServer(app);
createSocketServer(server);

if (process.env.NODE_ENV !== "test") {
  server.listen(port, () => {
    console.log(`CATTLEYA backend running on port ${port}`);
  });
}

export default app;
