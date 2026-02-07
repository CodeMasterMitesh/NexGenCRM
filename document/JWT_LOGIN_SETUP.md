# JWT Login Setup (Real API)

This guide explains how to run real API-based login using JWT in NexGenCRM.

## 1) Install Server Dependencies

From the server folder:

```bash
npm install
```

## 2) Configure Environment Variables

Create a file named `.env` inside the server folder:

```dotenv
PORT=5500
MONGODB_URI=mongodb://localhost:27017/nexgencrm
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
```

## 3) Start the Server

```bash
npm run dev
```

## 4) Create a First User (Register)

Send a request to register an admin user.

```bash
curl -X POST http://localhost:5500/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@crm.com","password":"Admin@123","mobile":"9999999999"}'
```

You will receive a JWT token in the response.

## 5) Login with JWT

```bash
curl -X POST http://localhost:5500/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"Admin@123"}'
```

The response includes:

- `token`
- `user` (id, name, email, role)

## 6) Use the Token for Protected APIs

All `/api/users` routes are protected. Send the token using the Authorization header:

```bash
curl http://localhost:5500/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 7) Frontend Login Flow

The React login page now calls the real API:

- POST `http://localhost:5500/api/auth/login`
- On success, stores `token` and `user` in local storage or session storage
- All `/api/users` requests include `Authorization: Bearer <token>`

## Notes

- The user model includes a `password` field that is stored as a bcrypt hash.
- The Add User form does not collect a password. To create login-capable accounts, use the `/api/auth/register` endpoint or add a password field to the UI.
- If you want to seed passwords, run the seeder after enabling it in the server start file.

## Files Added/Updated

- server/routes/auth.js
- server/middleware/auth.js
- server/config/schema.js
- server/routes/users.js
- server/index.js
- server/seeders/seedUsers.js
- server/package.json
- server/.env.example
- client/src/compenents/auth/AuthContext.jsx
- client/src/Users.jsx
- client/src/AddUser.jsx
