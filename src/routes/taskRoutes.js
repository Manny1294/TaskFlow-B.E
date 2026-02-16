const express = require("express");
const {
  listTasks,
  createTask,
  updateTaskStatus,
} = require("../controllers/taskController");
const { triggerExport } = require("../controllers/exportController");

const router = express.Router();

router.get("/", listTasks);
router.post("/", createTask);
router.patch("/:id", updateTaskStatus);
router.post("/export", triggerExport);

module.exports = router;
