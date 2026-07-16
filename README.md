# Chat App

A real-time one-on-one chat application built with the MERN stack and Socket.IO. Users can sign up, log in, see who's online, exchange text/image messages instantly, and manage their profile (including a Cloudinary-hosted avatar).

## Features

- **Authentication** — JWT-based signup/login with hashed passwords (bcrypt)
- **Real-time messaging** — instant delivery via Socket.IO, no page reload
- **Online presence** — live list of currently connected users
- **Image sharing in chat** — images uploaded to Cloudinary and sent as message attachments
- **Read receipts** — messages are marked as seen per conversation
- **Unseen message counts** — per-user unread badge in the sidebar
- **Profile management** — update name, bio, and profile picture

## Tech Stack

**Frontend** (`Fend/`)
- React 18 + Vite
- React Router DOM
- Tailwind CSS
- Axios
- Socket.IO client
- React Hot Toast

**Backend** (`server/`)
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.IO
- JSON Web Tokens (jsonwebtoken)
- bcryptjs
- Cloudinary (image storage)

## Project Structure

```
Chat-App/
├── Fend/                          # React frontend (Vite)
│   ├── context/
│   │   ├── auth-context.js        # AuthContext definition
│   │   ├── AuthContext.jsx        # Auth state, login/logout, socket connection
│   │   ├── chat-context.js        # ChatContext definition
│   │   └── ChatContext.jsx        # Chat/messages state and actions
│   ├── public/                    # Static assets served as-is
│   ├── src/
│   │   ├── assets/                # Images, icons, and assets.js barrel file
│   │   ├── components/
│   │   │   ├── ChatContainer.jsx  # Main chat window (messages + input)
│   │   │   ├── RightSidebar.jsx   # Selected user's profile/media panel
│   │   │   └── Sidebar.jsx        # Conversation list / user search
│   │   ├── lib/
│   │   │   └── utils.js           # Frontend helper functions
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Main chat layout (sidebar + chat + right panel)
│   │   │   ├── LoginPage.jsx      # Signup / login form
│   │   │   └── ProfilePage.jsx    # Edit profile (name, bio, avatar)
│   │   ├── App.jsx                # Route definitions
│   │   ├── App.css / index.css    # Global styles (Tailwind)
│   │   └── main.jsx                # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── vercel.json                # Vercel deployment config
│   └── package.json
│
├── server/                        # Express backend (REST API + Socket.IO)
│   ├── controllers/
│   │   ├── userController.js      # signup, login, checkAuth, updateProfile
│   │   └── messageController.js   # sidebar users, get/send messages, mark as seen
│   ├── lib/
│   │   ├── cloudinary.js          # Cloudinary SDK config
│   │   ├── db.js                  # MongoDB connection (Mongoose)
│   │   └── utilis.js              # generateToken() JWT helper
│   ├── middleware/
│   │   └── auth.js                # protectRoute — verifies JWT, attaches req.user
│   ├── models/
│   │   ├── Message.js             # Message schema (sender, receiver, text, image, seen)
│   │   └── User.js                # User schema (email, fullName, password, profilePic, bio)
│   ├── routes/
│   │   ├── messageRoute.js        # /api/messages/*
│   │   └── userRoutes.js          # /api/auth/*
│   ├── server.js                  # App entry point, Socket.IO setup, online-user map
│   ├── vercel.json                # Vercel deployment config
│   └── package.json
│
└── README.md
```

## API Reference

Base URL: `/api`

### Auth (`/api/auth`)

| Method | Endpoint           | Auth required | Description                          |
|--------|---------------------|:--------------:|---------------------------------------|
| POST   | `/signup`           | No             | Create a new account                  |
| POST   | `/login`             | No             | Log in and receive a JWT              |
| GET    | `/check`             | Yes            | Verify token / fetch current user     |
| PUT    | `/update-profile`   | Yes            | Update `fullName`, `bio`, `profilePic` |

### Messages (`/api/messages`)

| Method | Endpoint     | Auth required | Description                                   |
|--------|---------------|:--------------:|-------------------------------------------------|
| GET    | `/users`      | Yes            | Get all users (minus self) + unseen message counts |
| GET    | `/:id`        | Yes            | Get full conversation with user `:id`, marks it as seen |
| PUT    | `/mark/:id`   | Yes            | Mark a single message as seen                 |
| POST   | `/send/:id`   | Yes            | Send a text/image message to user `:id`       |

Authenticated requests must include a `token` header containing the JWT returned by `/signup` or `/login`.

### Socket.IO events

| Event             | Direction        | Payload                | Description                          |
|--------------------|-------------------|--------------------------|---------------------------------------|
| `connection`       | client → server  | query: `{ userId }`     | Registers the user as online          |
| `getOnlineUsers`   | server → clients | `string[]` of user IDs  | Broadcast whenever online users change |
| `newMessage`       | server → client  | message object           | Pushed to the recipient in real time  |

## Getting Started

### Prerequisites

- Node.js
- A MongoDB database (local or Atlas)
- A Cloudinary account (for image uploads)

### 1. Backend setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Run the server:

```bash
npm run server   # dev, with nodemon
# or
npm start        # production
```

### 2. Frontend setup

```bash
cd Fend
npm install
```

Create a `.env` file in `Fend/`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

Run the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`, talking to the API at `http://localhost:5000`.

### Build for production

```bash
cd Fend
npm run build     # outputs to Fend/dist
```

## Deployment

Both `Fend/` and `server/` include a `vercel.json` for deployment to Vercel. The backend switches to Vercel's serverless-friendly mode (no explicit `server.listen`) when `NODE_ENV=production`, exporting the HTTP server instance directly.

## Security Note

The `.env` files in this repository currently contain real credentials (MongoDB URI, JWT secret, Cloudinary keys) and are committed to git despite being listed in `.gitignore`. **Rotate these credentials and remove the files from git history** before making this repository public.
