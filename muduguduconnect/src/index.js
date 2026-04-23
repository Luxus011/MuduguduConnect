require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./database/index');

const app = express();
const PORT = process.env.PORT || 3000;

// ── MIDDLEWARE ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ── ROUTES ──
app.use('/api/auth',    require('./routes/auth.routes'));
app.use('/api/workers', require('./routes/worker.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/chatbot', require('./routes/chatbot.routes'));

// ── SERVE FRONTEND ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── ERROR HANDLER ──
app.use(require('./middleware/errorHandler'));

// ── START ──
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync({ force: true });
    app.listen(PORT, () => console.log(`🚀 MuduguduConnect running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Startup error:', err);
    process.exit(1);
  }
})();
