const express = require('express');
const router = express.Router();
const {
  getAllDestinations,
  getSuggestions,
  getDestinationById,
  saveBudget,
} = require('../controllers/destinationsController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate); // Todas as rotas requerem autenticação

router.post('/budget', saveBudget);              // CU03 — salvar orçamento
router.get('/suggestions', getSuggestions);      // CU04 — sugestões por orçamento
router.get('/', getAllDestinations);             // Lista todos os destinos ativos
router.get('/:id', getDestinationById);          // CU05 — detalhes do destino

module.exports = router;
