import { useEffect, useState } from "react";
import api from "../services/api";
import AppointmentTable from "../components/AppointmentTable";

const departments = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "General Medicine",
];

const timeSlots = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
];

const getTodayLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PatientDashboard = () => {
  const minDate = getTodayLocalDate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    department: departments[0],
    doctorId: "",
    date: "",
    timeSlot: timeSlots[0],
  });

  const loadData = async () => {
    try {
      setError("");
      const [doctorsRes, appointmentsRes] = await Promise.all([
        api.get("/auth/doctors"),
        api.get("/appointments"),
      ]);

      const doctorList = doctorsRes.data.doctors || [];
      setDoctors(doctorList);
      setAppointments(appointmentsRes.data.appointments || []);

      setForm((prev) => ({
        ...prev,
        doctorId: prev.doctorId || doctorList[0]?._id || "",
      }));
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onBook = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.doctorId) {
      setError("No doctor available. Register at least one doctor account first.");
      return;
    }

    if (form.date < minDate) {
      setError("You cannot book an appointment for a past date.");
      return;
    }

    try {
      await api.post("/appointments", form);
      setMessage("Appointment booked successfully.");
      setForm((prev) => ({ ...prev, date: "", timeSlot: timeSlots[0] }));
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to book appointment.");
    }
  };

  return (
    <div className="dashboard-grid">
      <section className="card">
        <h2>Book Appointment</h2>
        <form className="form-grid" onSubmit={onBook}>
          <label>Department</label>
          <select name="department" value={form.department} onChange={onChange}>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>

          <label>Doctor</label>
          <select name="doctorId" value={form.doctorId} onChange={onChange}>
            {doctors.length === 0 && <option value="">No doctors available</option>}
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>

          <label>Date</label>
          <input
            name="date"
            type="date"
            min={minDate}
            value={form.date}
            onChange={onChange}
            required
          />

          <label>Time Slot</label>
          <select name="timeSlot" value={form.timeSlot} onChange={onChange}>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary">
            Book Appointment
          </button>
        </form>

        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}
      </section>

      <section className="card">
        <h2>My Appointments</h2>
        <AppointmentTable appointments={appointments} role="patient" />
      </section>
    </div>
  );
};

export default PatientDashboard;
