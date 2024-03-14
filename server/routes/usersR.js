const router = require("express").Router();
const { createUsers } = require("../controllers/addUsersC");

// add users route
router.post("/users", createUsers);
//loginroute

module.exports = router;
