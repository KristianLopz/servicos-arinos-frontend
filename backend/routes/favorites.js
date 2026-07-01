const express = require('express');
const router = express.Router();
const {
  addFavorite,
  listFavorites,
  checkFavorite,
  removeFavorite,
  removeFavoriteByDestination
} = require('../controllers/favoritesController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.post('/', addFavorite);                         // CU07 — salvar favorito
router.get('/', listFavorites);                        // Listar favoritos
router.get('/check/:destination_id', checkFavorite);    // Verificar se destino está favoritado
router.delete('/destination/:destination_id', removeFavoriteByDestination);
router.delete('/:id', removeFavorite);                 // Remover favorito pelo id do favorito

module.exports = router;
