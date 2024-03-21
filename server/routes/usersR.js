const router = require("express").Router();
const {
  createUsers,
  getUsers,
  deleteUsers,
} = require("../controllers/addUsersC");

// add users route
router.post("/users", createUsers);
router.get("/users/getall", getUsers);
router.delete("/users/delete", deleteUsers);
//loginroute

module.exports = router;
