const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { User } = require('./User');
const { Destination } = require('./Destination');

// Modelo de Favoritos (RF07)
const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  destination_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Destination, key: 'id' } },
  notes: { type: DataTypes.TEXT, allowNull: true },
  budget_value: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  budget_days: { type: DataTypes.INTEGER, allowNull: true },
  budget_people: { type: DataTypes.INTEGER, allowNull: true }
}, {
  tableName: 'favorites',
  timestamps: true
});

// Modelo de Roteiro (RF06)
const Itinerary = sequelize.define('Itinerary', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'id' } },
  destination_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Destination, key: 'id' } },
  duration_days: { type: DataTypes.INTEGER, allowNull: false },
  num_people: { type: DataTypes.INTEGER, defaultValue: 1 },
  budget: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  activities: { type: DataTypes.JSON, allowNull: true, comment: 'Array de atividades por dia' },
  total_estimated_cost: { type: DataTypes.DECIMAL(10, 2), allowNull: true }
}, {
  tableName: 'itineraries',
  timestamps: true
});

// Relacionamentos
User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });
Destination.hasMany(Favorite, { foreignKey: 'destination_id' });
Favorite.belongsTo(Destination, { foreignKey: 'destination_id' });

User.hasMany(Itinerary, { foreignKey: 'user_id' });
Itinerary.belongsTo(User, { foreignKey: 'user_id' });
Destination.hasMany(Itinerary, { foreignKey: 'destination_id' });
Itinerary.belongsTo(Destination, { foreignKey: 'destination_id' });

module.exports = { Favorite, Itinerary };
