const jwt = require("jsonwebtoken");
const config = require("../config/config");

//From Config.js
const secretKey = config.secretKey;

//Admin Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Token not provided" });
  }

  // Check if the token has the "Bearer " prefix
  const [bearer, token] = authorizationHeader.split(" ");

  if (bearer !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid Authorization header format" });
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
