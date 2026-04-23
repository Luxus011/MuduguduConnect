const router  = require('express').Router();
const ctrl    = require('../controller/report.controller');
const protect = require('../middleware/auth');

// POST /api/reports  (protected)
router.post('/', protect, ctrl.create);

module.exports = router;
