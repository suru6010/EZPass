import React from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const handleApplyHomepass = () => {
    navigate("/apply-homepass");
  };

  const handleApplyOutpass = () => {
    navigate("/apply-outpass");
  };

  return (
    <div className="student-dashboard-container">
      <h2>Student Dashboard</h2>
      <p>Welcome! What would you like to apply for?</p>
      <div className="student-dashboard-buttons">
        <button onClick={handleApplyHomepass}>Apply for Homepass</button>
        <button onClick={handleApplyOutpass}>Apply for Outpass</button>
      </div>
    </div>
  );
};

export default StudentDashboard;

