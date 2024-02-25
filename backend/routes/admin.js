const express = require("express");
const {
  addProblem,
  getByCategory,
  getById,
  deleteById,
} = require("../controllers/adminController");
const router = express.Router();

//Route to Add or update a problem
router.post("/addProblem", addProblem);

//Route to Get All problems by category
router.get("/getByCategory", getByCategory);

//Route to Get a problem by its id
router.get("/getById", getById);

//Route to Delete a problem by its id

router.delete("/deleteById", deleteById);
module.exports = router;
