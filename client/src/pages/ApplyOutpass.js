import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import "./ApplyOutpass.css";

const ApplyOutpass = () => {
  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) navigate("/login");
  }, [navigate]);

const sendOtp = async () => {
  if (!auth.currentUser) {
    alert("User not logged in");
    return;
  }

  const token = await auth.currentUser.getIdToken();

  try {
    const res = await fetch("http://localhost:3001/api/otp/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    alert(data.message || "OTP response received");
    console.log("OTP response:", data);
  } catch (err) {
    alert("Failed to send OTP");
    console.error("OTP send error:", err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await auth.currentUser.getIdToken();
    try {
      const res = await fetch("http://localhost:3001/api/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, purpose, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate("/student-dashboard");
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to apply for outpass");
    }
  };

  return (
    <div className="outpass-container">
      <div className="outpass-card">
        <h2 className="outpass-title">
          Apply for <span className="highlight">Outpass</span>
        </h2>
        <form onSubmit={handleSubmit} className="outpass-form">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Date"
          />
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Purpose"
          />
          <button
            type="button"
            onClick={sendOtp}
            className="btn primary-btn"
          >
            Send OTP
          </button>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button type="submit" className="btn primary-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyOutpass;
