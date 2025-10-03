import jwt from 'jsonwebtoken';
import passport from 'passport';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Check if Google OAuth is configured
const isGoogleConfigured = () => {
  return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
};

export const googleAuth = (req, res, next) => {
  if (!isGoogleConfigured()) {
    return res.status(503).json({ 
      success: false, 
      message: 'Google OAuth is not configured on this server' 
    });
  }
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
};

export const googleAuthCallback = (req, res, next) => {
  if (!isGoogleConfigured()) {
    return res.redirect(`${FRONTEND_URL}/login?error=oauth_not_configured`);
  }
  
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/login` }, (err, user, info) => {
    if (err) {
      console.error('Google Auth Error:', err);
      return res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
    
    if (!user) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_user`);
    }
    
    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '1d' }
    );
    
    // Redirect to frontend with token as query parameter
    // Frontend should extract token and store it in localStorage
    res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  })(req, res, next);
};

export const googleAuthSuccess = (req, res) => {
  if (!isGoogleConfigured()) {
    return res.status(503).json({ 
      success: false, 
      message: 'Google OAuth is not configured on this server' 
    });
  }
  
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const token = jwt.sign(
    {
      id: req.user._id,
      email: req.user.email
    },
    process.env.TOKEN_SECRET,
    { expiresIn: '1d' }
  );
  
  const user = {
    _id: req.user._id,
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    country: req.user.country,
    phone_number: req.user.phone_number,
    createdAt: req.user.createdAt
  };
  
  return res.status(200).json({
    success: true,
    message: 'Google authentication successful',
    token,
    user
  });
};
