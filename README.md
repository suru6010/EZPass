### 1. Clone the repository
```bash
git clone <repository_url>
cd ezpass-project
2. Install Dependencies
bash
Copy code
# Install root (server) dependencies
npm install

# Install client dependencies
npm install --prefix client
3. Configure Firebase
bash
Copy code
# Add your Firebase client config in:
client/src/utils/firebase.js

# Save your Firebase Admin SDK private key JSON as:
server/firebase/serviceAccountKey.json
4. Setup Environment Variables
bash
Copy code
# Inside the server/ directory, create a .env file with:

DATABASE_URL=<your_postgres_neon_url>
ENCRYPTION_KEY=<32-byte-hex-key>
TWILIO_SID=<your_twilio_sid>
TWILIO_AUTH_TOKEN=<your_twilio_auth_token>
TWILIO_PHONE=<your_twilio_phone_number>
5. Run the Application
bash
Copy code
# Start both client and server together
npm start
The Express server will run on http://localhost:3001
The React client will run on http://localhost:3000 and proxy API requests to the server.
