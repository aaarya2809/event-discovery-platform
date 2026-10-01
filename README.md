# Eventify – Event Discovery Platform

Eventify is a full-stack web application that helps users discover events, explore event details, and manage their event registrations.

## Features

* Browse and discover events.
* Search events by title and location.
* Filter events by category.
* User registration and login.
* Secure authentication using JWT.
* RSVP to events.
* View and manage registered events.
* Cancel event registrations.

## Tech Stack

**Frontend:** React.js, Vite, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB
**Authentication:** JSON Web Tokens (JWT)

## Project Structure

```text
event-discovery-platform/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   └── package.json
└── .gitignore
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/aaarya2809/event-discovery-platform.git
cd event-discovery-platform
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

### 3. Start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Configure your environment variables before starting the backend.

## Author

Aarya Malghe
