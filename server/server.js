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
const PORT = process.env.PORT || 4000 ;

await connectDB();
await connectCloudinary();



app.use(cors({
  origin:"https://green-cart-frontend-iota.vercel.app",
  credentials: true,
}));
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);


// MIDDLEWARE Configuration
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res)=> res.send('API is Working'));


app.use('/api/user',userRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/product',productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
  });
}

export default app;