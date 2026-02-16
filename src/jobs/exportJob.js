const fs = require("fs");
const path = require("path");
const { getTenantModels } = require("../models");

function toCsvValue(value) {
  if (value === null || value === undefined) return "";
  const raw = String(value);
  const escaped = raw.replace(/"/g, '""');
  return `"${escaped}"`;
}

async function generateTaskExport(job) {
  const { schemaName } = job.data;
  const { Task } = getTenantModels(schemaName);

  await job.progress(10);

  const tasks = await Task.findAll({
    order: [["id", "ASC"]],
  });

  await job.progress(50);

  const headers = ["id", "title", "description", "status", "userId", "createdAt", "updatedAt"];
  const rows = tasks.map((task) => {
    return [
      toCsvValue(task.id),
      toCsvValue(task.title),
      toCsvValue(task.description),
      toCsvValue(task.status),
      toCsvValue(task.userId),
      toCsvValue(task.createdAt),
      toCsvValue(task.updatedAt),
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");

  const exportDir = path.join(process.cwd(), "exports");
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  const fileName = `tasks_${schemaName}_${Date.now()}.csv`;
  const filePath = path.join(exportDir, fileName);

  fs.writeFileSync(filePath, csv, "utf8");

  await job.progress(100);

  return {
    fileName,
    fileUrl: `/exports/${fileName}`,
    filePath,
    totalTasks: tasks.length,
  };
}

module.exports = {
  generateTaskExport,
};
