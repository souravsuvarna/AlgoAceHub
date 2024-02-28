const express = require("express");
const {
  addProblem,
  getByCategory,
  getById,
  deleteById,
  adminLogin,
} = require("../controllers/adminController");

const { authenticateAdmin } = require("../middlewares/authenticateAdmin");
const router = express.Router();

router.post("/login", adminLogin);

//Route to Add or update a problem
router.post("/addProblem", authenticateAdmin, addProblem);

//Route to Get All problems by category
router.post("/getByCategory", authenticateAdmin, getByCategory);

//Route to Get a problem by its id
router.post("/getById", authenticateAdmin, getById);

//Route to Delete a problem by its id

router.delete("/deleteById", authenticateAdmin, deleteById);

module.exports = router;
