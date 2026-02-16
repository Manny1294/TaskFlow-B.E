const sequelize = require("../config/database");
const Organization = require("./Organization");
const User = require("./User");
const Task = require("./Task");

// Base associations.
User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

function getTenantModels(schemaName) {
  // Create schema-bound versions of models for this tenant.
  const TenantUser = User.schema(schemaName);
  const TenantTask = Task.schema(schemaName);

  // Re-apply association on schema-bound models so include() works cleanly.
  TenantUser.hasMany(TenantTask, { foreignKey: "userId" });
  TenantTask.belongsTo(TenantUser, { foreignKey: "userId" });

  return {
    User: TenantUser,
    Task: TenantTask,
  };
}

module.exports = {
  sequelize,
  Organization,
  User,
  Task,
  getTenantModels,
};
