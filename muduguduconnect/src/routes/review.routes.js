const router  = require('express').Router();
const ctrl    = require('../controller/review.controller');
const protect = require('../middleware/auth');

// POST /api/reviews  (protected — employer leaves review)
router.post('/',                  protect, ctrl.create);

// GET /api/reviews/:worker_id  (public)
router.get('/:worker_id',         ctrl.getForWorker);

module.exports = router;
