import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./config/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import addressRouter from "./routes/addressRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";
import cookieParser from "cookie-parser";

const app = express();

// Connect DB & Cloudinary once on module load (top-level await allowed in ESM)
await connectDB();
await connectCloudinary();

// Stripe webhook must accept raw body BEFORE express.json/cookieParser to preserve signature
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// Regular JSON middleware and cookies
app.use(express.json());
app.use(cookieParser());

// Use FRONTEND origin from env (set FRONTEND_URL in Vercel)
const FRONTEND_URL = process.env.FRONTEND_URL || "https://green-cart-frontend-azure.vercel.app";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);

app.get("/", (req, res) => res.send("API is Working"));

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// IMPORTANT: For Vercel serverless, DO NOT call app.listen(). Export the app.
// If you later host on a VM/server, you can use app.listen(process.env.PORT || 4000).
export default app;
