import { useEffect, useState } from "react";
import api from "../services/api";
import AppointmentTable from "../components/AppointmentTable";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAppointments = async () => {
    try {
      setError("");
      const { data } = await api.get("/appointments");
      setAppointments(data.appointments || []);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Could not load appointments.");
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const onStatusUpdate = async (id, status) => {
    try {
      setMessage("");
      setError("");
      await api.put(`/appointments/${id}`, { status });
      setMessage(`Appointment ${status}.`);
      await loadAppointments();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Status update failed.");
    }
  };

  return (
    <section className="card">
      <h2>Assigned Appointments</h2>
      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}
      <AppointmentTable
        appointments={appointments}
        role="doctor"
        onStatusUpdate={onStatusUpdate}
      />
    </section>
  );
};

export default DoctorDashboard;

