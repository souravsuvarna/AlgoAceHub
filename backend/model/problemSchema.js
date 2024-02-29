const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// JSON subdocument schema
const jsonSchema = new Schema({
  key: String,
  value: String,
});

// Main schema with an array of JSON subdocuments
const mainSchema = new Schema({
  category: String,
  platform: String, //NOTE - Added platform
  jsonArray: [jsonSchema],
});

module.exports = mongoose.model("problemSchema", mainSchema);
