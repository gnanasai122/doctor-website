import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PatientDashboard from "./PatientDashboard";
import DoctorDashboard from "./DoctorDashboard";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">MediTrack Dashboard</p>
          <h1>{user?.role === "doctor" ? "Doctor Panel" : "Patient Panel"}</h1>
          <p className="muted">
            Signed in as {user?.name} ({user?.role})
          </p>
        </div>
        <button className="btn btn-outline" onClick={onLogout} type="button">
          Logout
        </button>
      </header>

      {user?.role === "doctor" ? <DoctorDashboard /> : <PatientDashboard />}
    </main>
  );
};

export default DashboardPage;

