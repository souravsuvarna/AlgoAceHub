const express = require("express");
const router = express.Router();


//Update Existing
router.get("/", async (req, res) => {
 res.send("Hello")
});

module.exports = router;
