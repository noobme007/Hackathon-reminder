# 🚀 Deployment Guide - Hackathon Reminder

This guide explains how to deploy your MERN stack application safely to production.

## 🔐 Are My Credentials Safe?
**YES.** Here is why:
1.  **Local Safety**: Your secrets (passwords, API keys) are stored in `.env` files.
2.  **Git Safety**: We have configured `.gitignore` to **ignore** `.env` files. This means your passwords will **NEVER** be uploaded to GitHub.
3.  **Production Safety**: When you deploy, you will not upload the `.env` file. Instead, you will enter these values into the "Environment Variables" section of your hosting provider (Render, Vercel, etc.). These are encrypted and secure.

---

## 📦 Step 1: Database (MongoDB Atlas)
Since your local MongoDB (`localhost`) won't work on the internet, you need a cloud database.
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Create a database user (username/password).
4.  Allow access from anywhere (`0.0.0.0/0`) in Network Access.
5.  Get your **Connection String**. It looks like:
    `mongodb+srv://<username>:<password>@cluster0.mongodb.net/hackathon-reminder?retryWrites=true&w=majority`

---

## ⚙️ Step 2: Deploy Backend (Render.com)
Render is a great free choice for Node.js apps.
1.  Push your code to **GitHub**.
2.  Sign up for [Render](https://render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Root Directory**: `server` (Important!)
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
6.  **Environment Variables** (Scroll down to "Advanced"):
    *   Add the following keys and values:
        *   `MONGO_URI`: (Paste your Atlas connection string from Step 1)
        *   `JWT_SECRET`: (Create a strong random password, e.g., `mySuperSecretKey2026`)
        *   `EMAIL_USER`: `notificationguys@gmail.com`
        *   `EMAIL_PASS`: `yqlchvztggwuhfwr`
        *   `CLIENT_URL`: `https://your-frontend-project.vercel.app` (You will get this URL in Step 3, come back and update it later!)
7.  Click **Deploy Web Service**.

---

## 🎨 Step 3: Deploy Frontend (Vercel)
Vercel is optimized for React/Vite apps.
1.  Sign up for [Vercel](https://vercel.com/).
2.  Click **Add New...** -> **Project**.
3.  Import from GitHub.
4.  **Settings**:
    *   **Root Directory**: Edit this and select `client`.
    *   **Framework Preset**: Vite (Automatic).
5.  **Environment Variables**:
    *   Name: `VITE_API_URL`
    *   Value: (The URL of your Render Backend from Step 2, e.g., `https://hackathon-api.onrender.com/api`)
        *   *Note: Make sure to include `/api` at the end!*
6.  Click **Deploy**.

---

## 🔄 Final Connection
1.  Copy your new Vercel domains URL (e.g., `https://hackathon-reminder.vercel.app`).
2.  Go back to **Render (Backend) Settings** -> **Environment Variables**.
3.  Update (or add) `CLIENT_URL` with this Vercel URL.
4.  Reference the `.env` locally:
    *   Ensure `VITE_API_URL` in your local setup points to localhost for dev, but Vercel handles it for prod.

**🎉 DONE! Your app is now live and secure.**
