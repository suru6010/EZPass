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
  e.preventDefault(); // ✅ prevent form from refreshing

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    const uid = userCredential.user.uid;

    const res = await fetch(`http://localhost:3001/api/students/role/${uid}`);
    const data = await res.json();

    console.log("Fetched role:", data.role);

    if (res.ok) {
      const role = data.role;
      localStorage.setItem("token", token);

      if (role === "student") navigate("/student-dashboard");
      if (role === "security") navigate("/security");
    } 
    else {
      alert("Failed to fetch role: " + data.error);
    }
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
