const { exportQueue } = require("../config/queue");

async function triggerExport(req, res, next) {
  try {
    // Only admins can export.
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can trigger export" });
    }

    const job = await exportQueue.add(
      {
        tenantId: req.tenant.id,
        schemaName: req.tenant.schemaName,
        requestedBy: req.user.id,
      },
      {
        removeOnComplete: 20,
        removeOnFail: 20,
      }
    );

    return res.status(202).json({
      jobId: String(job.id),
      message: "Export job started",
    });
  } catch (error) {
    return next(error);
  }
}

async function getExportStatus(req, res, next) {
  try {
    const { id } = req.params;
    const job = await exportQueue.getJob(id);

    if (!job) {
      return res.status(404).json({ message: "Export job not found" });
    }

    const state = await job.getState();

    const baseResponse = {
      status: state,
      progress: typeof job.progress === "number" ? job.progress : 0,
    };

    if (state === "completed") {
      return res.json({
        ...baseResponse,
        fileUrl: job.returnvalue?.fileUrl || null,
        totalTasks: job.returnvalue?.totalTasks || 0,
      });
    }

    if (state === "failed") {
      return res.json({
        ...baseResponse,
        error: job.failedReason || "Export failed",
      });
    }

    return res.json(baseResponse);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  triggerExport,
  getExportStatus,
};
