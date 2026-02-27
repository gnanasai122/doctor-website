const AppointmentTable = ({ appointments, role, onStatusUpdate }) => {
  if (!appointments.length) {
    return <p className="empty-text">No appointments found.</p>;
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Department</th>
            <th>Doctor</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            {role === "doctor" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.department}</td>
              <td>{appointment.doctorName}</td>
              <td>{appointment.patientName}</td>
              <td>{appointment.date}</td>
              <td>{appointment.timeSlot}</td>
              <td>
                <span className={`status-badge status-${appointment.status}`}>
                  {appointment.status}
                </span>
              </td>
              {role === "doctor" && (
                <td>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="btn btn-success"
                      disabled={appointment.status !== "pending"}
                      onClick={() => onStatusUpdate(appointment._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={appointment.status !== "pending"}
                      onClick={() => onStatusUpdate(appointment._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;

