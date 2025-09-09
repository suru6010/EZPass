const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const { neon } = require("@neondatabase/serverless");

//Log once to verify .env is correctly loaded
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found in .env file");
  process.exit(1); // Stop the server if DB is misconfigured
} else {
  console.log("DATABASE_URL loaded successfully");
}

const sql = neon(process.env.DATABASE_URL);
module.exports = sql;

