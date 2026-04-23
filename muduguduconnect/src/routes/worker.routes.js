const router  = require('express').Router();
const ctrl    = require('../controller/worker.controller');
const protect = require('../middleware/auth');
const upload  = require('../middleware/upload');

// GET /api/workers?job=&location=&availability=&sort=
router.get('/',             ctrl.getAll);

// GET /api/workers/recommended
router.get('/recommended',  ctrl.getRecommended);

// GET /api/workers/emergency
router.get('/emergency',    ctrl.getEmergency);

// GET /api/workers/:id
router.get('/:id',          ctrl.getOne);

// POST /api/workers  (protected — create profile)
router.post('/',            protect, upload.single('photo'), ctrl.create);

// PUT /api/workers/:id  (protected — edit own profile)
router.put('/:id',          protect, upload.single('photo'), ctrl.update);

// PUT /api/workers/:id/availability  (protected)
router.put('/:id/availability', protect, ctrl.updateAvailability);

module.exports = router;
