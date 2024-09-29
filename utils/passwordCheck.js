const bcrypt = require("bcrypt");
const UsersModel = require("../models/users");

const passwordCheck = async (userID, password) => {
  const userData = await UsersModel.findOne({ where: { userID: userID } });
  const compare = await bcrypt.compare(password, userData.password);

  return { compare, userData };
};

module.exports = passwordCheck;
