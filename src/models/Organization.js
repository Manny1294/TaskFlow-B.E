const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Organizations live in the public schema.
// Each organization points to its own tenant schema.
const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    schemaName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "schema_name",
    },
  },
  {
    tableName: "organizations",
    schema: "public",
    underscored: true,
  }
);

module.exports = Organization;
