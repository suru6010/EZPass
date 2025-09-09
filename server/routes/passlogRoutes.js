const express = require("express");
const router = express.Router();
const sql = require("../db");
const { encrypt, decrypt } = require("../utils/encryption");
const verifyToken = require("../middleware/verifyToken");
const dayjs = require("dayjs");


router.post("/homepass", verifyToken, async (req, res) => {
  const { date, purpose } = req.body;
  const firebase_uid = req.firebase_uid;

  if (!date || !purpose) {
    return res.status(400).json({ error: "Date and purpose are required" });
  }

  try {
    const encryptedPurpose = encrypt(purpose);

    await sql`
      INSERT INTO passlog (firebase_uid, type, date, purpose)
      VALUES (${firebase_uid}, 'homepass', ${date}, ${encryptedPurpose})
    `;

    res.status(201).json({ message: "Homepass applied successfully" });
  } catch (error) {
    console.error("Error applying homepass:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/passlog/date/:date — for security dashboard
router.get("/date/:date", async (req, res) => {
  const { date } = req.params;

  try {
    const result = await sql`
      SELECT p.id, s.name, s.roll_number, p.type, p.purpose, p.exit_timestamp, p.entry_timestamp
      FROM passlog p
      JOIN students s ON p.firebase_uid = s.firebase_uid
      WHERE p.date = ${date}
    `;

    const decrypted = result.map((row) => ({
      ...row,
      roll_number: decrypt(row.roll_number),
      purpose: decrypt(row.purpose),
    }));

    res.json(decrypted);
  } catch (err) {
    console.error("Error fetching passlog:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/passlog/mark-exit/:id
router.patch("/mark-exit/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql`
      UPDATE passlog SET exit_timestamp = CURRENT_TIMESTAMP WHERE id = ${id}
    `;
    res.json({ message: "Exit time recorded" });
  } catch (err) {
    console.error("Error marking exit:", err);
    res.status(500).json({ error: "Failed to mark exit" });
  }
});

// PATCH /api/passlog/mark-entry/:id
router.patch("/mark-entry/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await sql`
      UPDATE passlog SET entry_timestamp = CURRENT_TIMESTAMP WHERE id = ${id}
    `;
    res.json({ message: "Entry time recorded" });
  } catch (err) {
    console.error("Error marking entry:", err);
    res.status(500).json({ error: "Failed to mark entry" });
  }
});

module.exports = router;
