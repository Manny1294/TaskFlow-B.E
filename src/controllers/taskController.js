async function listTasks(req, res, next) {
  try {
    const { Task, User } = req.models;

    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "name", "email", "role"],
        },
      ],
      order: [["id", "ASC"]],
    });

    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, status } = req.body;
    const { Task } = req.models;

    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (status && !["pending", "completed"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'pending' or 'completed'",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || null,
      status: status || "pending",
      userId: req.user.id,
    });

    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
}

async function updateTaskStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    const { Task } = req.models;

    // For this assessment, PATCH is focused on marking as completed.
    const nextStatus = status || "completed";

    if (!["pending", "completed"].includes(nextStatus)) {
      return res.status(400).json({
        message: "Status must be either 'pending' or 'completed'",
      });
    }

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = nextStatus;
    await task.save();

    return res.json(task);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listTasks,
  createTask,
  updateTaskStatus,
};
