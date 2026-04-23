const router  = require('express').Router();
const ctrl    = require('../controller/auth.controller');
const protect = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', ctrl.register);

// POST /api/auth/verify-email
router.post('/verify-email', ctrl.verifyEmail);

// POST /api/auth/login
router.post('/login', ctrl.login);

// GET /api/auth/me  (protected)
router.get('/me', protect, ctrl.me);

// POST /api/auth/logout (protected)
router.post('/logout', protect, ctrl.logout);

module.exports = router;
