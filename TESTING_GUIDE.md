# 🔄 Multi-Device Testing Guide

## Visual Step-by-Step Guide

### Scenario: Test data sync between your computer and phone

---

## 📍 STEP 1: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Expected Output:**
```
🚀 Mizan server running on http://localhost:3001
✅ Database initialized
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Expected Output:**
```
VITE v6.4.1  ready in 286 ms
➜  Local:   http://localhost:5174/
```

---

## 📍 STEP 2: Register Account (Computer)

### Visual Flow:

```
┌─────────────────────────────────────┐
│        COMPUTER (Chrome)            │
│  http://localhost:5174/access       │
├─────────────────────────────────────┤
│                                     │
│  Access code:                       │
│  [Leave empty for now]              │
│                                     │
│  ────────── OR ──────────           │
│                                     │
│  Username:                          │
│  [Ali]                              │
│                                     │
│  Password:                          │
│  [password123]                      │
│                                     │
│  [x] New user? Create account       │
│                                     │
│  [ CREATE ACCOUNT ]                 │
│                                     │
└─────────────────────────────────────┘

After clicking "Create Account":
✅ Redirects to /checkin
✅ Top-right shows: "🌐 Just now"
```

---

## 📍 STEP 3: Complete a Check-in (Computer)

```
┌─────────────────────────────────────┐
│        Daily Check-in Page          │
├─────────────────────────────────────┤
│                                     │
│  Salah ✓                            │
│  ├─ Fajr: [On-time]                │
│  ├─ Dhuhr: [On-time]               │
│  ├─ Asr: [On-time]                 │
│  ├─ Maghrib: [On-time]             │
│  └─ Isha: [On-time]                │
│                                     │
│  Qur'an ✓                           │
│  ├─ [x] Recitation                 │
│  └─ Duration: [15] minutes         │
│                                     │
│  Physical ✓                         │
│  ├─ [x] Walk                       │
│  └─ Duration: [30] minutes         │
│                                     │
│  [ SUBMIT TODAY'S CHECK-IN ]        │
│                                     │
└─────────────────────────────────────┘

After submitting:
✅ Data saved to localStorage
✅ Synced to server (check top-right: "Just now")
✅ Can see in Status page
```

---

## 📍 STEP 4: Note Your Access Code

### Option A: Register with Access Code

Go back and register a NEW user with an access code:

```
Username: TestUser2
Password: test123456
Access Code: test-device-sync  ← REMEMBER THIS!
```

### Option B: Use Username/Password

If you didn't set an access code, use:
- Username: Ali
- Password: password123

---

## 📍 STEP 5: Login on Phone/Second Device

### Get your phone's IP to access the frontend:

**Find your computer's local IP:**

Windows:
```bash
ipconfig
# Look for: IPv4 Address: 192.168.x.x
```

Mac/Linux:
```bash
ifconfig
# Look for: inet 192.168.x.x
```

**Example IP: `192.168.1.100`**

### On your phone, open browser to:
```
http://192.168.1.100:5174/access
```

---

## 📍 STEP 6: Login on Phone

### Visual (Phone Screen):

```
┌─────────────────────────────────────┐
│     PHONE (Safari/Chrome)           │
│  http://192.168.1.100:5174/access   │
├─────────────────────────────────────┤
│                                     │
│  Access code:                       │
│  [test-device-sync]                 │
│                                     │
│  ────────── OR ──────────           │
│                                     │
│  Username:                          │
│  [TestUser2]                        │
│                                     │
│  Password:                          │
│  [test123456]                       │
│                                     │
│  [ Already have account? Login ]    │
│                                     │
│  [ ENTER ]                          │
│                                     │
└─────────────────────────────────────┘

After clicking "Enter":
✅ Redirects to /checkin
✅ Shows check-in from computer!
✅ Top-right: "🌐 Just now" (synced)
```

---

## 📍 STEP 7: Verify Data Synced

### On Phone - Check Status Page:

```
┌─────────────────────────────────────┐
│          Status Page                │
├─────────────────────────────────────┤
│                                     │
│  Total Days:        1               │
│  Current Streak:    1               │
│  Cycles:            0               │
│                                     │
│  Current Rank:                      │
│  Muntabih                           │
│  (Aware, alert)                     │
│                                     │
│  ✅ Shows same data as computer!   │
│                                     │
└─────────────────────────────────────┘
```

---

## 📍 STEP 8: Make Changes on Phone

### On Phone - Complete Another Day:

```
Change date to tomorrow manually
or complete tomorrow's check-in:

Salah: ✓ All 5 prayers
Qur'an: ✓ 20 minutes
Physical: ✓ 25 minutes

[ SUBMIT ]
```

---

## 📍 STEP 9: Verify Sync on Computer

### Back to Computer - Refresh Page:

```
┌─────────────────────────────────────┐
│     COMPUTER - Status Page          │
├─────────────────────────────────────┤
│                                     │
│  Total Days:        2  ← Updated!   │
│  Current Streak:    2  ← Updated!   │
│  Cycles:            0               │
│                                     │
│  ✅ Phone's changes synced!         │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 Success Indicators

### ✅ Everything Working If:

1. **Computer shows "🌐 Just now"** after check-in
2. **Phone can login** with access code or credentials
3. **Phone sees computer's data** immediately after login
4. **Computer sees phone's changes** after refresh
5. **No errors in browser console** (F12)
6. **No errors in server terminal**

---

## 🔍 Debugging Guide

### Issue: Phone can't connect

**Problem:** Phone shows "can't connect"

**Solutions:**
1. Check phone and computer on same WiFi
2. Verify IP address is correct
3. Try: `http://192.168.1.100:5174` (not https://)
4. Check firewall not blocking port 5174

**Test:**
```bash
# On computer, check if accessible:
curl http://localhost:5174
```

### Issue: Data not syncing

**Problem:** Changes don't appear on other device

**Check:**
1. Top-right indicator - should say "Just now"
2. Browser console (F12) - any red errors?
3. Server terminal - any errors?
4. Try logout + login on other device

**Test sync manually:**
```bash
# Check server is accessible:
curl http://localhost:3001/health

# Should return: {"status":"ok"}
```

### Issue: Can't login

**Problem:** "Invalid credentials" error

**Solutions:**
1. Make sure you registered first
2. Check username/password are correct
3. If using access code, verify it's correct
4. Check server terminal for errors

**Test auth:**
```bash
# Try registering via API:
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testapi","password":"test123"}'

# Should return token + user
```

---

## 📋 Quick Test Checklist

- [ ] Backend running (port 3001)
- [ ] Frontend running (port 5174)
- [ ] Computer can access http://localhost:5174
- [ ] Phone can access http://[COMPUTER-IP]:5174
- [ ] Register account with access code
- [ ] Complete check-in on computer
- [ ] Sync indicator shows "Just now"
- [ ] Login on phone
- [ ] Phone shows computer's data
- [ ] Complete check-in on phone
- [ ] Refresh computer, see phone's data

---

## 🌟 Advanced: Test Offline Mode

### 1. Complete check-in on computer
### 2. Stop backend server (Ctrl+C in server terminal)
### 3. Complete another check-in on computer
### 4. Notice: Top-right says "☁️ Offline mode"
### 5. Start backend again: `npm run dev`
### 6. Make a small change (toggle something)
### 7. Notice: Syncs all offline changes!

---

## 📊 Expected Sync Times

- **Initial login sync**: ~500ms
- **Check-in save**: <200ms
- **Background sync**: Instant (doesn't block UI)
- **Sync indicator update**: Every 5 seconds

---

## 🎉 Success Criteria

### You know it's working when:

```
Computer:
  ✅ Complete check-in
  ✅ See "🌐 Just now" indicator
  ✅ No console errors

Phone:
  ✅ Login with access code
  ✅ See computer's check-in
  ✅ Complete own check-in
  ✅ See "🌐 Just now" indicator

Computer (refresh):
  ✅ See phone's check-in
  ✅ Total days updated
  ✅ Streak updated
```

---

## 💡 Pro Tips

1. **Use Access Code**: Much easier than remembering username/password
2. **Check Sync Indicator**: Always look at top-right after changes
3. **Refresh to Force Sync**: On other device, refresh to see latest
4. **Watch Console**: F12 → Console tab shows any issues
5. **Monitor Server**: Terminal shows all API requests

---

## 🚀 Try These Scenarios

1. **Complete 7 days**: See cycle completion sync
2. **Change settings**: Verify settings sync across devices
3. **Logout/Login**: Verify data persists
4. **Use 3 devices**: Computer + phone + tablet
5. **Test offline**: Complete checkin offline, sync when back

---

**You now have a fully functional multi-device Islamic accountability system!** 🎉

Test it thoroughly, and when ready, deploy to production using **DEPLOYMENT.md**.
