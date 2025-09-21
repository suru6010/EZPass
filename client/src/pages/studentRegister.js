import React, { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import "./StudentRegister.css";

const StudentRegister = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  const user = auth.currentUser;
  if (!user) {
    navigate("/login");
    return;
  }
 }, [navigate]);

  const handleSubmit = async (e) => {

  e.preventDefault();

  const user = auth.currentUser; 
  if (!user) {
    alert("You must be signed in.");
    navigate("/login");
    return;
  }
  
    try {
      const idToken = await user.getIdToken();

      const studentData = {
        name,
        roll_number: rollNumber,
        room_number: roomNumber,
        parent_phone_number: parentPhone,
      };

      const res = await fetch("/api/students/register", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(studentData),
      });

      if (res.ok) {
        alert("Student registered successfully!");
        navigate("/login");
      } else {
        const data = await res.json();
        alert("Registration failed: " + data.error);
      }
    } catch (err) {
      alert("Failed to submit: " + err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Student Registration</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          required
          maxLength={12}
          onChange={(e) => setRollNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Room Number"
          value={roomNumber}
          required
          onChange={(e) => setRoomNumber(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Parent Phone Number"
          value={parentPhone}
          required
          maxLength={10}
          pattern="[0-9]{10}"
          title="Enter a valid 10-digit phone number"
          onChange={(e) => setParentPhone(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default StudentRegister;
