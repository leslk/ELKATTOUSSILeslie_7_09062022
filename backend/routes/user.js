// Requires
const express = require("express");
const router = express.Router();

// user constroller import
const usersCtrl = require("../controllers/user");

// Create routes
router.post("/login", usersCtrl.login);
router.post("/signup", usersCtrl.signup);

module.exports = router;