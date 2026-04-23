const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { User } = require('../database/index');
const emailSvc = require('../services/email.service');

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });
const genCode  = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
      return res.status(400).json({ error: 'All fields required' });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    const code  = genCode();
    const user  = await User.create({
      name, email, password: hash, role,
      verify_code: code,
      verify_expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    });

    await emailSvc.sendVerification(email, name, code);

    res.status(201).json({ message: 'Registered. Check email for verification code.', userId: user.id });
  } catch (err) { next(err); }
};

// POST /api/auth/verify-email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.verified) return res.json({ message: 'Already verified' });
    if (user.verify_code !== code || user.verify_expires < new Date())
      return res.status(400).json({ error: 'Invalid or expired code' });

    await user.update({ verified: true, verify_code: null, verify_expires: null });
    res.json({ message: 'Email verified', token: genToken(user.id) });
  } catch (err) { next(err); }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    res.json({
      token: genToken(user.id),
      user: { id: user.id, name: user.name, email: user.email, role: user.role, verified: user.verified },
    });
  } catch (err) { next(err); }
};

// GET /api/auth/me
exports.me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, { attributes: { exclude: ['password', 'verify_code'] } });
    res.json(user);
  } catch (err) { next(err); }
};

// POST /api/auth/logout
exports.logout = async (req, res, next) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (err) { next(err); }
};
