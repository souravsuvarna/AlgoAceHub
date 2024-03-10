const MainModel = require("../model/problemSchema");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const express = require("express");
const path = require("path");
const app = express();
// app.use(express.static(path.join(__dirname, "../frontend")));

//Login Credentials
const adminCredentials = {
  username: config.username,
  password: config.password,
};

// Secret key for JWT
const secretKey = config.secretKey;

//AdminLogin
const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  // console.log(username);
  // console.log(password);
  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
};

//Add or Update a Problem
const addProblem = async (req, res) => {
  const data = req.body;
  // console.log(data.category);
  // console.log(data.id);
  // console.log(data.link);
  // console.log(data.platform); //FIXME - Remove Comments
  try {
    const existingRecord = await MainModel.findOne({
      category: data.category,
      platform: data.platform,
    }); //NOTE - Added platform

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
        category: data.category,
        platform: data.platform,
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
};

//Get All Problems By Category
const getByCategory = async (req, res) => {
  const data = req.body;
  try {
    const existingRecord = await MainModel.findOne({
      category: data.category,
      platform: data.platform,
    }); //NOTE - Added platform

    if (!existingRecord) {
      return res.status(404).json({ error: "Not Found" });
    }

    // Extract relevant data from the record
    const responseData = {
      category: existingRecord.category,
      platform: existingRecord.platform, //NOTE - Added platform
      jsonArray: existingRecord.jsonArray,
    };

    // Send the retrieved data as a JSON response
    res.json({ jsonArray: responseData.jsonArray });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Get A Problem By its id
const getById = async (req, res) => {
  const data = req.body;
  try {
    //Get All Records
    const existingRecords = await MainModel.find({
      platform: data.platform,
    }); //NOTE - Added platform

    //Iterate Over each Record
    for (const record of existingRecords) {
      //Check each Record JsonArray for the id match
      const existingObject = record.jsonArray.find(
        (item) => item.key === data.id
      );

      if (existingObject) {
        // If the object with match found
        const responseData = {
          category: record.category,
          platform: record.platform, //NOTE - Added platform
          jsonArray: existingObject,
        };
        return res.json({ jsonArray: responseData.jsonArray });
      }
    }
    //Id Not Found
    return res.status(404).json({ error: "Not Found" });
  } catch (error) {
    console.log(error.message);
    res.status(505);
  }
};

//Delete A problem By its id
const deleteById = async (req, res) => {
  const data = req.body;
  try {
    // Get the matching record
    const existingRecord = await MainModel.findOne({
      platform: data.platform,
      category: data.category,
    });

    //Record Not found
    if (!existingRecord) {
      return res.status(404).json({ error: "Record Not Found" });
    }
    //array object with match id
    const record = existingRecord.jsonArray.find(
      (item) => item.key === data.id
    );

    //Id Not Found
    if (!record) {
      return res.status(404).json({ error: "Id Not Found" });
    }
    const recordId = record.key;

    try {
      // Delete the object from jsonArray
      await MainModel.updateOne(
        { "jsonArray.key": recordId },
        { $pull: { jsonArray: { key: recordId } } }
      );
      return res.json({ message: "Success" });
    } catch (error) {
      console.error("Error deleting object:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Admin Login Page
const adminLoginPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend", "static", "admin", "login.html")
  );
};

//Admin Panel page
const adminPanelPage = (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../frontend", "static", "admin", "adminPanel.html")
  );
};

module.exports = {
  addProblem,
  getByCategory,
  getById,
  deleteById,
  adminLogin,
  adminLoginPage,
  adminPanelPage,
};
