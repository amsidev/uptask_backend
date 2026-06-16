# UpTask — Backend API

REST API for the UpTask task management application, built with Node.js, Express, and MongoDB.

## Tech Stack

- **Node.js** + **TypeScript** — Runtime and language
- **Express** — Web framework
- **Mongoose** — MongoDB ODM
- **JSON Web Token** — Authentication
- **Bcrypt** — Password hashing
- **Nodemailer** — Email sending
- **Morgan** — HTTP request logger
- **Express Validator** — Request validation
- **CORS** — Cross-origin resource sharing

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

##  Installation

1. Clone the repository:

```bash
git clone https://github.com/amsidev/uptask-backend.git
cd uptask-backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory:

```env
PORT=4000
DATABASE_URL=mongodb://localhost:27017/uptask
JWT_SECRET=your_secret_key_here

# Nodemailer
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_password
```

## ▶️ Usage

Start the development server:

```bash
pnpm dev
```

The API will be available at `http://localhost:4000`.

### Other available commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server with nodemon |
| `pnpm dev:api` | Start in API-only mode |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run compiled production build |

## Project Structure

```
uptask_backend/
└── src/
    ├── config/         # DB connection and environment config
    ├── controllers/    # Route handler logic
    ├── emails/         # Nodemailer email templates
    ├── middleware/     # Auth, validation, and error middleware
    ├── models/         # Mongoose schemas and models
    ├── routes/         # Express route definitions
    ├── utils/          # Helper functions
    ├── index.ts        # App entry point
    └── server.ts       # Express server setup
```

##  Related

- [UpTask Frontend](https://github.com/amsidev/uptask-frontend) — React client application
