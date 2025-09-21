import React, { useEffect, useState, useCallback } from "react";
import "./SecurityDashboard.css";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [passes, setPasses] = useState([]);

  // Role check
  useEffect(() => {
    const checkRole = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate("/login");
        return;
      }

      const res = await fetch(`/api/students/role/${user.uid}`);
      const data = await res.json();

      if (data.role !== "security") {
        alert("Access denied. Security only.");
        navigate("/login");
      }
    };

    checkRole();
  }, [navigate]);

  const fetchPasses = useCallback(async () => {
    if (!selectedDate) return;
    try {
      const res = await fetch(`/api/passlog/date/${selectedDate}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setPasses(data);
      } else {
        console.error("Unexpected response:", data);
        setPasses([]);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      alert("Failed to fetch data");
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchPasses();
  }, [fetchPasses]);

  
  const handleMark = async (id, type) => {
    try {
      const res = await fetch(`/api/passlog/mark-${type}/${id}`, {
        method: "PATCH",
      });

      if (res.ok) {
        fetchPasses();
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      alert("Failed to update timestamp");
    }
  };

  return (
    <div className="security-dashboard">
      <h2>Security Dashboard</h2>

      <input
        id="date-select"
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {selectedDate && passes.length === 0 && <p>No passes for selected date.</p>}

      {passes.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Purpose</th>
              <th>Type</th>
              <th>Exit Time</th>
              <th>Entry Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {passes.map((pass) => (
              <tr key={pass.id}>
                <td>{pass.name}</td>
                <td>{pass.roll_number}</td>
                <td>{pass.purpose}</td>
                <td>{pass.type}</td>
                <td>{pass.exit_timestamp ? new Date(pass.exit_timestamp).toLocaleTimeString() : "—"}</td>
                <td>{pass.entry_timestamp ? new Date(pass.entry_timestamp).toLocaleTimeString() : "—"}</td>
                <td>
                  {!pass.exit_timestamp && (
                    <button onClick={() => handleMark(pass.id, "exit")}>Mark Out</button>
                  )}
                  {!pass.entry_timestamp && (
                    <button onClick={() => handleMark(pass.id, "entry")}>Mark In</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SecurityDashboard;
