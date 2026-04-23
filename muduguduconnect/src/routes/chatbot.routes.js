const router = require('express').Router();
const ctrl   = require('../controller/chatbot.controller');

// POST /api/chatbot  (public — no auth needed)
router.post('/', ctrl.query);

module.exports = router;
