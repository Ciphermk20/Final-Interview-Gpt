const express = require('express');
const router = express.Router();
const { evaluateResponse } = require('../controllers/interviewController');

router.post('/evaluate', evaluateResponse);

module.exports = router;