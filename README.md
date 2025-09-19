# Forum API

A simple **Node.js / Express / MongoDB** forum API with authentication, threads, and nested comments. Supports user signup/login, thread creation, commenting, and comment replies. Admins can delete threads.

---

## Features

- User authentication (JWT)
- Role-based access control (`admin`)
- CRUD operations for threads
- Nested comments and replies
- Protected routes for authenticated users

---

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd forum-api
   ```

2. **Set up environment variables**  
   Copy `.env.example` to `.env` and update values:
   ```
   PORT=5000
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start server**
   - Development (with nodemon):
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

5. **Test endpoints in Postman**
   Use the `Authorization` header for protected routes:  
   ```
   Authorization: Bearer <token>
   ```

---

## API Endpoints & Parameters

### Authentication

| Method | Endpoint         | Description                  | Body Parameters |
|--------|-----------------|------------------------------|----------------|
| POST   | /api/auth/signup | Register a new user          | `name` (string), `email` (string), `password` (string) |
| POST   | /api/auth/login  | Login and get JWT token      | `email` (string), `password` (string) |

**Example Signup Request**
```json
{
  "name": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Example Login Request**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Example Login Response**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "userId123",
    "name": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Threads

| Method | Endpoint            | Access       | Description             | Body Parameters |
|--------|-------------------|-------------|------------------------|----------------|
| POST   | /api/threads       | Auth required | Create a new thread     | `title` (string), `content` (string) |
| GET    | /api/threads       | Public       | Get all threads        | None |
| GET    | /api/threads/:id   | Public       | Get thread by ID       | None |
| DELETE | /api/threads/:id   | Admin only   | Delete thread          | None |

**Example Thread Request**
```json
{
  "title": "My first thread",
  "content": "This is the thread content."
}
```

**Example Response**
```json
{
  "id": "threadId123",
  "title": "My first thread",
  "content": "This is the thread content.",
  "author": "userId123",
  "comments": [],
  "createdAt": "2025-09-19T15:00:00.000Z"
}
```

---

### Comments

| Method | Endpoint                       | Access       | Description                     | Body Parameters |
|--------|--------------------------------|-------------|---------------------------------|----------------|
| POST   | /api/threads/:id/comments       | Auth required | Add a comment to a thread       | `content` (string) |
| POST   | /api/comments/:id/reply         | Auth required | Reply to an existing comment    | `content` (string) |

**Example Comment Request**
```json
{
  "content": "This is a comment."
}
```

**Example Reply Request**
```json
{
  "content": "This is a reply to a comment."
}
```

**Example Comment Response**
```json
{
  "id": "commentId123",
  "content": "This is a comment.",
  "author": "userId123",
  "replies": [],
  "createdAt": "2025-09-19T15:10:00.000Z"
}
```

---

## Notes

- **Authentication:** Uses JWT tokens. Include `Authorization: Bearer <token>` for protected routes.
- **Admin role:** Users have a `role` field; `role: "admin"` allows thread deletion.
- **Nested comments:** Replies are stored as child comments.
- **Testing:** Use Postman to send JSON payloads with `Content-Type: application/json`.

---

## Suggested Folder Structure

```
forum-api/
│
├─ src/
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ threadController.js
│  │  └─ commentController.js
│  │
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ Thread.js
│  │  └─ Comment.js
│  │
│  ├─ routes/
│  │  ├─ auth.js
│  │  ├─ threads.js
│  │  └─ comments.js
│  │
│  └─ middleware/
│     ├─ authMiddleware.js
│     └─ roleMiddleware.js
│
├─ .env.example
├─ package.json
└─ server.js
```