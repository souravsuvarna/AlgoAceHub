const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MainModel = require("../model/problemSchema");

//Update Existing
router.get("/", async (req, res) => {
  try {
    // Find the record with the specified name
    let existingRecord = await MainModel.findOne({ name: "Example Record" });

    // Update the jsonArray or create a new record if it doesn't exist
    if (existingRecord) {
      // Record exists, update its jsonArray
      existingRecord.jsonArray = [
        { key: "key1", value: "updatedValue1" },
        { key: "key2", value: "updatedValue2" },
        // Add more JSON subdocuments as needed
      ];
    } else {
      // Record does not exist, create a new one
      existingRecord = new MainModel({
        name: "Example Record",
        jsonArray: [
          { key: "key1", value: "value1" },
          { key: "key2", value: "value2" },
          // Add more JSON subdocuments as needed
        ],
      });
    }

    // Save the updated or new document to the database
    const result = await existingRecord.save();
    console.log("Record updated or created successfully:", result);
    res.send("Record updated or created successfully");
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
});

module.exports = router;
