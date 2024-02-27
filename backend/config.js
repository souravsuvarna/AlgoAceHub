//REVIEW - Check here , during deployment
const dotenv = require("dotenv").config({ path: "../.env" });
// console.log(process.env.USER_NAME);
// console.log(process.env.PASSWORD);
// console.log(process.env.SECRET_KEY); //FIXME - Remove Comments
module.exports = {
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
  secretKey: process.env.SECRET_KEY,
};
