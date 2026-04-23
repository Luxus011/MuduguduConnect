const { Op }           = require('sequelize');
const { Worker, User } = require('../database/index');

// GET /api/workers
exports.getAll = async (req, res, next) => {
  try {
    const { job, location, availability, sort = 'rating', boosted } = req.query;
    const where = {};
    if (job)          where.job          = job;
    if (location)     where.location     = { [Op.like]: `%${location}%` };
    if (availability) where.availability = availability;
    if (boosted)      where.boosted      = true;

    const order = sort === 'rating'      ? [['rating', 'DESC']]
                : sort === 'reviews'     ? [['review_count', 'DESC']]
                : sort === 'rate_asc'    ? [['rate_per_day', 'ASC']]
                : sort === 'rate_desc'   ? [['rate_per_day', 'DESC']]
                : [['rating', 'DESC']];

    // Boosted workers always appear first
    const workers = await Worker.findAll({
      where,
      include: [{ model: User, attributes: ['name', 'verified'] }],
      order: [['boosted', 'DESC'], ...order],
    });
    res.json(workers);
  } catch (err) { next(err); }
};

// GET /api/workers/recommended
exports.getRecommended = async (req, res, next) => {
  try {
    const workers = await Worker.findAll({
      where: { availability: { [Op.ne]: 'Booked' } },
      include: [{ model: User, attributes: ['name', 'verified'] }],
      order: [['boosted', 'DESC'], ['rating', 'DESC']],
      limit: 6,
    });
    res.json(workers);
  } catch (err) { next(err); }
};

// GET /api/workers/emergency
exports.getEmergency = async (req, res, next) => {
  try {
    const workers = await Worker.findAll({
      where: { availability: 'Available Now', is_online: true },
      include: [{ model: User, attributes: ['name', 'verified'] }],
      order: [['trust_score', 'DESC'], ['rating', 'DESC']],
      limit: 8,
    });
    res.json(workers);
  } catch (err) { next(err); }
};

// GET /api/workers/:id
exports.getOne = async (req, res, next) => {
  try {
    const worker = await Worker.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name', 'email', 'verified'] }],
    });
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    res.json(worker);
  } catch (err) { next(err); }
};

// POST /api/workers
exports.create = async (req, res, next) => {
  try {
    const { job, location, availability, description, skills, rate_per_day, exp_years, phone } = req.body;
    if (!job || !location) return res.status(400).json({ error: 'job and location required' });
    const photo = req.file ? req.file.filename : null;
    const worker = await Worker.create({
      user_id: req.userId, job, location, availability, description,
      skills: skills || [], rate_per_day, exp_years, phone, photo,
    });
    res.status(201).json(worker);
  } catch (err) { next(err); }
};

// PUT /api/workers/:id
exports.update = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!worker) return res.status(404).json({ error: 'Not found or not your profile' });
    const photo = req.file ? req.file.filename : worker.photo;
    await worker.update({ ...req.body, photo });
    res.json(worker);
  } catch (err) { next(err); }
};

// PUT /api/workers/:id/availability
exports.updateAvailability = async (req, res, next) => {
  try {
    const worker = await Worker.findOne({ where: { id: req.params.id, user_id: req.userId } });
    if (!worker) return res.status(404).json({ error: 'Not found or not your profile' });
    await worker.update({ availability: req.body.availability, is_online: req.body.is_online });
    res.json({ message: 'Updated', availability: worker.availability });
  } catch (err) { next(err); }
};
