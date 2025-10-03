import express from 'express';
import {signup, signin, logout, fetch, me, toggleSavedPublication, toggleFavoritePublication, getUserPublications} from '../controllers/authController.js'
import { googleAuth, googleAuthCallback, googleAuthSuccess } from '../controllers/googleAuthController.js';
import { requireAuth } from '../middlewares/auth.js';
const authRouter = express.Router();

authRouter.post('/signup',signup)
authRouter.post('/signin',signin)
authRouter.post('/logout',logout)
authRouter.get('/fetch', requireAuth, fetch)
authRouter.get('/me', requireAuth, me)
authRouter.post('/toggle-saved', requireAuth, toggleSavedPublication)
authRouter.post('/toggle-favorite', requireAuth, toggleFavoritePublication)
authRouter.get('/user-publications', requireAuth, getUserPublications)

// Google OAuth routes
authRouter.get('/google', googleAuth);
authRouter.get('/google/callback', googleAuthCallback);
authRouter.get('/google/success', googleAuthSuccess);

export default authRouter;