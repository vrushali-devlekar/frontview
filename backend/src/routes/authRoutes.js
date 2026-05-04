const express = require('express');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const {
  registerUser,
  authSuccess,
  logout,
  oauthSuccess,
  getMe,
  updateMe,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('username').notEmpty().withMessage('Username is required'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const router = express.Router();
const isProduction = process.env.NODE_ENV === 'production';
const buildCallbackUrl = (req, provider) =>
  `${req.protocol}://${req.get('host')}/api/auth/${provider}/callback`;

router.get('/debug/google-callback', (req, res) => {
  const callbackUrl = isProduction
    ? undefined
    : buildCallbackUrl(req, 'google');
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  res.json({
    success: true,
    nodeEnv: process.env.NODE_ENV || 'development',
    host: req.get('host'),
    protocol: req.protocol,
    computedCallback: callbackUrl || 'strategy/runtime callback (production mode)',
    googleClientIdTail: clientId ? clientId.slice(-45) : '',
  });
});

router.post('/register', registerValidation, registerUser);

router.post('/login', loginValidation, (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || 'Invalid email or password',
      });
    }

    req.user = user;
    return authSuccess(req, res, next);
  })(req, res, next);
});

router.get('/github', (req, res, next) =>
  passport.authenticate('github', {
    scope: ['user:email', 'repo'],
    ...(isProduction ? {} : { callbackURL: buildCallbackUrl(req, 'github') }),
  })(req, res, next)
);

router.get('/github/callback', (req, res, next) =>
  passport.authenticate('github', {
    failureRedirect: '/api/auth/login-failed',
    ...(isProduction ? {} : { callbackURL: buildCallbackUrl(req, 'github') }),
  })(req, res, next),
oauthSuccess
);

router.get('/google', (req, res, next) =>
  (console.log('[OAuth][Google] host=', req.get('host'), 'protocol=', req.protocol, 'callback=', isProduction ? '(strategy/runtime)' : buildCallbackUrl(req, 'google')),
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    ...(isProduction ? {} : { callbackURL: buildCallbackUrl(req, 'google') }),
  })(req, res, next))
);

router.get('/google/callback', (req, res, next) =>
  passport.authenticate('google', {
    failureRedirect: '/api/auth/login-failed',
    ...(isProduction ? {} : { callbackURL: buildCallbackUrl(req, 'google') }),
  })(req, res, next),
oauthSuccess
);

router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/password', protect, updatePassword);

router.get('/login-failed', (req, res) => {
  res
    .status(401)
    .json({ success: false, message: 'OAuth Authentication Failed' });
});

module.exports = router;
