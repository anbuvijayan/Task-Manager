# 📝 Task Manager App

A full-stack Task Manager application where users can register, log in, and manage their daily tasks with ease. Tasks can be added, edited, marked complete, pinned, and sorted.

---

## 🚀 Features

- ✅ User Authentication (JWT & bcrypt)
- 🗂️ Task Management (CRUD, complete/incomplete, pin, sort)
- 📱 Responsive UI with React
- ⚙️ RESTful API with Node.js + Express
- 🛢️ MongoDB for data storage

---

## 🛠️ Tech Stack

**Frontend:**
- React+Vite
- React Router
- Axios
- Tailwind CSS / Bootstrap

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT & bcrypt

---

## 📁 Project Structure

/frontend ← React+Vite frontend
/backend ← Node.js backend
/models ← Mongoose schemas
/routes ← Auth & Task APIs
/controllers← Logic handlers
/middleware ← JWT auth middleware

---

## ⚙️ Setup Instructions

### 📌 Prerequisites
- Node.js & npm
- MongoDB Atlas or local MongoDB
- Git

### 🔧 Backend Setup

```bash
cd backend
npm install

Create .env file

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

Start the backend: npm run dev

💻 Frontend Setup

cd frontend
npm install

Create .env file

REACT_APP_API_URL=http://localhost:5000/api

Start the frontend: npm start


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



