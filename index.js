const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

mongoose.connect(process.env.MONGO_URI);

app.use(express.json());
app.use("/admin", require("./backend/routes/admin"));
app.use("/", require("./backend/routes/api"));
app.use(express.static('frontend'));

//NOTE - Added
app.use((req, res) => {
  // Redirect to the root ("/") for any unmatched route
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
