const { Review, Worker } = require('../database/index');

// POST /api/reviews
exports.create = async (req, res, next) => {
  try {
    const { worker_id, rating, comment } = req.body;
    if (!worker_id || !rating || !comment)
      return res.status(400).json({ error: 'worker_id, rating, comment required' });

    const review = await Review.create({ worker_id, employer_id: req.userId, rating, comment });

    // Recompute worker rating
    const all = await Review.findAll({ where: { worker_id } });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    await Worker.update(
      { rating: Math.round(avg * 10) / 10, review_count: all.length },
      { where: { id: worker_id } }
    );

    res.status(201).json(review);
  } catch (err) { next(err); }
};

// GET /api/reviews/:worker_id
exports.getForWorker = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { worker_id: req.params.worker_id },
      order: [['created_at', 'DESC']],
    });
    res.json(reviews);
  } catch (err) { next(err); }
};
