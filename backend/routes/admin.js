const express = require('express');
const router = express.Router();
const { createDestination, updateDestination, listAllDestinations, toggleDestination, destinationValidation } = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin); // Só admins

router.get('/destinations', listAllDestinations);                         // Listar todos
router.post('/destinations', destinationValidation, createDestination);   // CU09
router.put('/destinations/:id', updateDestination);                       // Atualizar
router.patch('/destinations/:id/toggle', toggleDestination);              // Ativar/desativar

module.exports = router;
