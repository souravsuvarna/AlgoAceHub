const express = require("express");
const router = express.Router();
const { getProblem, stats } = require("../controllers/userController");

//Route to random problem genearte
router.post("/getProblem", getProblem);

//Route to get stats
router.get("/stats", stats);

module.exports = router;
