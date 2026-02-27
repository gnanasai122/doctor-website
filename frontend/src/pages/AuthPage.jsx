import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [error, setError] = useState("");
  const [apiWarning, setApiWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    let active = true;

    const checkBackend = async () => {
      try {
        await api.get("/health", { timeout: 5000 });
        if (active) {
          setApiWarning("");
        }
      } catch (apiError) {
        if (!active) return;
        setApiWarning(
          "Backend API is not reachable at http://localhost:5000. Start backend using `cd backend && npm run dev`."
        );
      }
    };

    checkBackend();

    return () => {
      active = false;
    };
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const { data } = await api.post("/auth/register", form);
        login({ token: data.token, user: data.user });
      } else {
        const { data } = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        login({ token: data.token, user: data.user });
      }
      navigate("/dashboard", { replace: true });
    } catch (apiError) {
      const backendMessage = apiError.response?.data?.message;
      const networkMessage =
        apiError.code === "ERR_NETWORK"
          ? "Cannot connect to backend API. Ensure backend is running on http://localhost:5000."
          : "";

      setError(backendMessage || networkMessage || apiError.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <p className="eyebrow">MediTrack</p>
        <h1>Medical Appointment Management System</h1>
        <p>
          Role-based platform for patients and doctors to manage appointments
          efficiently.
        </p>
      </div>

      <form className="card auth-card" onSubmit={submitAuth}>
        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === "register" ? "tab active" : "tab"}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {apiWarning && <p className="warning-text">{apiWarning}</p>}

        {mode === "register" && (
          <>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Enter full name"
              required
            />

            <label>Role</label>
            <select name="role" value={form.role} onChange={onChange}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </>
        )}

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Enter email"
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Enter password"
          required
        />

        {error && <p className="error-text">{error}</p>}

        <button className="btn btn-primary full" disabled={loading} type="submit">
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
