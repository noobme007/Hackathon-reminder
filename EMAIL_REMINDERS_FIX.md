# 📧 Email Reminders - Setup & Troubleshooting Guide

## What Was Fixed

Your email reminder system had several issues that prevented it from working:

1. ✅ **Transporter Initialization** - Fixed async timing issues
2. ✅ **HTML Emails** - Added formatted HTML emails (better than plain text)
3. ✅ **Error Handling** - Improved error logging for debugging
4. ✅ **Cron Frequency** - Changed from hourly to every 30 minutes (faster testing)
5. ✅ **Gmail Authentication** - Updated to use proper Gmail App Password method

---

## ✅ Quick Setup Steps

### Step 1: Get Gmail App Password
**IMPORTANT:** You cannot use your regular Gmail password. You must use an App Password.

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already done
3. Scroll down and click **App passwords**
4. Select:
   - App: **Mail**
   - Device: **Windows Computer** (or your device type)
5. Google will generate a 16-character password
6. Copy it (removing any spaces): `XXXXXXXXXXXX`

### Step 2: Update Render Environment Variables

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your **Backend Web Service**
3. Go to **Settings** tab
4. Scroll to **Environment Variables**
5. Update or add these variables:

```
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = (the 16-char app password from Step 1)
```

6. Render will auto-redeploy

### Step 3: Verify It's Working

After deployment, check the logs:
1. Go to Render dashboard → Your backend service
2. Click **Logs** tab
3. You should see: `✅ Email transporter initialized and verified successfully`

---

## 🧪 How to Test

### Test 1: Create a Hackathon with Deadline in 2 Days
1. Login to your app
2. Add a new hackathon with:
   - **Registration Deadline**: 2 days from now
   - **PPT Deadline**: 5 days from now
3. Wait up to 30 minutes for the cron job to run
4. Check your email inbox for the reminder

### Test 2: Check Server Logs
Go to Render logs and search for `📧` to see email sending attempts.

You should see messages like:
```
✅ Email sent successfully to user@example.com (Message ID: ...)
```

---

## 🔍 Troubleshooting

### Problem: "Email transporter not ready" message

**Solution:** Check that environment variables are set correctly:
- `EMAIL_USER` - Must be a valid Gmail address
- `EMAIL_PASS` - Must be the 16-character App Password (not regular password)

### Problem: "Authentication failed" error

**Possible causes:**
1. Using regular Gmail password instead of App Password
2. 2-Step Verification not enabled on Google Account
3. Gmail credentials are incorrect

**Solution:**
1. Delete the old `EMAIL_PASS`
2. Generate a new App Password from Google Account
3. Update Render environment variables
4. Wait for Render to redeploy

### Problem: Emails not sending but no errors

**Check:**
1. Is the deadline actually within 3 days? (Reminders only send 3 days and 1 day before)
2. Check if you already received a reminder for this hackathon
   - Look at the database: `registrationReminderSent_3days` = false?
   - Or create a new hackathon
3. Wait 30 minutes for the next cron run

### Problem: "CORS" or "Connection" errors

This means the backend might not be running properly. Check:
1. Render backend status - should say "Live"
2. Check Build and Deployment logs for errors
3. Verify `MONGO_URI` is correct

---

## 📝 How It Works

1. **Cron Job** runs every 30 minutes automatically
2. **Database Query** finds all hackathons with upcoming deadlines
3. **Time Check** determines if reminder should be sent:
   - 3-day reminder: 3 days before deadline
   - 1-day reminder: 1 day before deadline
4. **Email Send** via Gmail if transporter is ready
5. **Flag Update** marks reminder as sent (prevents duplicates)

---

## 💾 Environment Variables Checklist

For email reminders to work, make sure these are set in Render:

- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Random secret key
- [ ] `EMAIL_USER` - Your Gmail address
- [ ] `EMAIL_PASS` - Gmail App Password (16 chars)
- [ ] `CLIENT_URL` - Your Vercel frontend URL

---

## 🚀 Next Steps

1. Set up the Gmail App Password (if not done)
2. Update Render environment variables
3. Wait for auto-deployment to complete
4. Create a test hackathon with a deadline 2-3 days from now
5. Wait up to 30 minutes and check your email
6. Monitor logs for success messages

If you still have issues, check the Render logs for the exact error message!
