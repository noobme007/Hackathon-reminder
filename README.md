# Hackathon Deadline Reminder

A production-ready full-stack web application designed to help students and developers track hackathon deadlines. It features a modern dashboard with countdown timers and an automated email reminder system.

## 🚀 Features

- **Authentication System**: Secure user signup and login using JWT and bcrypt.
- **Hackathon Management**: 
  - Add, Edit, and Delete hackathons.
  - Track **Registration Deadlines** and **PPT/Submission Deadlines**.
- **Automated Reminders**:
  - The system automatically checks deadlines every hour.
  - Sends email notifications **3 days** and **1 day** before any deadline.
  - Prevents duplicate emails.
- **Modern UI**:
  - Built with **React + Tailwind CSS**.
  - Responsive design for mobile and desktop.
  - Live countdown timers for urgency.

## 🛠 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt (Password Hashing)
- Node Cron (Task Scheduling)
- Nodemailer (Email Services)

## 📂 Project Structure

```
hackathon-reminder/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Cards, Timer)
│   │   ├── context/        # Auth Context
│   │   ├── pages/          # Full pages (Dashboard, Login, Add/Edit)
│   │   ├── services/       # API configuration
│   │   └── App.jsx         # Main routing
│
├── server/                 # Node.js Backend
│   ├── config/             
│   ├── controllers/        # Route logic
│   ├── cron/               # Cron job for reminders
│   ├── middleware/         # Auth protection
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Routes
│   └── server.js           # Entry point
```

## ⚙️ Setup Instructions

### Prerequisites
- **Node.js** installed.
- **MongoDB** running locally or a MongoDB Atlas URI.

### 1. Backend Setup
1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - The project includes a `.env` file with defaults.
   - For email reminders to work, update `EMAIL_USER` and `EMAIL_PASS` in `.env`.
   - **Note**: For Gmail, you must use an **App Password** (not your login password).
4. Start the server:
   ```bash
   npm start
   ```
   *Server will run on http://localhost:5000*

### 2. Frontend Setup
1. Open a **new terminal** and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *Frontend will run on http://localhost:5173*

## 🧪 Testing the App
1. Go to the frontend URL.
2. Sign up for a new account.
3. Add a hackathon with a deadline in the near future (e.g., 2 days from now to test the 3-day reminder logic, or tomorrow for 1-day).
4. The dashboard will show the countdown.
5. The backend console will log when the Cron Job runs (every hour) and if emails are sent.

---
**Note**: The Cron job is set to run every hour (`0 * * * *`). For testing purposes, you can modify `server/cron/reminderCron.js` to run every minute (`* * * * *`).
