const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destination = sequelize.define('Destination', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  country: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  estimated_cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: 'Custo estimado por pessoa em R$' },
  climate: { type: DataTypes.STRING(100), allowNull: true },
  best_season: { type: DataTypes.STRING(100), allowNull: true },
  image_url: { type: DataTypes.STRING(500), allowNull: true },
  tourist_spots: { type: DataTypes.JSON, allowNull: true, comment: 'Array de strings com pontos turísticos' },
  active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'destinations',
  timestamps: true
});

module.exports = { Destination };
