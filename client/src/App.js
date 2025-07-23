import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/signup";
import Login from "./pages/login";
import StudentRegister from "./pages/studentRegister";
import StudentDashboard from "./pages/StudentDashboard";
import ApplyHomepass from "./pages/ApplyHomepass";
import SecurityDashboard from "./pages/SecurityDashboard";
import ApplyOutpass from "./pages/ApplyOutpass";
import Home from "./pages/Home";

// 🔐 Role-based route guard
const RequireSecurity = ({ children }) => {
  const firebase_uid = localStorage.getItem("firebase_uid");
  const role = localStorage.getItem("role");

  if (!firebase_uid || role !== "security") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<StudentRegister />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/apply-homepass" element={<ApplyHomepass />} />
        <Route path="/apply-outpass" element={<ApplyOutpass />} />
        <Route path="/security" element={<SecurityDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;


