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


const app = express();
const PORT = process.env.PORT || 4000 ;

await connectDB();
await connectCloudinary();

//allowed orgins 
const allowedOrgins = ['http://localhost:5173']

// MIDDLEWARE Configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrgins, credentials: true}));




app.get('/', (req, res)=> res.send('API is Working'));
app.use('/api/user',userRouter);
app.use('/api/seller',sellerRouter);
app.use('/api/product',productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);






app.listen(PORT, ()=> {
  console.log(`Server is running on http://localhost:${PORT}`)

})