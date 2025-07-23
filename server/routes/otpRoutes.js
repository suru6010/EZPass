const express = require("express");
const router = express.Router();
const sql = require("../db");
const { encrypt, decrypt } = require("../utils/encryption");
const verifyToken = require("../middleware/verifyToken");
const crypto = require("crypto");
const dayjs = require("dayjs");
require("dotenv").config();

// Load Twilio credentials from .env
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE;

const client = require("twilio")(accountSid, authToken);

// ✅ Generate OTP and store encrypted in homepass_requests
router.post("/generate", verifyToken, async (req, res) => {
  const firebase_uid = req.firebase_uid;

  try {
    // 1. Fetch encrypted phone from students table
    const result = await sql`
      SELECT parent_phone_number FROM students WHERE firebase_uid = ${firebase_uid}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    const encryptedPhone = result[0].parent_phone_number;
    const decryptedPhone = decrypt(encryptedPhone);

    // 2. Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiration = dayjs().add(5, "minute").toISOString();
    const encryptedOtp = encrypt(otp);

    // 3. Store in DB
    await sql`
      INSERT INTO homepass_requests (firebase_uid, otp, expires_at)
      VALUES (${firebase_uid}, ${encryptedOtp}, ${expiration})
    `;

    // 4. Send OTP via Twilio
    await client.messages.create({
      body: `Your ward is applying for a homepass. The OTP to verify your approval is : ${otp}`,
      from: fromPhone,
      to: decryptedPhone,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error generating OTP:", err);
    res.status(500).json({ error: "Failed to generate/send OTP" });
  }
});

// ✅ Verify OTP from encrypted table
router.post("/verify", verifyToken, async (req, res) => {
  const { otp, date, purpose } = req.body;
  const firebase_uid = req.firebase_uid;

  if (!otp || !date || !purpose) {
    return res.status(400).json({ error: "OTP, date, and purpose are required" });
  }

  try {
    // 1. Get latest OTP for user
    const result = await sql`
      SELECT otp, expires_at FROM homepass_requests
      WHERE firebase_uid = ${firebase_uid}
      ORDER BY expires_at DESC LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "No OTP found" });
    }

    const decryptedOtp = decrypt(result[0].otp);
    const isExpired = dayjs().isAfter(dayjs(result[0].expires_at));

    if (isExpired) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    if (otp !== decryptedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const encryptedPurpose = encrypt(purpose);

    await sql`
      INSERT INTO passlog (firebase_uid, type, date, purpose)
      VALUES (${firebase_uid}, 'outpass', ${date}, ${encryptedPurpose})
    `;

    res.status(200).json({ message: "OTP verified and Outpass applied successfully" });

  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
