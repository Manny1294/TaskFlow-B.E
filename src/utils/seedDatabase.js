const { sequelize, Organization, getTenantModels } = require("../models");
const {
  createSchemaIfNotExists,
  syncTenantTables,
} = require("./schemaManager");

async function seedTenantData(schemaName, users, tasks) {
  const { User, Task } = getTenantModels(schemaName);

  // Recreate tenant tables so seed can be re-run during development.
  await User.sync({ force: true });
  await Task.sync({ force: true });

  const createdUsers = await User.bulkCreate(users, { returning: true });

  // Map task owner by email to get correct userId.
  const userMap = new Map(createdUsers.map((user) => [user.email, user.id]));

  const normalizedTasks = tasks.map((task) => ({
    title: task.title,
    description: task.description,
    status: task.status,
    userId: userMap.get(task.ownerEmail),
  }));

  await Task.bulkCreate(normalizedTasks);
}

async function seedDatabase() {
  try {
    await sequelize.authenticate();

    // Ensure organizations table exists.
    await Organization.sync({ force: true });

    const organizations = [
      { name: "Acme Corp", schemaName: "tenant_acme" },
      { name: "Globex Corp", schemaName: "tenant_globex" },
    ];

    for (const org of organizations) {
      await createSchemaIfNotExists(org.schemaName);
      await syncTenantTables(org.schemaName);
    }

    await Organization.bulkCreate(organizations);

    await seedTenantData(
      "tenant_acme",
      [
        { name: "John Admin", email: "john@acme.com", role: "admin" },
        { name: "Mary Member", email: "mary@acme.com", role: "member" },
        { name: "Sam Member", email: "sam@acme.com", role: "member" },
      ],
      [
        {
          title: "Set up backend",
          description: "Create initial project structure",
          status: "pending",
          ownerEmail: "john@acme.com",
        },
        {
          title: "Write API docs",
          description: "Document task endpoints",
          status: "completed",
          ownerEmail: "mary@acme.com",
        },
      ],
    );

    await seedTenantData(
      "tenant_globex",
      [
        { name: "Manny Admin", email: "manny@globex.com", role: "admin" },
        { name: "Bob Member", email: "bob@globex.com", role: "member" },
        { name: "Eve Member", email: "eve@globex.com", role: "member" },
      ],
      [
        {
          title: "Create tenant dashboard",
          description: "Build basic tenant dashboard",
          status: "pending",
          ownerEmail: "alice@globex.com",
        },
        {
          title: "Fix export bug",
          description: "Investigate CSV generation issue",
          status: "pending",
          ownerEmail: "bob@globex.com",
        },
      ],
    );

    console.log("Seed complete.");
    console.log("Organizations: public.organizations");
    console.log("Tenant schemas: tenant_acme, tenant_globex");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
}

seedDatabase();
