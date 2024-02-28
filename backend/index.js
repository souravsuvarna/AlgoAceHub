const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use("/admin", require("./routes/admin"));
app.use("/", require("./routes/api"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
