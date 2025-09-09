import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleSignup = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebase_uid = userCredential.user.uid;

  
    const response = await fetch("/api/students/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebase_uid }),
    });

    if (!response.ok) {
      throw new Error("Failed to create user in database");
    }

    console.log("User signed up and placeholder created:", firebase_uid);
    alert("Signup successful! Complete your registration.");

    navigate("/register"); 
  } catch (error) {
    alert("Signup failed: " + error.message);
  }
};


  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create your <span className="highlight">EZPass</span> account</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="email"
            placeholder="College Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn primary-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;

