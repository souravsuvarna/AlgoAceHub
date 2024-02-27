const express = require("express");
const router = express.Router();
const { getProblem } = require("../controllers/userController");

//Update Existing
router.get("/getProblem", getProblem);

module.exports = router;
