import cookieParser from "cookie-parser";
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

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// ✅ STEP 1: CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local testing
      "https://green-cart-frontend-iota.vercel.app", // your Vercel frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ STEP 2: Handle Stripe raw body before JSON parsing
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

// ✅ STEP 3: Apply general middleware
app.use(express.json());
app.use(cookieParser());

// ✅ STEP 4: Health check
app.get("/", (req, res) => res.send("API is Working"));

// ✅ STEP 5: Mount routes
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

// ✅ STEP 6: Start server
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
}

export default app;
