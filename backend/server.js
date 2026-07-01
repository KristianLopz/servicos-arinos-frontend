const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sequelize = require('./config/database');
const { User } = require('./models/User');
const { Destination } = require('./models/Destination');
const { Favorite, Itinerary } = require('./models/Relations');
const { ensureSeedDestinations } = require('./services/seedDestinations');

const authRoutes = require('./routes/auth');
const destinationsRoutes = require('./routes/destinations');
const itineraryRoutes = require('./routes/itinerary');
const favoritesRoutes = require('./routes/favorites');
const subscriptionRoutes = require('./routes/subscription');
const adminRoutes = require('./routes/admin');

const app = express();

// Middlewares globais
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || (isProduction ? 100 : 5000)),
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente mais tarde.' }
});

if (process.env.DISABLE_RATE_LIMIT !== 'true') {
  app.use('/api/', limiter);
}

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'TravelBuddy API' }));

// Handler de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});


async function ensureCoreTablesAndColumns() {
 
  const dbName = process.env.DB_NAME || 'travelbuddy';

  await User.sync({ alter: true });

  const [destinationTable] = await sequelize.query(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = :dbName
       AND TABLE_NAME = 'destinations'`,
    { replacements: { dbName } }
  );

  if (!Number(destinationTable[0]?.total || 0)) {
    await Destination.sync({ alter: true });
  } else {
    const [columnsResult] = await sequelize.query(
      `SELECT COLUMN_NAME AS name
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = :dbName
         AND TABLE_NAME = 'destinations'`,
      { replacements: { dbName } }
    );

    const existingColumns = new Set(columnsResult.map((column) => column.name));
    const columns = [
      { name: 'country', sql: 'ALTER TABLE destinations ADD COLUMN country VARCHAR(100) NOT NULL DEFAULT \'Brasil\' AFTER name' },
      { name: 'state', sql: 'ALTER TABLE destinations ADD COLUMN state VARCHAR(100) NULL AFTER country' },
      { name: 'description', sql: 'ALTER TABLE destinations ADD COLUMN description TEXT NULL AFTER state' },
      { name: 'estimated_cost', sql: 'ALTER TABLE destinations ADD COLUMN estimated_cost DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER description' },
      { name: 'climate', sql: 'ALTER TABLE destinations ADD COLUMN climate VARCHAR(100) NULL AFTER estimated_cost' },
      { name: 'best_season', sql: 'ALTER TABLE destinations ADD COLUMN best_season VARCHAR(100) NULL AFTER climate' },
      { name: 'image_url', sql: 'ALTER TABLE destinations ADD COLUMN image_url VARCHAR(500) NULL AFTER best_season' },
      { name: 'tourist_spots', sql: 'ALTER TABLE destinations ADD COLUMN tourist_spots JSON NULL AFTER image_url' },
      { name: 'active', sql: 'ALTER TABLE destinations ADD COLUMN active TINYINT(1) DEFAULT 1 AFTER tourist_spots' },
      { name: 'createdAt', sql: 'ALTER TABLE destinations ADD COLUMN createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER active' },
      { name: 'updatedAt', sql: 'ALTER TABLE destinations ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER createdAt' },
    ];

    for (const column of columns) {
      if (!existingColumns.has(column.name)) {
        await sequelize.query(column.sql);
        console.log(`Coluna criada em destinations: ${column.name}`);
      }
    }
  }

  await Favorite.sync({ alter: true });
  await Itinerary.sync({ alter: true });
}

async function ensureFavoriteBudgetColumns() {
  const dbName = process.env.DB_NAME || 'travelbuddy';

  const [tableResult] = await sequelize.query(
    `SELECT COUNT(*) AS total
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = :dbName
       AND TABLE_NAME = 'favorites'`,
    { replacements: { dbName } }
  );

  if (!Number(tableResult[0]?.total || 0)) {
    console.log('Tabela favorites ainda não existe. Importe backend/config/schema.sql no HeidiSQL.');
    return;
  }

  const columns = [
    { name: 'budget_value', sql: 'ALTER TABLE favorites ADD COLUMN budget_value DECIMAL(10,2) NULL AFTER notes' },
    { name: 'budget_days', sql: 'ALTER TABLE favorites ADD COLUMN budget_days INT NULL AFTER budget_value' },
    { name: 'budget_people', sql: 'ALTER TABLE favorites ADD COLUMN budget_people INT NULL AFTER budget_days' }
  ];

  for (const column of columns) {
    const [result] = await sequelize.query(
      `SELECT COUNT(*) AS total
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = :dbName
         AND TABLE_NAME = 'favorites'
         AND COLUMN_NAME = :columnName`,
      { replacements: { dbName, columnName: column.name } }
    );

    if (!Number(result[0]?.total || 0)) {
      await sequelize.query(column.sql);
      console.log(`Coluna criada em favorites: ${column.name}`);
    }
  }
}

async function ensureAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@travelbuddy.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';

  const admin = await User.findOne({ where: { email: adminEmail } });

  if (!admin) {
    await User.create({
      name: 'Administrador',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      plan: 'premium'
    });
    console.log(`Admin criado: ${adminEmail} / ${adminPassword}`);
    return;
  }

  const passwordOk = await admin.checkPassword(adminPassword);

  if (!passwordOk || admin.role !== 'admin') {
    await admin.update({
      password: adminPassword,
      role: 'admin',
      plan: admin.plan || 'premium'
    });
    console.log(`Admin atualizado: ${adminEmail} / ${adminPassword}`);
  }
}

async function startServer() {
  try {
    await sequelize.authenticate();
    await ensureCoreTablesAndColumns();
    await ensureFavoriteBudgetColumns();
    await ensureSeedDestinations();
    await ensureAdminUser();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`TravelBuddy API rodando na porta ${PORT}`));
  } catch (error) {
    console.error('Erro ao conectar no banco de dados. Verifique se o MySQL está ligado e se o banco travelbuddy foi importado.');
    console.error(error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
