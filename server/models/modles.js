const Users = require("../config/db.config");
//create users model

const user = await Users.create({
  firstName: "zena",
  userName: "zena",
  password: "123",
  userRole: "admin",
});
console.log(user);
module.exports = user;
