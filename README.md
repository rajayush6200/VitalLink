# 🩸 VitalLink — Blood Bank Management System

<div align="center">

![VitalLink](https://img.shields.io/badge/VitalLink-Blood%20Bank%20System-red?style=for-the-badge&logo=heart)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen?style=for-the-badge&logo=mongodb)
![Python](https://img.shields.io/badge/Python-Flask%20AI-blue?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A full-stack Blood Bank Management System with AI-powered blood sample analysis, donor & recipient management, and a powerful Admin Dashboard.**

*Built by [Ayush Raj](https://github.com/rajayush6200)*

</div>

---

## 🚀 Features

### 👤 User / Donor Side
- Donor registration with full name, email, age, and blood group
- 🧠 **AI-powered blood sample analysis** — detects Normal / Infected with confidence score
- ✅ Donor details submitted only if AI result is **Normal**
- 🩸 Blood request form for recipients
- 💬 Contact & message submission
- 🎨 Responsive modern UI with Glassmorphism design

### 🔐 Admin Dashboard
- Secure admin-only access
- 📊 Dashboard statistics — Total / Pending / Approved / Rejected blood requests
- 🛠️ Manage blood requests (Approve / Reject)
- 👥 Manage users and donors (only AI-verified normal donors visible)
- 💬 Reply to user messages
- 🔔 Post announcements (Urgent / Normal)
- 🔄 Live data from MongoDB Atlas

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3 (Glassmorphism), Vanilla JavaScript |
| **Backend** | Node.js, Express.js, MongoDB (Mongoose), Multer, JWT, bcryptjs |
| **AI Service** | Python, Flask, TensorFlow/Keras |
| **Database** | MongoDB Atlas |

---

## 📁 Project Structure

```
VitalLink/
├── frontend/           # Static HTML/CSS/JS pages
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── donate.html
│   ├── need-blood.html
│   ├── admin-dashboard.html
│   └── ...
├── backend/            # Node.js/Express REST API
│   ├── server.js
│   ├── routes/         # auth, donors, bloodRequest, messages, analyze...
│   ├── models/         # Mongoose schemas
│   ├── uploads/        # Blood sample images (gitignored)
│   └── .env            # Environment variables (gitignored)
├── ai-service/         # Python Flask AI microservice
│   ├── app.py
│   ├── predict.py
│   ├── blood_infection_model.h5
│   └── requirements.txt
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Python 3.8+
- MongoDB Atlas account

### 1. Clone the Repository

```bash
git clone https://github.com/rajayush6200/VitalLink.git
cd VitalLink
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/vitallink
JWT_SECRET=your_64_character_secure_random_string
PORT=5000
AI_SERVICE_URL=http://localhost:5001/analyze
ADMIN_EMAIL=your_admin@email.com
ADMIN_PASSWORD=your_admin_password
```

### 3. AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
python app.py       # Starts Flask on port 5001
```

### 4. Seed Admin Account

```bash
cd backend
node changeAdminPassword.js
```

### 5. Start Backend

```bash
cd backend
npm run dev         # Starts Express on port 5000
```

### 6. Open Frontend

Open `frontend/index.html` in your browser — or serve it:

```bash
npx serve frontend  # Serves on port 3000
```

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `PORT` | Backend server port (default: 5000) |
| `AI_SERVICE_URL` | Python Flask AI service URL |
| `ADMIN_EMAIL` | Admin dashboard login email |
| `ADMIN_PASSWORD` | Admin dashboard login password |

---

## 🧠 AI Integration Flow

```
User uploads blood image
        ↓
Frontend → POST /api/analyze (with image)
        ↓
Backend (Node.js) → Calls Flask AI service (AI_SERVICE_URL)
        ↓
Flask loads TensorFlow model → Analyzes image
        ↓
Returns: { result: "normal"|"infected", confidence: 0.87 }
        ↓
If Normal → Donor registered in MongoDB
If Infected → Registration blocked
```

---

## 👤 Author

**Ayush Raj**
- GitHub: [@rajayush6200](https://github.com/rajayush6200)
- Email: rajayush6200@gmail.com

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
Made with ❤️ by Ayush Raj
</div>
