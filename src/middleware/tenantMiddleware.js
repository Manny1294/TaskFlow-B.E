const { Organization, getTenantModels } = require("../models");

async function tenantMiddleware(req, res, next) {
  try {
    const tenantId = req.header("x-tenant-id");
    const userId = req.header("x-user-id");

    if (!tenantId || !userId) {
      return res.status(400).json({
        message: "Missing required headers: x-tenant-id and x-user-id",
      });
    }

    // Find tenant in public.organizations.
    const organization = await Organization.findByPk(tenantId);
    if (!organization) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Load schema-scoped models for this tenant.
    const tenantModels = getTenantModels(organization.schemaName);

    // Find the current user inside this tenant's schema.
    const user = await tenantModels.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found for tenant" });
    }

    //  Attach tenant context for downstream controllers.
    req.tenant = organization;
    req.user = user;
    req.models = tenantModels;

    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = tenantMiddleware;
