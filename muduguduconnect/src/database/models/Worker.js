const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Worker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  job: {
    type: DataTypes.ENUM(
      'Cleaner', 'Babysitter', 'Guard', 'Cook', 'Gardener',
      'Driver', 'Nurse', 'Night guard'
    ),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  availability: {
    type: DataTypes.ENUM('Available Now', 'Available This Week', 'Booked'),
    defaultValue: 'Available Now',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const rawValue = this.getDataValue('skills');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(val) {
      this.setDataValue('skills', JSON.stringify(val));
    },
  },
  rate_per_day: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'In RWF',
  },
  exp_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  review_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  trust_score: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    validate: { min: 0, max: 100 },
  },
  boosted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Premium boost feature',
  },
  is_online: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'workers',
  timestamps: true,
  underscored: true,
});
