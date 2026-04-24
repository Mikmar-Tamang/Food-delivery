import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';
import foodRoutes from './routes/food.routes.js';


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


export default app;