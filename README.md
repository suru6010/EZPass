# EZPass: Secure Student Gate Pass Management System

EZPass is a full-stack web application designed to manage student gate passes (Outpass/Homepass) securely.  
It features **Firebase authentication** for users, a **Node.js/Express backend**, a **PostgreSQL database** (using Neon serverless driver), and utilizes strong encryption for sensitive student data, with **Twilio integration** for parental verification via OTP.

---

## 🚀 Features
- **User Authentication & Authorization**: Students and Security personnel can sign up and log in using Firebase Authentication.  
- **Student Registration**: After sign-up, students complete a registration form to provide personal details (Name, Roll Number, Room Number, Parent Phone Number).  
- **Pass Application**: Students can apply for two types of passes from their dashboard:  
  - 🏠 **Homepass** (for longer trips)  
  - 🚶 **Outpass** (for short exits from campus)  
- **OTP Verification**: Parents receive OTPs via Twilio before approving Outpass requests.  
- **Security Dashboard**: Security personnel can verify passes, mark **entry/exit times**, and view logs.  

---

## 🛠 Tech Stack
- **Frontend**: React.js + Tailwind CSS  
- **Backend**: Node.js + Express.js  
- **Database**: PostgreSQL (Neon serverless driver)  
- **Authentication**: Firebase Auth  
- **Messaging**: Twilio (OTP verification)  
- **Hosting**: Vercel (Frontend) + Render/Neon (Backend & DB)  

---

## ⚙️ Installation and Setup

Follow these steps to run the project locally:

```bash
# 1. Clone the repository
git clone <repository_url>
cd ezpass-project

# 2. Install dependencies
# Install root (server) dependencies
npm install

# Install client dependencies
npm install --prefix client

# 3. Configure Firebase
# Add your Firebase client config in:
# client/src/utils/firebase.js
#
# Save your Firebase Admin SDK private key JSON as:
# server/firebase/serviceAccountKey.json

# 4. Setup Environment Variables
# Inside the server/ directory, create a .env file with:

DATABASE_URL=<your_postgres_neon_url>
ENCRYPTION_KEY=<32-byte-hex-key>
TWILIO_SID=<your_twilio_sid>
TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
TWILIO_PHONE=<your_twilio_phone_number>

# 5. Run the Application
npm start
