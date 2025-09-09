import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;

      // Check registration status
      const statusRes = await fetch(`http://localhost:3001/api/students/status/${uid}`);
      const statusData = await statusRes.json();

      if (!statusRes.ok) {
        alert("Failed to fetch registration status: " + statusData.error);
        return;
      }

      if (statusData.registration_status === "unregistered") {
        localStorage.setItem("token", token);
        navigate("/register");
        return;
      }

      // Step 2: Fetch role only if registered
      const roleRes = await fetch(`http://localhost:3001/api/students/role/${uid}`);
      const roleData = await roleRes.json();

      if (!roleRes.ok) {
        alert("Failed to fetch role: " + roleData.error);
        return;
      }

      const role = roleData.role;
      localStorage.setItem("token", token);

      if (role === "student") navigate("/student-dashboard");
      else if (role === "security") navigate("/security");
      else alert("Unknown role");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Log In to <span className="highlight">EZPass</span></h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="College Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn primary-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
