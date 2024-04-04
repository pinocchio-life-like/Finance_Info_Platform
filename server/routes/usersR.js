const router = require("express").Router();
const {
  createUsers,
  getUsers,
  deleteUsers,
} = require("../controllers/addUsersC");
const{getSingleUserController}=require('../controllers/getsingleUserC')

// add users route
router.post("/users", createUsers);
router.get("/users/getall", getUsers);
router.delete("/users/delete", deleteUsers);
router.get("/users/:id",getSingleUserController)
//loginroute

module.exports = router;
