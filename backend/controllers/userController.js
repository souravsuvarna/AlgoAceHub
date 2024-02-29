const MainModel = require("../model/problemSchema");

//Random Problem Generator
const getProblem = async (req, res) => {
  const data = req.body;
  try {
    // Filter the platform
    const query = {
      platform: data.platform,
    };

    // REVIEW - have to set null or all
    // Filter category optional
    if (data.category !== "all") {
      query.category = data.category;
    }

    // Query
    const existingRecord = await MainModel.find(query);

    if (existingRecord.length === 0) {
      return res.status(404).json({ error: "Not Found" });
    }

    let totalLength = 0; // NOTE - Finding the total number of problems in the selected filter
    for (const document of existingRecord) {
      totalLength += document.jsonArray.length;
    }

    // existingRecord will be an array, generate a random object index
    const recordSize = existingRecord.length;
    const recordRandomIndex = Math.floor(Math.random() * recordSize);

    // Extract relevant data from the record
    const responseData = {
      jsonArray: existingRecord[recordRandomIndex].jsonArray,
    };

    // Get Random Index of jsonArray
    const size = responseData.jsonArray.length;
    const randomIndex = size > 0 ? Math.floor(Math.random() * size) : 0;

    // Send the retrieved data as a JSON response
    res.json({
      totalRecords: totalLength,
      data: responseData.jsonArray[randomIndex], // REVIEW - Can send only 'value' field that holds the link of the problem
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Problem Stats 
const stats = async (req, res) => {
  try {
    // Aggregation pipeline to group by platform and calculate the sum of jsonArray lengths
    const aggregationPipeline = [
      {
        $group: {
          _id: "$platform", // Grouping by platform
          totalProblems: { $sum: { $size: "$jsonArray" } }, // Calculating the sum of jsonArray lengths
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await MainModel.aggregate(aggregationPipeline);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found in the database" });
    }

    // Send the result as a JSON response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProblem,
  stats,
};
