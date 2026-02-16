const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

// single database connection used by the whole app.
const sequelize = new Sequelize(
  process.env.DB_NAME || "taskflow_db",
  process.env.DB_USER || "taskflow",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    // Show the SQL queries in dev. to debug easily
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  },
);

module.exports = sequelize;
