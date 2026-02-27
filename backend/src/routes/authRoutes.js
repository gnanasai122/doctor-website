const express = require("express");
const { register, login, listDoctors } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/doctors", protect, listDoctors);

module.exports = router;

