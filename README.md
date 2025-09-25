# EZPass: Secure Student Gate Pass Management System

**EZPass** is a full-stack web application designed to manage student gate passes (Outpass/Homepass) securely. It features **Firebase authentication** for users, a Node.js/Express backend, a PostgreSQL database (using Neon serverless driver), and utilizes **strong encryption** for sensitive student data, with **Twilio** integration for parental verification via OTP.

---

## Features

-   **User Authentication & Authorization**: Students and Security personnel can sign up and log in using **Firebase Authentication**.
-   **Student Registration**: Students complete a registration form to provide personal details (Name, Roll Number, Room Number, Parent Phone Number).
-   **Pass Application**: Students can apply for **Homepass** and **Outpass**.
-   **Parent OTP Verification**: Outpass requests are secured with an **OTP sent to the registered parent's phone number via Twilio**.
-   **Security Dashboard**: Security personnel can view and manage passes, and **mark the exact exit and entry timestamps**.
-   **Data Security**: Sensitive data like Roll Number, Room Number, Parent Phone Number, and Pass Purpose are **encrypted** in the database using `aes-256-cbc`.

---

## Installation and Setup

### Prerequisites

-   Node.js (version >=14.0.0 is recommended)
-   PostgreSQL database (e.g., using Neon)
-   Firebase project setup with Email/Password auth enabled.
-   Twilio account for sending OTPs.

### Environment Variables & Credentials

1.  **Firebase Client Config**: Update the `firebaseConfig` object in `client/src/utils/firebase.js` with your project's details.
2.  **Firebase Admin Key**: Save your **Firebase Admin SDK private key JSON file** as **`server/firebase/serviceAccountKey.json`**.
3.  **Server `.env`**: Create a file named **`.env`** inside the `server/` directory and set the following variables:

    ```bash
    # Neon PostgreSQL Connection URL
    DATABASE_URL="<your_neon_db_connection_url>"
    # 32-byte hex string (64 chars) - CRITICAL FOR ENCRYPTION
    ENCRYPTION_KEY="<your_32_byte_hex_key>"

    # Twilio Configuration
    TWILIO_SID="<your_twilio_account_sid>"
    TWILIO_AUTH_TOKEN="<your_twilio_auth_token>"
    TWILIO_PHONE="<your_twilio_phone_number>"
    ```

### Installation Steps (Copy/Paste)

```bash
# Clone the repository (adjust name as necessary)
git clone <repository_url>
cd <project_directory_name>

# Install root (server) and client dependencies
npm install
npm install --prefix client

# Run the application (starts both server on :3001 and client)
npm start

