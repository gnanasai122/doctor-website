const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { isMongoConnected } = require("./store/repository");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "MediTrack backend is running.",
    frontend: process.env.CLIENT_URL || "http://localhost:5173",
    apiBase: "/api",
  });
});

app.get("/api", (req, res) => {
  return res.status(200).json({
    message: "MediTrack API",
    endpoints: [
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/auth/doctors",
      "POST /api/appointments",
      "GET /api/appointments",
      "PUT /api/appointments/:id",
    ],
  });
});

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    mode: isMongoConnected() ? "mongodb" : "in-memory",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
