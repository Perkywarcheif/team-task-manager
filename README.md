# 🚀 Team Task Manager

> A full-stack collaborative task management web application — think Trello, but built from scratch.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![MySQL](https://img.shields.io/badge/Database-MySQL-orange) ![Deploy](https://img.shields.io/badge/Deployed-Railway-purple)

---

## 🌐 Live Demo
| Service | URL |
|---|---|
| 🖥️ Frontend | https://team-task-manager-production-b93c.up.railway.app |
| ⚙️ Backend API | https://team-task-manager-production-18da.up.railway.app |

---

## 📌 Overview

Team Task Manager is a real-world collaborative application where multiple users can manage tasks efficiently within teams. Users can create projects, invite members, assign tasks, and track progress — all in one place.

---

## ✨ Features

### 🔐 Authentication
- Secure Signup & Login
- JWT-based authentication
- Protected routes

### 📁 Project Management
- Create projects instantly
- Project creator becomes Admin automatically
- Add or remove team members by email

### ✅ Task Management
- Create tasks with Title, Description, Due Date & Priority
- Assign tasks to specific team members
- Track progress with status updates: `To Do` → `In Progress` → `Done`

### 📊 Dashboard
- Total task count
- Tasks grouped by status
- Tasks per user
- Overdue task tracking

### 🔒 Role-Based Access Control
| Feature | Admin | Member |
|---|---|---|
| Create Tasks | ✅ | ❌ |
| Assign Tasks | ✅ | ❌ |
| Delete Tasks | ✅ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| Update Task Status | ✅ | ✅ (own tasks only) |
| View Project | ✅ | ✅ |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL (Aiven Cloud) |
| Auth | JSON Web Tokens (JWT) |
| Deployment | Railway |

---

## 📂 Project Structure

```
team-task-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   └── tasks.js
│   ├── db.js
│   ├── index.js
│   └── .env
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── Projects.jsx
        │   └── ProjectDetail.jsx
        ├── api.js
        └── App.jsx
```

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- Git

### 1. Clone the repo
```bash
git clone https://github.com/Perkywarcheif/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
DB_PORT=3306
JWT_SECRET=supersecretkey123
```

Create tables in MySQL — run the SQL from the setup guide, then:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

---

## 🚀 Deployment

- **Backend** deployed on [Railway](https://railway.app)
- **Frontend** deployed on [Railway](https://railway.app)
- **Database** hosted on [Aiven Cloud MySQL](https://aiven.io)
- Environment variables configured securely in Railway service settings

---

## 🎥 Demo Video
> [Click here to watch the demo](#) 

---

## 👨‍💻 Author
**Anirudh**
- GitHub: [@Perkywarcheif](https://github.com/Perkywarcheif)

```markdown
> 💡 *From database schema to deployed product — engineered end-to-end in a single day.*
