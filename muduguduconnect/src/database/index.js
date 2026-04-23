const { Sequelize } = require('sequelize');
const config = require('../config/db')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

// ── MODELS ──
const User   = require('./models/User')(sequelize);
const Worker = require('./models/Worker')(sequelize);
const Review = require('./models/Review')(sequelize);
const Report = require('./models/Report')(sequelize);

// ── ASSOCIATIONS ──
User.hasOne(Worker,    { foreignKey: 'user_id', onDelete: 'CASCADE' });
Worker.belongsTo(User, { foreignKey: 'user_id' });

Worker.hasMany(Review, { foreignKey: 'worker_id', onDelete: 'CASCADE' });
Review.belongsTo(Worker, { foreignKey: 'worker_id' });

User.hasMany(Review,   { foreignKey: 'employer_id', as: 'givenReviews' });
Review.belongsTo(User, { foreignKey: 'employer_id', as: 'employer' });

User.hasMany(Report,   { foreignKey: 'reporter_id', as: 'reportsMade' });
User.hasMany(Report,   { foreignKey: 'target_id',   as: 'reportsReceived' });

module.exports = { sequelize, User, Worker, Review, Report };
