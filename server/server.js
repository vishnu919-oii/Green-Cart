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
const port = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// MUST COME FIRST
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "https://green-cart-frontend-ten.vercel.app",
    credentials: true,
  })
);

// Stripe webhook AFTER middleware
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.get("/", (req, res) => res.send("API is Working"));

app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);

app.listen(port, () => console.log(`Server started on PORT:${port}`));

export default app;
