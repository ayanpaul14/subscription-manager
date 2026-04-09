# 🎯 SubTrack — Subscription Manager

> Never get charged by surprise again.

SubTrack is a full-stack web application that helps you track all your subscriptions, get smart renewal alerts, and cancel what you don't need — saving you money every month.

![SubTrack](https://subtrack-sooty.vercel.app)

---

## 🌐 Live Demo

🔗 **[subtrack-sooty.vercel.app](https://subtrack-sooty.vercel.app)**

> Demo account: `demo@subtrack.com` / `demo123`

---

## ✨ Features

- 🔔 **Smart Renewal Alerts** — Email reminders 7, 3 and 1 day before every renewal
- 📊 **Spending Analytics** — Beautiful charts showing monthly and yearly spend
- 📧 **Gmail Auto-Detection** — Scan inbox to automatically detect active subscriptions
- 🔒 **Secure Authentication** — Google login + Email/Password with JWT
- 💳 **Payment Tracking** — Mark subscriptions as paid and track history
- 🏆 **Rewards & Badges** — Earn points for good financial habits

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|-----------|-------|
| React + Vite | UI Framework |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Firebase | Google Authentication |
| Axios | API calls |

### Backend
| Technology | Usage |
|-----------|-------|
| Node.js + Express | Server |
| MongoDB Atlas | Database |
| JWT | Authentication |
| Nodemailer | Email alerts |

### Deployment
| Service | Usage |
|---------|-------|
| Vercel | Frontend hosting |
| Railway | Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Firebase project

### 1. Clone the repository
```bash
git clone https://github.com/ayanpaul14/subscription-manager.git
cd subscription-manager
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

Start the backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_APIKEY=your_firebase_api_key
VITE_FIREBASE_AUTHDOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECTID=your_firebase_project_id
VITE_FIREBASE_STORAGEBUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGINGSENDERID=your_firebase_messaging_sender_id
VITE_FIREBASE_APPID=your_firebase_app_id
```

Start the frontend:
```bash
npm run dev
```

---

## 📁 Project Structure

```
subscription-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/         # Images, icons
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   └── api/            # Axios config
│   └── vercel.json         # Vercel routing config
│
└── server/                 # Node.js backend
    ├── config/             # Database config
    ├── middleware/         # Auth middleware
    ├── models/             # MongoDB models
    ├── routes/             # API routes
    └── utils/              # Helper functions
```

---

## 👨‍💻 Author

**Ayan Paul**

[![GitHub](https://img.shields.io/badge/GitHub-ayanpaul14-black?logo=github)](https://github.com/ayanpaul14)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you found this project helpful, please give it a star!**
