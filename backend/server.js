import express from 'express';
// import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import path from 'path';
import fs from 'fs';

import authRouter from './routes/authRouter.js';
import { requireAuth } from './middlewares/auth.js';
import User from './models/userModel.js';
import jwt from 'jsonwebtoken';
import {
  ensureDataLoaded,
  getAllRawData,
  getDashboardData,
  getInspectorData,
  getAllPublications,
  findRecordById,
  findPublicationById,
  buildPublicationResponse
} from './utils/dataService.js';

// Load environment variables FIRST
dotenv.config();

const UPSTREAM_CHAT_URL = 'https://eve-paracusic-lorenza.ngrok-free.dev/ask';
const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

const app = express();

// Middleware setup - order matters!
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware (must come before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy - only configure if credentials exist
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:${PORT}/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ email: profile.emails[0].value });
          
          if (!user) {
            // Create new user from Google profile
            user = new User({
              first_name: profile.name.givenName || profile.displayName,
              last_name: profile.name.familyName || '',
              email: profile.emails[0].value,
              password: 'google-oauth-' + profile.id, // Placeholder, won't be used for login
              phone_number: '', // Optional field
              country: '', // Optional field
              googleId: profile.id
            });
            await user.save();
          } else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = profile.id;
            await user.save();
          }
          
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
  
  console.log('✅ Google OAuth configured');
} else {
  console.log('⚠️  Google OAuth not configured - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  console.log('   Add these to your .env file to enable Google login');
}

// Connect to MongoDB and start server
mongoose.connect(MONGOURL).then(()=>{
    app.listen(PORT,() => {
        console.log(`✅ Server is running on ${PORT}`)
    });
}).catch((error)=>{
    console.log("❌ Mongo connection failed:", error);
});

// Routes
app.use("/api/auth", authRouter);
    
app.post('/api/chat', requireAuth, async (req, res) => {

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

app.get('/',(req,res)=> {
    res.send("hello i am an api check /api/auth/(signin,signup,logout,fetch) - chat protected");
});

// ---- Unified Data Endpoints ----
// Primary raw data endpoint
app.get('/api/data', (req, res) => {
  try {
    ensureDataLoaded();
    res.json(getAllRawData());
  } catch (err) {
    console.error('Error serving /api/data:', err);
    res.status(500).json({ error: 'Failed to load data' });
  }
});

// Dashboard optimized data
app.get('/api/dashboard', (req, res) => {
  try {
    ensureDataLoaded();
    res.json(getDashboardData());
  } catch (err) {
    console.error('Error serving /api/dashboard:', err);
    res.status(500).json({ error: 'Failed to build dashboard data' });
  }
});

// Inspector endpoint split (express v5 path-to-regexp optional param issue)
app.get('/api/inspector', (req, res) => {
  try {
    ensureDataLoaded();
    res.json(getInspectorData());
  } catch (err) {
    console.error('Error serving /api/inspector:', err);
    res.status(500).json({ error: 'Failed to build inspector data' });
  }
});
app.get('/api/inspector/:id', (req, res) => {
  try {
    ensureDataLoaded();
    const { id } = req.params;
    const record = findRecordById(id);
    if (!record) return res.status(404).json({ error: 'Record not found', id });
    return res.json(record);
  } catch (err) {
    console.error('Error serving /api/inspector/:id:', err);
    res.status(500).json({ error: 'Failed to build inspector record' });
  }
});

// Publications endpoint split
app.get('/api/publications', (req, res) => {
  try {
    ensureDataLoaded();
    res.json({ publications: getAllPublications() });
  } catch (err) {
    console.error('Error serving /api/publications:', err);
    res.status(500).json({ error: 'Failed to build publications data' });
  }
});
app.get('/api/publications/:pubId', (req, res) => {
  try {
    ensureDataLoaded();
    const { pubId } = req.params;
    const pub = findPublicationById(pubId);
    if (!pub) return res.status(404).json({ error: 'Publication not found', id: pubId });
    return res.json(buildPublicationResponse(pub));
  } catch (err) {
    console.error('Error serving /api/publications/:pubId:', err);
    res.status(500).json({ error: 'Failed to build publication data' });
  }
});
