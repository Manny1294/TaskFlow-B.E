const Bull = require("bull");
const dotenv = require("dotenv");
const { generateTaskExport } = require("../jobs/exportJob");

dotenv.config();

// Queue for background task exports.
const exportQueue = new Bull("task-export", {
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
  },
});

// Register a processor that runs when jobs are added.
exportQueue.process(async (job) => {
  return generateTaskExport(job);
});

module.exports = {
  exportQueue,
};
