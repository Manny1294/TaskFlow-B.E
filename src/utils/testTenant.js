const { sequelize, getTenantModels } = require("../models");

async function testTenantIsolation() {
  try {
    await sequelize.authenticate();

    const acme = getTenantModels("tenant_acme");
    const globex = getTenantModels("tenant_globex");

    const acmeTasks = await acme.Task.findAll({ order: [["id", "ASC"]] });
    const globexTasks = await globex.Task.findAll({ order: [["id", "ASC"]] });

    console.log("Acme tasks:", acmeTasks.map((task) => task.title));
    console.log("Globex tasks:", globexTasks.map((task) => task.title));

    process.exit(0);
  } catch (error) {
    console.error("Tenant test failed:", error.message);
    process.exit(1);
  }
}

testTenantIsolation();
