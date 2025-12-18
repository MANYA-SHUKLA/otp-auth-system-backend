# OTP-Based Authentication System — Backend

Express + MongoDB backend for a passwordless OTP (One-Time Password) authentication system.

Features
- Passwordless login via OTP sent to email (nodemailer)
- Automatic user registration for new users
- JWT-based session tokens (24h expiry)
- Secure OTP generation and 10-minute expiration
- Simple endpoints to request/verify OTP and fetch user profile

Tech stack
- Node.js + Express
- MongoDB (Mongoose)
- JSON Web Tokens (jsonwebtoken)
- Nodemailer (Gmail by default)

Getting started
1. Install dependencies

```bash
cd backend
npm install
```

2. Create a `.env` file at `backend/` root with the following variables (example):

```
MONGODB_URI=mongodb://localhost:27017/otp-auth
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
FRONTEND_URL=http://localhost:3000
PORT=5001
```

Notes:
- `EMAIL_USER` and `EMAIL_PASS` are used by Nodemailer (the current config uses Gmail service). For production, prefer a dedicated transactional email provider or use an app password for Gmail.
- Keep secrets out of source control.

3. Run the server

```bash
# Development (using nodemon if available)
npx nodemon server.js
# Or run directly
node server.js
```

API Endpoints
(Base URL: `http://localhost:5001/api` by default)

- `POST /api/auth/send-otp`
  - Body: `{ email, name? }`
  - Description: Sends a 6-digit OTP to `email`. If the email is new, `name` is required to create the user.
  - Response: `{ success: true, message: 'OTP sent successfully', isNewUser: boolean }`

- `POST /api/auth/verify-otp`
  - Body: `{ email, otp }`
  - Description: Verifies the OTP. On success returns a JWT token and user object.
  - Response: `{ success: true, token, user: { id, name, email } }`

- `GET /api/auth/me`
  - Headers: `Authorization: Bearer <token>`
  - Description: Returns the authenticated user profile.

Security & Production Notes
- OTPs expire after 10 minutes.
- Use a strong `JWT_SECRET` and rotate keys if necessary.
- Use secure email/SMTP providers in production and ensure credentials are stored securely (e.g., secrets manager or environment variables on the host).

Contributing
Contributions and improvements are welcome. Please open issues or PRs.

made by manya shukla.
