const router = require("express").Router();
const { createUsers, getUsers } = require("../controllers/addUsersC");

// add users route
router.post("/users", createUsers);
router.get("/users/getall", getUsers);
//loginroute

module.exports = router;
