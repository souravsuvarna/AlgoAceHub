const MainModel = require("../model/problemSchema");

const getProblem = async (req, res) => {
  const data = req.body;
  try {
    //Filter the platform
    const query = {
      platform: data.platform,
    };

    //REVIEW - have to set null or all
    //Filter category optional
    if (data.category !== "all") {
      query.name = data.category;
    }

    //Query
    const existingRecord = await MainModel.find(query);

    if (!existingRecord) {
      return res.status(404).json({ error: "Not Found" });
    }

    //existingRecord will be object Array , generate random object index
    const recordSize = existingRecord.length;
    const recordRandomIndex = Math.floor(Math.random() * recordSize);

    // Extract relevant data from the record
    const responseData = {
      jsonArray: existingRecord[recordRandomIndex].jsonArray,
    };

    //Get Random Index of jsonArray
    const size = responseData.jsonArray.length;
    const randomIndex = Math.floor(Math.random() * size);

    // Send the retrieved data as a JSON response
    res.json(responseData.jsonArray[randomIndex]);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProblem,
};
