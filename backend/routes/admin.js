const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MainModel = require("../model/problemSchema");
router.use(express.json());

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


router.post("/add", async (req, res) => {
  // Access data from the JSON request body
  const data = req.body;
  console.log(data.cat);
  console.log(data.id);
  console.log(data.link);

  try {
    const existingRecord = await MainModel.findOne({ name: data.cat });

    if (existingRecord) {
      // Check if the jsonArray already has an object with the specified data.id
      const existingObject = existingRecord.jsonArray.find(item => item.key === data.id);

      if (existingObject) {
        // If the object exists, update its value
        existingObject.value = data.link;
      } else {
        // If the object doesn't exist, append a new one to the jsonArray
        existingRecord.jsonArray.push({ key: data.id, value: data.link });
      }

      // Save the changes to the database
      await existingRecord.save();
    } else {
      // If the record doesn't exist, create a new one
      const newRecord = new MainModel({
        name: data.cat,
        jsonArray: [{ key: data.id, value: data.link }],
      });

      // Save the new record to the database
      await newRecord.save();
    }

    res.json({ message: 'Record updated/created successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
