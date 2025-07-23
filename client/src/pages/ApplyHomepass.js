import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import "./ApplyHomepass.css";

const ApplyHomepass = () => {
  const [date, setDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("http://localhost:3001/api/passlog/homepass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ date, purpose }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Homepass applied successfully!");
        setDate("");
        setPurpose("");
      } else {
        alert("Failed: " + data.error);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="homepass-container">
      <div className="homepass-card">
        <h2 className="homepass-title">Apply for <span className="highlight">Homepass</span></h2>
        <form onSubmit={handleSubmit} className="homepass-form">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <button type="submit" className="btn primary-btn">Apply</button>
        </form>
      </div>
    </div>
  );
};

export default ApplyHomepass;
