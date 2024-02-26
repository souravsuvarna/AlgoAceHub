const jwt = require("jsonwebtoken");
const config = require("../config");

//From Config.js
const secretKey = config.secretKey;

//Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

module.exports = {
  authenticateAdmin,
};
