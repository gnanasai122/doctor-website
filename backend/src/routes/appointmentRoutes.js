const express = require("express");
const {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("patient"), createAppointment);
router.get("/", protect, authorizeRoles("patient", "doctor"), getAppointments);
router.put("/:id", protect, authorizeRoles("doctor"), updateAppointmentStatus);

module.exports = router;

