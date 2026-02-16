const express = require("express");
const { getExportStatus } = require("../controllers/exportController");

const router = express.Router();

router.get("/:id", getExportStatus);

module.exports = router;
