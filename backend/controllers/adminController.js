const { boolean } = require("webidl-conversions");
const MainModel = require("../model/problemSchema");

//Add or Update a Problem
async function addProblem(req, res) {
  // Access data from the JSON request body
  const data = req.body;
  console.log(data.category);
  console.log(data.id);
  console.log(data.link);

  try {
    const existingRecord = await MainModel.findOne({ name: data.category });

    if (existingRecord) {
      // Check if the jsonArray already has an object with the specified data.id
      const existingObject = existingRecord.jsonArray.find(
        (item) => item.key === data.id
      );

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

    // Extract relevant data from the record (modify as needed)
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
    const existingRecords = await MainModel.find();

    for (const record of existingRecords) {
      const existingObject = record.jsonArray.find(
        (item) => item.key === data.id
      );

      if (existingObject) {
        const responseData = {
          name: record.name,
          jsonArray: existingObject,
        };
        return res.json(responseData);
      }

    }

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
};
