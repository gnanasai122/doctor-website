const { appointmentRepository, userRepository } = require("../store/repository");

const createAppointment = async (req, res, next) => {
  try {
    const { department, doctorId, doctorName, date, timeSlot } = req.body;

    if (!department || !date || !timeSlot || (!doctorId && !doctorName)) {
      return res.status(400).json({
        message:
          "department, date, timeSlot and doctorId (or doctorName) are required.",
      });
    }

    const appointmentDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      return res.status(400).json({
        message: "You cannot book an appointment for a past date.",
      });
    }

    let doctor = null;

    if (doctorId) {
      doctor = await userRepository.findById(doctorId);
      if (!doctor || doctor.role !== "doctor") {
        return res.status(404).json({ message: "Doctor not found." });
      }
    } else {
      const doctors = await userRepository.findDoctors();
      doctor =
        doctors.find(
          (item) => item.name.toLowerCase().trim() === doctorName.toLowerCase().trim()
        ) || null;
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found." });
      }
    }

    const appointment = await appointmentRepository.create({
      department: department.trim(),
      doctorName: doctor.name,
      patientName: req.user.name,
      doctor: doctor._id,
      patient: req.user.id,
      date,
      timeSlot,
      status: "pending",
    });

    return res.status(201).json({
      message: "Appointment request submitted successfully.",
      appointment,
    });
  } catch (error) {
    return next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const appointments = await appointmentRepository.findForUser({
      _id: req.user.id,
      role: req.user.role,
    });

    return res.status(200).json({ appointments });
  } catch (error) {
    return next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res
        .status(400)
        .json({ message: "status must be either approved or rejected." });
    }

    const appointment = await appointmentRepository.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (String(appointment.doctor) !== String(req.user.id)) {
      return res
        .status(403)
        .json({ message: "Forbidden: you can update only your appointments." });
    }

    const updated = await appointmentRepository.updateStatus(id, status);
    return res.status(200).json({
      message: `Appointment ${status}.`,
      appointment: updated,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};
