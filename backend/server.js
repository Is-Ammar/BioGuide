import express from 'express';
// import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRouter from './routes/authRouter.js';

const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Support both common Vite ports
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());


dotenv.config();
const PORT = process.env.PORT;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(()=>{
    app.listen(PORT,() => {
        console.log(`✅ Server is running on ${PORT}`)
    });
}).catch((error)=>{
    console.log("❌ Mongo connection failed:", error);
});

app.use("/api/auth",authRouter)

app.get('/',(req,res)=>
{
    res.send("hello i am an api check /api/auth/(signin,signup,logout,fetch)");
})

