import express from 'express';
import {signup, signin, logout,fetch} from '../controllers/authController.js'
const authRouter = express.Router();

authRouter.post('/signup',signup)
authRouter.post('/signin',signin)
authRouter.post('/logout',logout)
authRouter.get('/fetch',fetch)
export default authRouter;