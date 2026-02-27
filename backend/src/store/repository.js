const mongoose = require("mongoose");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

const memoryStore = {
  users: [],
  appointments: [],
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

const toPublicUser = (user) => ({
  _id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

const normalize = (doc) => {
  if (!doc) return null;
  return {
    ...doc,
    _id: String(doc._id),
    doctor: doc.doctor ? String(doc.doctor) : undefined,
    patient: doc.patient ? String(doc.patient) : undefined,
  };
};

const createId = () => new mongoose.Types.ObjectId().toString();

const userRepository = {
  async findByEmail(email) {
    if (isMongoConnected()) {
      return User.findOne({ email: email.toLowerCase().trim() });
    }

    return (
      memoryStore.users.find(
        (user) => user.email === email.toLowerCase().trim()
      ) || null
    );
  },

  async findById(userId) {
    if (isMongoConnected()) {
      return User.findById(userId);
    }

    return memoryStore.users.find((user) => user._id === String(userId)) || null;
  },

  async create(payload) {
    if (isMongoConnected()) {
      return User.create(payload);
    }

    const user = {
      _id: createId(),
      name: payload.name,
      email: payload.email.toLowerCase().trim(),
      password: payload.password,
      role: payload.role || "patient",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.users.push(user);
    return user;
  },

  async findDoctors() {
    if (isMongoConnected()) {
      const doctors = await User.find({ role: "doctor" })
        .select("name email role")
        .sort({ name: 1 })
        .lean();

      return doctors.map(normalize);
    }

    return memoryStore.users
      .filter((user) => user.role === "doctor")
      .map(toPublicUser)
      .sort((a, b) => a.name.localeCompare(b.name));
  },
};

const appointmentRepository = {
  async create(payload) {
    if (isMongoConnected()) {
      const appointment = await Appointment.create(payload);
      return normalize(appointment.toObject());
    }

    const appointment = {
      _id: createId(),
      department: payload.department,
      doctorName: payload.doctorName,
      patientName: payload.patientName,
      doctor: String(payload.doctor),
      patient: String(payload.patient),
      date: payload.date,
      timeSlot: payload.timeSlot,
      status: payload.status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    memoryStore.appointments.push(appointment);
    return appointment;
  },

  async findForUser(user) {
    if (isMongoConnected()) {
      const filter = user.role === "patient" ? { patient: user._id } : { doctor: user._id };
      const appointments = await Appointment.find(filter).sort({ createdAt: -1 }).lean();
      return appointments.map(normalize);
    }

    const filterKey = user.role === "patient" ? "patient" : "doctor";
    return memoryStore.appointments
      .filter((appointment) => appointment[filterKey] === String(user._id))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(appointmentId) {
    if (isMongoConnected()) {
      const appointment = await Appointment.findById(appointmentId).lean();
      return normalize(appointment);
    }

    return (
      memoryStore.appointments.find(
        (appointment) => appointment._id === String(appointmentId)
      ) || null
    );
  },

  async updateStatus(appointmentId, status) {
    if (isMongoConnected()) {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { status },
        { new: true }
      ).lean();

      return normalize(appointment);
    }

    const appointment = memoryStore.appointments.find(
      (item) => item._id === String(appointmentId)
    );
    if (!appointment) return null;

    appointment.status = status;
    appointment.updatedAt = new Date();
    return appointment;
  },
};

module.exports = {
  userRepository,
  appointmentRepository,
  isMongoConnected,
};

