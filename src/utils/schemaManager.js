const { sequelize, getTenantModels } = require("../models");

async function createSchemaIfNotExists(schemaName) {
  // Sequelize has createSchema, but it throws when schema already exists.
  // raw SQL version that is simple and safe for repeated calls.
  await sequelize.query(`CREATE SCHEMA IF NOT EXISTS \"${schemaName}\";`);
}

async function syncTenantTables(schemaName) {
  const { User, Task } = getTenantModels(schemaName);

  // Create tables in dependency order.
  await User.sync();
  await Task.sync();
}

module.exports = {
  createSchemaIfNotExists,
  syncTenantTables,
};
