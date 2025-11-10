import cookieParser from 'cookie-parser';
import express from  'express';
import cors from 'cors';
import connectDB from './config/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './config/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import addressRouter from './routes/addressRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';


const app = express();

await connectDB();
await connectCloudinary();

//allowed orgins 
const allowedOrigins = [
  "http://localhost:5173",
  "https://green-cart-frontend-alpha.vercel.app"
];
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);



// MIDDLEWARE Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));




app.get('/', (req, res)=> res.send('API is Working'));
app.use('/api/user',userRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/product',productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);








export default app; // ✅ required by Vercel