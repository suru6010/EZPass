const express = require("express");
const router = express.Router();
const sql = require("../db");
const { encrypt } = require("../utils/encryption");
const verifyToken = require("../middleware/verifyToken");

router.post("/signup", async (req, res) => {
  console.log("Signup route hit!")
  const { firebase_uid } = req.body;

  if (!firebase_uid) {
    return res.status(400).json({ error: "Firebase UID is required" });
  }

  try {
    await sql`
      INSERT INTO students (firebase_uid, registration_status, role)
      VALUES (${firebase_uid}, 'unregistered', 'student')
      ON CONFLICT (firebase_uid) DO NOTHING
    `;

    res.status(201).json({
      message: "Signup successful. You can complete registration later.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

    // Update existing unregistered row
    await sql`
      UPDATE students
      SET
        name = ${name},
        roll_number = ${encryptedRoll},
        room_number = ${encryptedRoom},
        parent_phone_number = ${encryptedParentPhone},
        registration_status = 'registered',
        role = 'student'
      WHERE firebase_uid = ${firebase_uid}
    `;

    res.status(200).json({ message: "Student registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


//GET /api/students/role/:uid
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

// GET /api/students/status/:uid
router.get("/status/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const result = await sql`
      SELECT registration_status
      FROM students
      WHERE firebase_uid = ${uid}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      registration_status: result[0].registration_status,
    });
  } catch (error) {
    console.error("Error fetching registration status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;

