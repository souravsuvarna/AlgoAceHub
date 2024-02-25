const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// JSON subdocument schema
const jsonSchema = new Schema({
  key: String,
  value: String,
});

// Main schema with an array of JSON subdocuments
const mainSchema = new Schema({
  name: String,
  jsonArray: [jsonSchema],
});

// Custom middleware to check for duplicate keys before saving
// mainSchema.pre("save", function (next) {
//   const keys = new Set();
//   for (const item of this.jsonArray) {
//     if (keys.has(item.key)) {
//       const err = new Error("Duplicate key found in jsonArray");
//       return next(err);
//     }
//     keys.add(item.key);
//   }
//   next();
// });


module.exports =  mongoose.model("problemSchema", mainSchema);
