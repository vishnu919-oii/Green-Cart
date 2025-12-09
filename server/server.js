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

// Connect DB and Cloudinary
await connectDB();
await connectCloudinary();

//  1. CORS MUST COME FIRST
app.use(
  cors({
    origin: "https://green-cart-ecommerce-av.vercel.app",
    credentials: true,
  })
);

// 2. Stripe raw webhook (must be before JSON parser)
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

//  3. Normal middleware
app.use(express.json());
app.use(cookieParser());

//  4. Test API
app.get("/", (req, res) => res.send("API is Working"));

//  5. Routers
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

//  6. Export for Vercel
export default app;
