const { Report } = require('../database/index');

// POST /api/reports
exports.create = async (req, res, next) => {
  try {
    const { target_id, reason, details } = req.body;
    if (!target_id || !reason) return res.status(400).json({ error: 'target_id and reason required' });
    const report = await Report.create({ reporter_id: req.userId, target_id, reason, details });
    res.status(201).json({ message: 'Report submitted. Thank you.', id: report.id });
  } catch (err) { next(err); }
};
