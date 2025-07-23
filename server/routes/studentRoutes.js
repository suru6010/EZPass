const express = require("express");
const router = express.Router();
const sql = require("../db");
const { encrypt } = require("../utils/encryption");
const verifyToken = require("../middleware/verifyToken");

// ✅ POST /api/students/register (Protected)
router.post("/register", verifyToken, async (req, res) => {
  const { name, roll_number, room_number, parent_phone_number } = req.body;
  const firebase_uid = req.firebase_uid; // Set by verifyToken middleware

  if (!firebase_uid || !name || !roll_number || !room_number || !parent_phone_number) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const encryptedRoll = encrypt(roll_number);
    const encryptedRoom = encrypt(room_number);
    const encryptedParentPhone = encrypt(parent_phone_number);

    await sql`
  INSERT INTO students (firebase_uid, name, roll_number, room_number, parent_phone_number, role)
  VALUES (${firebase_uid}, ${name}, ${encryptedRoll}, ${encryptedRoom}, ${encryptedParentPhone}, 'student')
`;


    res.status(201).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET /api/students/role/:uid
router.get("/role/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const result = await sql`
      SELECT role FROM students WHERE firebase_uid = ${uid}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ role: result[0].role });
  } catch (error) {
    console.error("Error fetching role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

