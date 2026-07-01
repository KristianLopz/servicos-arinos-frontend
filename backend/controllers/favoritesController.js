const { Favorite } = require('../models/Relations');
const { Destination } = require('../models/Destination');

function toPositiveNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function toPositiveInt(value) {
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

const destinationInclude = [{
  model: Destination,
  attributes: [
    'id',
    'name',
    'country',
    'state',
    'estimated_cost',
    'image_url',
    'climate',
    'best_season'
  ]
}];

// ---- CU07 — Salvar Viagem Favorita (RF07) ----
const addFavorite = async (req, res) => {
  const { destination_id, notes, budget_value, budget_days, budget_people } = req.body;
  const userId = req.user.id;

  if (!destination_id) {
    return res.status(422).json({ error: 'Destino obrigatório para favoritar.' });
  }

  try {
    const destination = await Destination.findByPk(destination_id);
    if (!destination) {
      return res.status(404).json({ error: 'Destino não encontrado.' });
    }

    const favoritePayload = {
      user_id: userId,
      destination_id,
      notes: notes || '',
      budget_value: toPositiveNumber(budget_value),
      budget_days: toPositiveInt(budget_days),
      budget_people: toPositiveInt(budget_people)
    };

    // CU07 FA1 — item já favoritado: atualiza os dados de orçamento para manter sincronizado.
    const existing = await Favorite.findOne({ where: { user_id: userId, destination_id } });
    if (existing) {
      await existing.update(favoritePayload);
      const favorite = await Favorite.findByPk(existing.id, { include: destinationInclude });
      return res.json({
        message: 'Favorito atualizado com os dados do orçamento atual.',
        favorite,
        already_favorite: true
      });
    }

    const created = await Favorite.create(favoritePayload);
    const favorite = await Favorite.findByPk(created.id, { include: destinationInclude });

    return res.status(201).json({
      message: 'Viagem adicionada aos favoritos!',
      favorite,
      already_favorite: false
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao salvar favorito.' });
  }
};

// Lista favoritos do usuário
const listFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.user.id },
      include: destinationInclude,
      order: [['createdAt', 'DESC']]
    });

    return res.json({ total: favorites.length, favorites });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao listar favoritos.' });
  }
};

const checkFavorite = async (req, res) => {
  const { destination_id } = req.params;

  try {
    const favorite = await Favorite.findOne({
      where: { user_id: req.user.id, destination_id },
      include: destinationInclude
    });

    return res.json({ favorited: !!favorite, favorite });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao verificar favorito.' });
  }
};

// Remove favorito pelo ID do favorito
const removeFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const favorite = await Favorite.findOne({ where: { id, user_id: req.user.id } });
    if (!favorite) return res.status(404).json({ error: 'Favorito não encontrado.' });

    await favorite.destroy();
    return res.json({ message: 'Favorito removido com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao remover favorito.' });
  }
};

// Remove favorito pelo destino, útil para manter a tela de detalhes sincronizada.
const removeFavoriteByDestination = async (req, res) => {
  const { destination_id } = req.params;

  try {
    const favorite = await Favorite.findOne({ where: { destination_id, user_id: req.user.id } });
    if (!favorite) return res.status(404).json({ error: 'Favorito não encontrado.' });

    await favorite.destroy();
    return res.json({ message: 'Favorito removido com sucesso.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao remover favorito.' });
  }
};

module.exports = {
  addFavorite,
  listFavorites,
  checkFavorite,
  removeFavorite,
  removeFavoriteByDestination
};
