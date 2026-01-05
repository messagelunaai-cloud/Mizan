# Quick Start Guide

## First Time Setup

### 1. Install Dependencies

Open two terminals:

**Terminal 1 - Frontend:**
```bash
cd mizan-vite
npm install
```

**Terminal 2 - Backend:**
```bash
cd mizan-vite/server
npm install
```

### 2. Configure Environment

Create `server/.env` file:
```env
PORT=3001
JWT_SECRET=mizan-production-secret-change-this
NODE_ENV=development
```

### 3. Start Both Servers

**Terminal 1 - Start Backend (run first):**
```bash
cd server
npm run dev
```
Wait for: `✅ Database initialized`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```

Open browser to: `http://localhost:5174`

## Using the App

### First Device (Registration)

1. Go to **Access** page
2. **Option A - Create Account:**
   - Enter username
   - Enter password (min 6 characters)
   - Optional: Add an access code (for easy login on other devices)
   - Click "Create Account"

3. You're logged in! Start your first check-in.

### Second Device (Login)

1. Go to **Access** page on your other device
2. **Option A - Login with Access Code:**
   - Enter your access code
   - Click "Enter"

   **Option B - Login with Credentials:**
   - Enter username
   - Enter password
   - Click "Enter"

3. Your progress syncs automatically!

## Daily Workflow

1. **Check In** (Daily)
   - Complete Salah (all 5 prayers required)
   - Complete 2 of 6 other categories:
     - Qur'an (10+ minutes)
     - Physical (20+ minutes)
     - Build (with description)
     - Study
     - Journal
     - Rest
   - Clear any debts first
   - Submit when done

2. **Cycle** (Weekly View)
   - See current 7-day cycle progress
   - Track previous cycles

3. **Status** (Overview)
   - View total completed days
   - Check current rank
   - See rank definition and how to advance
   - Monitor current streak

4. **Settings**
   - View account info
   - Logout
   - Reset data (if needed)

## Rank Progression

- **Ghāfil** → Complete 1 day
- **Muntabih** → Complete 1 cycle (7 days)
- **Multazim** → Complete 3 cycles
- **Muwāẓib** → Complete 7 cycles
- **Muhāsib** → Complete 30+ days + recover from a missed day
- **Muttazin** → Maintain consistency (pinnacle)

## Troubleshooting

### "Login failed" error
- Check backend server is running on port 3001
- Check terminal for error messages

### Data not syncing
- Look at sync status indicator (top-right)
- If "Offline mode", check backend is running
- Logout and login again to force sync

### Forgot password
- Currently no password reset
- Use access code if you set one
- Or reset data and start fresh (Settings page)

## Production Deployment

See README.md for production build instructions and deployment considerations.

## Support

This is a personal accountability tool. No external support provided.

---

**Remember:** This is between you and Allah. Be honest in your tracking.
