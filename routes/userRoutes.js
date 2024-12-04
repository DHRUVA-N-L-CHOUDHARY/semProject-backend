const express = require("express");
const {
  createUser,
  deleteUser,
  deactivateUser,
  getAllUsers,
  getUserDetails,
  editUserDetails,
  updateUserFields
} = require("../controllers/userController");

const router = express.Router();

// Create User
router.post("/create", createUser);

// Delete User
router.delete("/:id", deleteUser);

// Deactivate User
router.patch("/deactivate/:id", deactivateUser);

// Get All Users with Filters, Pagination, Sorting
router.get("/", getAllUsers);

// Get User Details
router.get("/:id", getUserDetails);

// Edit User Details
router.put("/:id", editUserDetails);

router.patch("/update-fields/:id", updateUserFields);

module.exports = router;
