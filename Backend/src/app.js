import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './modules/auth/routes/auth.routes.js';
import foodRoutes from './modules/food/routes/food.routes.js';
import cartRoutes from './modules/cart/routes/cart.routes.js';
import foodDiscount from './modules/food-discount/routes/foodDiscount.route.js';


app.use(cors({
  origin:[
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
   allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'] 
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());



app.get('/', (req, res) => {
    res.send("Hello World");
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/food-discount', foodDiscount);

export default app;