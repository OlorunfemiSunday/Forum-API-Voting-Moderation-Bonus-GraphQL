# Forum API

A simple **Node.js / Express / MongoDB** forum API with authentication, threads, nested comments, voting, and admin moderation. Users can sign up, log in, create threads, comment, reply to comments, and vote on threads or comments. Admins can delete threads or spam comments. Optional GraphQL endpoint is included for querying threads and comments.

---

## Features

* User authentication (JWT)
* Role-based access control (`admin`)
* CRUD operations for threads
* Nested comments and replies
* Voting system (upvote/downvote) for threads and comments
* Admin moderation: list threads, delete spam comments
* Optional GraphQL endpoint for queries

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
   JWT_EXPIRES_IN=1d
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start server**

   * Development (with nodemon):

     ```bash
     npm run dev
     ```
   * Production:

     ```bash
     npm start
     ```

5. **Test endpoints in Postman**
   Use the `Authorization` header for protected routes:

   ```http
   Authorization: Bearer <token>
   ```

---

## API Endpoints & Parameters

### Authentication

| Method | Endpoint         | Description             | Body Parameters                                        |
| ------ | ---------------- | ----------------------- | ------------------------------------------------------ |
| POST   | /api/auth/signup | Register a new user     | `name` (string), `email` (string), `password` (string) |
| POST   | /api/auth/login  | Login and get JWT token | `email` (string), `password` (string)                  |

---

### Threads

| Method | Endpoint               | Access        | Description                 | Body Parameters                        |
| ------ | ---------------------- | ------------- | --------------------------- | -------------------------------------- |
| POST   | /api/threads           | Auth required | Create a new thread         | `title` (string), `content` (string)   |
| GET    | /api/threads           | Public        | Get all threads             | None                                   |
| GET    | /api/threads/\:id      | Public        | Get thread by ID            | None                                   |
| DELETE | /api/threads/\:id      | Admin only    | Delete thread               | None                                   |
| POST   | /api/threads/\:id/vote | Auth required | Upvote or downvote a thread | `vote` (1 for upvote, -1 for downvote) |

### Comments

| Method | Endpoint                   | Access        | Description                  | Body Parameters    |
| ------ | -------------------------- | ------------- | ---------------------------- | ------------------ |
| POST   | /api/threads/\:id/comments | Auth required | Add a comment to a thread    | `content` (string) |
| POST   | /api/comments/\:id/reply   | Auth required | Reply to an existing comment | `content` (string) |
| POST   | /api/comments/\:id/vote    | Auth required | Upvote or downvote a comment | `vote` (1 or -1)   |

### Admin Routes

| Method | Endpoint                 | Access     | Description           |
| ------ | ------------------------ | ---------- | --------------------- |
| GET    | /api/admin/threads       | Admin only | List all threads      |
| DELETE | /api/admin/comments/\:id | Admin only | Delete a spam comment |

### Optional GraphQL Endpoint

* **URL:** `/graphql`
* **Enabled GraphiQL UI** for testing
* Example query:

```graphql
{
  threads {
    id
    title
    content
    author
    comments {
      id
      content
      author
    }
  }
}
```

---

## Suggested Folder Structure

```
forum-api/
│
├─ src/
│  ├─ controllers/
│  │  ├─ authController.js
│  │  ├─ threadController.js
│  │  ├─ commentController.js
│  │
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ Thread.js
│  │  └─ Comment.js
│  │
│  ├─ routes/
│  │  ├─ auth.js
│  │  ├─ threads.js
│  │  ├─ comments.js
│  │  └─ admin.js             # admin moderation routes
│  │
│  ├─ middleware/
│  │  ├─ auth.js
│  │  ├─ roleCheck.js
│  │  └─ validateRequest.js
│  │
│  └─ graphql/
│     └─ schema.js             # GraphQL schema for threads & comments
│
├─ .env.example
├─ package.json
└─ server.js
```
