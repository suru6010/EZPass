const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const path = require("path");

// Load env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin SDK Initialization
const serviceAccount = require(path.join(__dirname, "firebase", "serviceAccountKey.json"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Routes
const studentRoutes = require("./routes/studentRoutes");
const passlogRoutes = require("./routes/passlogRoutes");
const otpRoutes = require("./routes/otpRoutes"); 

app.use("/api/students", studentRoutes);
app.use("/api/passlog", passlogRoutes);
app.use("/api/otp", otpRoutes); 

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

