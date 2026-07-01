const express = require('express');
const router = express.Router();
const { subscribe, cancel, status } = require('../controllers/subscriptionController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/status', status);      // Consultar plano
router.post('/subscribe', subscribe); // CU08 — assinar premium
router.post('/cancel', cancel);     // CU08 FA2 — cancelar

module.exports = router;
