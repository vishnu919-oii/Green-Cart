import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import connectDB from './config/db.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';

const app = express();
const PORT = process.env.PORT || 4000;

await connectDB();
await connectCloudinary();

// ✅ Always put JSON + cookieParser before CORS-protected routes
app.use(express.json());
app.use(cookieParser());

// ✅ Then enable CORS
app.use(
  cors({
    origin: ["https://green-cart-frontend-iota.vercel.app"],
    credentials: true,
  })
);

// ✅ Stripe webhook before JSON parsing (keep as raw)
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

app.get('/', (req, res) => res.send('API is Working'));

// ✅ Routes
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
}

export default app;
