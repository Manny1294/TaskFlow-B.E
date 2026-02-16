const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const tenantMiddleware = require("./middleware/tenantMiddleware");
const errorHandler = require("./middleware/errorHandler");
const taskRoutes = require("./routes/taskRoutes");
const exportRoutes = require("./routes/exportRoutes");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health endpoint does not require tenant headers.
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Require tenant context for all business endpoints.
app.use(tenantMiddleware);

app.use("/tasks", taskRoutes);
app.use("/exports", exportRoutes);

// Serve generated CSV files.
app.use("/exports", express.static(path.join(process.cwd(), "exports")));

// Must be last.
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await sequelize.authenticate();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
