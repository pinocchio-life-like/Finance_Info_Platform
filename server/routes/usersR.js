const router = require("express").Router();
const {
  createUsers,
  getUsers,
  deleteUsers,
} = require("../controllers/addUsersC");

const {
  getSingleUserController,
  getUserByUsernameController,
} = require("../controllers/getsingleUserC");

// add users route
router.post("/users", createUsers);
router.get("/users/getall", getUsers);
router.delete("/users/delete", deleteUsers);
router.get("/users/:id", getSingleUserController);
router.get("/userName/:userName", getUserByUsernameController);

module.exports = router;
