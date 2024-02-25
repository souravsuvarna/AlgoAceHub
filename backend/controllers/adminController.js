const MainModel = require("../model/problemSchema");

//Add or Update a Problem
async function addProblem(req, res) {
  const data = req.body;
  // console.log(data.category);
  // console.log(data.id);
  // console.log(data.link);

  try {
    const existingRecord = await MainModel.findOne({ name: data.category });

    if (existingRecord) {
      // Check if the jsonArray already has an object with the specified data.id
      const existingObject = existingRecord.jsonArray.find(
        (item) => item.key === data.id
      );

      if (existingObject) {
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
        name: data.category,
        jsonArray: [{ key: data.id, value: data.link }],
      });

      // Save the new record to the database
      await newRecord.save();
    }

    res.json({ message: "Record updated/created successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Get All Problems By Category
async function getByCategory(req, res) {
  const data = req.body;
  try {
    const existingRecord = await MainModel.findOne({ name: data.category });
    if (!existingRecord) {
      return res.status(404).json({ error: "Not Found" });
    }

    // Extract relevant data from the record
    const responseData = {
      name: existingRecord.name,
      jsonArray: existingRecord.jsonArray,
    };

    // Send the retrieved data as a JSON response
    res.json(responseData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

//Get A Problem By its id
async function getById(req, res) {
  const data = req.body;
  try {
    //Get All Records
    const existingRecords = await MainModel.find();

    //Iterate Over each Record
    for (const record of existingRecords) {
      //Check each Record JsonArray for the id match
      const existingObject = record.jsonArray.find(
        (item) => item.key === data.id
      );

      if (existingObject) {
        // If the object with match found
        const responseData = {
          name: record.name,
          jsonArray: existingObject,
        };
        return res.json(responseData);
      }
    }
    //Id Not Found
    return res.status(404).json({ error: "Not Found" });
  } catch (error) {
    console.log(error.message);
    res.status(505);
  }
}

//Delete A problem By its id
async function deleteById(req, res) {
  const data = req.body;
  try {
    //Get All Records
    const existingRecords = await MainModel.find();

    //Iterate Over each Record
    for (const record of existingRecords) {
      //Check each Record JsonArray for the id match
      const existingObject = record.jsonArray.find(
        (item) => item.key === data.id
      );

      if (existingObject) {
        // If the object with match found
        const recordId = existingObject.key;

        try {
          // Delete the object from MongoDB
          // console.log(recordId);
          await MainModel.updateOne({
            $pull: { jsonArray: { key: recordId } },
          });
          return res.json({ message: "Success" });
          // No need to return here, just continue with the loop
        } catch (error) {
          console.error("Error deleting object:", error);
          return res.status(500).json({ message: "Internal Server Error" });
        }
      }
    }
    //Id Not Found
    return res.status(404).json({ error: "Not Found" });
  } catch (error) {
    console.log(error.message);
    res.status(505);
  }
}
module.exports = {
  addProblem,
  getByCategory,
  getById,
  deleteById,
};
