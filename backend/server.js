import express from 'express';
// import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRouter from './routes/authRouter.js';

const UPSTREAM_CHAT_URL = 'https://eve-paracusic-lorenza.ngrok-free.dev/ask';

const app = express();
// app.use(express.urlencoded({ extended: true }));
// app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());


dotenv.config();
const PORT = process.env.PORT || 4000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(()=>{
    app.listen(PORT,() => {
        console.log(`✅ Server is running on ${PORT}`)
    });
}).catch((error)=>{
    console.log("❌ Mongo connection failed:", error);
});

app.use("/api/auth",authRouter)

app.post('/api/chat', async (req, res) => {

    try {
        const { question } = req.body || {};
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ error: 'Missing question' });
        }
        const upstreamResp = await fetch(UPSTREAM_CHAT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        console.log('> upstream status', upstreamResp.status);
        const text = await upstreamResp.text();
        let data;
        try { data = JSON.parse(text); } catch { data = { raw: text }; }
        return res.status(upstreamResp.status).json(data);
    } catch (err) {
        console.error('Chat proxy error:', err);
        return res.status(502).json({ error: 'Upstream chat service unavailable' });
    }
});

app.get('/',(req,res)=>
{
    res.send("hello i am an api check /api/auth/(signin,signup,logout,fetch)");
})

