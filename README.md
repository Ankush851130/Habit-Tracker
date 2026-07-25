# ⚡ Production-Ready MERN Habit Tracker SaaS Application

A full-stack, portfolio-grade MERN Habit Tracker Web Application with modern Glassmorphism UI (Notion + Linear + Stripe design language), Framer Motion micro-interactions, complete REST API backend with Express & MongoDB, JWT authentication, gamification (XP, Levels, Badges), interactive heatmap calendar, Recharts analytics, and extra trackers (Pomodoro, Water, Mood, Sleep, Journal).

---

## 🌟 Key Features

### 🎨 Design & Aesthetics
- **Glassmorphism Design System**: Sleek backdrop-blur panels, obsidian dark slate themes, vibrant HSL gradients, and micro-interactions.
- **Dark Mode & Light Mode**: Built-in instant theme switcher with CSS variable overrides.
- **Framer Motion Micro-Interactions**: Smooth page transitions, animated flame icons, XP progress bars, and celebratory confetti upon habit completion.

### 🎮 Gamification & Level Engine
- **Streak System**: Track daily streaks, personal best longest streaks, and animated streak fire.
- **Level & XP Engine**: Earn 15 XP for every completed habit log; level up automatically according to formula `Level = Math.floor(XP / 100) + 1`.
- **Achievement Badges**: Unlock milestones such as *First Step*, *7 Day Streak*, *30 Day Master*, *Consistency King*, *Rising Star*, and *Habit Champion*.

### 📊 Analytics & Interactive Heatmap
- **GitHub-Style Heatmap Matrix**: 365-day habit completion density grid (Red/Yellow/Green).
- **Recharts Data Visualizations**: Weekly bar charts, Category distribution pie charts, and Daily completion rate area graphs.
- **CSV & PDF Export**: Download raw CSV habit progress data or print clean PDF summary reports directly from the app.

### 🛠️ Extra Productivity Trackers
- **Pomodoro Focus Timer**: 25-minute interactive timer with completion notifications.
- **Mood Tracker**: Daily mood logger (Excellent, Good, Neutral, Bad, Terrible).
- **Water Intake Tracker**: 8-glass daily hydration counter.
- **Reflection Journal**: Daily gratitude and note logger.
- **Global Leaderboard**: Experience rank leaderboards among all active habit builders.

---

## 🏗️ Project Structure

```
habit-tracker/
├── backend/
│   ├── config/             # DB connection & server configs
│   ├── controllers/        # Auth, Habit, Analytics, Achievement, User, Extra controllers
│   ├── middlewares/        # JWT auth protection, error handling, Multer file upload
│   ├── models/             # User, Habit, Category, Achievement, Notification, Activity, ExtraTracker
│   ├── routes/             # Express routes
│   ├── services/           # Gamification service, Nodemailer service
│   ├── validators/         # Express-validator schemas
│   ├── utils/              # Seeders and database scripts
│   ├── app.js              # Express middleware stack setup
│   └── server.js           # Express HTTP server entry
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components (GlassCard, XPBar, StreakFire, Charts, Forms)
    │   ├── context/        # AuthContext, ThemeContext, HabitContext
    │   ├── pages/          # Home, Login, Register, Dashboard, Habits, Calendar, Analytics, Profile, etc.
    │   ├── services/       # Axios API client & modules
    │   ├── utils/          # Date & Export helper utilities
    │   ├── App.jsx         # Router & Providers
    │   └── main.jsx        # Root mount
    ├── tailwind.config.js  # Glassmorphism tokens & custom styling
    └── vite.config.js      # Vite build & proxy config
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster URI)

### 1. Backend Installation & Setup
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/habit_tracker
JWT_SECRET=super_secret_jwt_key_habit_tracker_2026_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

Run database seeder to initialize default categories & achievement badges:
```bash
npm run seed
```

Start backend server:
```bash
npm run dev
```

### 2. Frontend Installation & Setup
```bash
cd ../frontend
npm install
```

Start Vite frontend development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🌐 API Reference Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login user & return JWT token |
| `GET` | `/api/auth/me` | Fetch current authenticated user |
| `GET` | `/api/habits` | Fetch user habits (supports category, priority & search filters) |
| `POST` | `/api/habits` | Create a new habit |
| `POST` | `/api/habits/:id/toggle-status` | Toggle habit status (`completed`, `missed`, `skipped`) & update XP |
| `GET` | `/api/analytics/summary` | Fetch analytics summary & 365-day heatmap data |
| `GET` | `/api/achievements` | Fetch unlocked badges & XP level |
| `POST` | `/api/user/avatar` | Upload user profile avatar image |

---

## ☁️ Deployment Instructions

### Frontend (Vercel)
1. Import `frontend/` folder into Vercel.
2. Set Environment Variable: `VITE_API_URL` -> Your deployed backend URL.
3. Deploy!

### Backend (Render)
1. Create a Web Service on Render targeting `backend/`.
2. Build Command: `npm install`
3. Start Command: `node server.js`
4. Set Environment Variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`.
