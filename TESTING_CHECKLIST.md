# Testing Checklist

Use this checklist to verify all functionality works correctly before deploying to production.

## Pre-Test Setup

- [ ] Backend server running on `http://localhost:3001`
- [ ] Frontend running on `http://localhost:5174`
- [ ] Database file created (`server/mizan.db`)
- [ ] `.env` file configured with JWT_SECRET

## Authentication Tests

### Registration

- [ ] **Valid registration**
  - Enter username: `testuser1`
  - Enter password: `password123`
  - Optional access code: `test-code-001`
  - Should: Create account, redirect to /checkin

- [ ] **Duplicate username**
  - Try registering `testuser1` again
  - Should: Show error "Username already exists"

- [ ] **Duplicate access code**
  - Register with different username but same access code
  - Should: Show error "Access code already in use"

- [ ] **Short password**
  - Enter password less than 6 characters
  - Should: Show error "Password must be at least 6 characters"

- [ ] **Missing fields**
  - Leave username empty
  - Should: Show error "Username required"
  - Leave password empty
  - Should: Show error "Password required"

### Login (Username + Password)

- [ ] **Valid login**
  - Enter correct username + password
  - Should: Login successfully, redirect to /checkin

- [ ] **Invalid credentials**
  - Enter wrong password
  - Should: Show error "Invalid credentials"

- [ ] **Non-existent user**
  - Enter username that doesn't exist
  - Should: Show error "Invalid credentials"

### Login (Access Code)

- [ ] **Valid access code**
  - Enter registered access code only
  - Should: Login successfully, redirect to /checkin

- [ ] **Invalid access code**
  - Enter non-existent code
  - Should: Show error "Invalid access code"

### Auto-Redirect

- [ ] **Already logged in**
  - Login successfully
  - Navigate back to `/access`
  - Should: Auto-redirect to `/checkin`

### Token Persistence

- [ ] **Page refresh**
  - Login successfully
  - Refresh page
  - Should: Stay logged in

- [ ] **New tab**
  - Login in one tab
  - Open new tab
  - Should: Auto-login (token shared)

## Data Sync Tests

### Initial Sync on Login

- [ ] **Sync existing data**
  1. Login on Device A
  2. Complete a check-in
  3. Logout
  4. Login on Device B (or different browser)
  5. Should: See check-in from Device A

### Check-in Sync

- [ ] **Single checkin sync**
  1. Complete daily check-in
  2. Check sync status indicator (should say "Just now")
  3. Check browser console (no errors)
  4. Should: Data saved to server

- [ ] **Multi-device checkin**
  1. Complete check-in on Device A
  2. Open Device B
  3. Should: See updated check-in after refresh

### Cycle Sync

- [ ] **Cycle completion sync**
  1. Complete 7 days (full cycle)
  2. Check sync status
  3. Login on another device
  4. Should: See completed cycle

### Settings Sync

- [ ] **Settings update sync**
  1. Change settings
  2. Login on another device
  3. Should: See updated settings

### Offline Mode

- [ ] **Work offline**
  1. Stop backend server
  2. Complete check-in on frontend
  3. Should: Show "Offline mode" indicator
  4. Should: Save to localStorage
  5. Restart backend
  6. Make another change
  7. Should: Sync both changes

## UI/UX Tests

### Sync Status Indicator

- [ ] **Shows correct status**
  - When logged in: Shows last sync time
  - When offline: Shows "Offline mode"
  - After sync: Updates to "Just now"

- [ ] **Updates automatically**
  - Make a change
  - Watch indicator update
  - Should: Change from old time to "Just now"

### Loading States

- [ ] **Login loading**
  - Click login
  - Should: Show "Processing..." on button
  - Should: Disable button during request

- [ ] **Registration loading**
  - Click create account
  - Should: Show loading state

### Error Display

- [ ] **Auth errors visible**
  - Trigger any auth error
  - Should: Display in red box above form

- [ ] **Error clears**
  - Fix error (enter correct info)
  - Submit again
  - Should: Clear previous error

## Settings Page Tests

### Account Section

- [ ] **Shows username**
  - Login as user
  - Go to Settings
  - Should: Display "Logged in as [username]"

- [ ] **Logout button**
  - Click logout
  - Should: Clear token
  - Should: Redirect to /access

### Data Reset

- [ ] **Reset confirmation**
  - Click "Reset everything"
  - Should: Show confirmation message
  - Should: Ask to confirm again

- [ ] **Reset executes**
  - Confirm reset
  - Should: Clear all data
  - Should: Keep user logged in
  - Should: Redirect to landing

## Multi-Device Scenario

### Complete Flow Test

- [ ] **Full multi-device workflow**
  1. **Device A (Computer):**
     - Register account with access code
     - Complete check-in for today
     - Note rank: should be "Muntabih"

  2. **Device B (Phone/Different Browser):**
     - Go to /access
     - Login with access code
     - Should see: Check-in from Device A
     - Should see: Rank "Muntabih"

  3. **Device B:**
     - Complete check-in for different day
     - Logout

  4. **Device A:**
     - Refresh page
     - Should see: Check-in from Device B

### Conflict Resolution

- [ ] **Same-day edits**
  1. Device A: Complete check-in for Monday
  2. Device B: Open app (syncs Monday's data)
  3. Device B: Edit Monday's check-in
  4. Device A: Refresh
  5. Should: See Device B's edits (last write wins)

## API Endpoint Tests

### Health Check

- [ ] **GET /health**
  ```bash
  curl http://localhost:3001/health
  ```
  - Should return: `{ "status": "ok" }`

### Auth Endpoints

- [ ] **POST /api/auth/register**
  ```bash
  curl -X POST http://localhost:3001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"apitest","password":"test123","accessCode":"api-code-001"}'
  ```
  - Should return: `{ "token": "...", "user": {...} }`

- [ ] **POST /api/auth/login**
  ```bash
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"apitest","password":"test123"}'
  ```
  - Should return: `{ "token": "...", "user": {...} }`

- [ ] **POST /api/auth/login-code**
  ```bash
  curl -X POST http://localhost:3001/api/auth/login-code \
    -H "Content-Type: application/json" \
    -d '{"accessCode":"api-code-001"}'
  ```
  - Should return: `{ "token": "...", "user": {...} }`

### Data Endpoints

- [ ] **GET /api/data/sync (authenticated)**
  ```bash
  curl http://localhost:3001/api/data/sync \
    -H "Authorization: Bearer YOUR_JWT_TOKEN"
  ```
  - Should return: `{ "checkins": [...], "cycles": [...], "settings": {...} }`

- [ ] **GET /api/data/sync (no token)**
  ```bash
  curl http://localhost:3001/api/data/sync
  ```
  - Should return: `{ "error": "No token provided" }` with 401 status

## Security Tests

### JWT Token

- [ ] **Expired token**
  - (Hard to test without waiting 30 days)
  - Could manually create expired token
  - Should: Reject with 401

- [ ] **Invalid token**
  - Send request with garbage token
  - Should: Return error "Invalid token"

- [ ] **No token**
  - Try accessing /api/data/* without token
  - Should: Return "No token provided"

### Password Security

- [ ] **Password not exposed**
  - Check browser localStorage
  - Should: Not find plain password anywhere
  - Should: Only see hashed version in database

- [ ] **Access code not exposed in logs**
  - Check server console output
  - Should: Not log sensitive data

### SQL Injection

- [ ] **Username injection attempt**
  - Try registering with: `' OR '1'='1`
  - Should: Either register normally or reject, not cause error

## Performance Tests

### Response Times

- [ ] **Registration**: < 500ms
- [ ] **Login**: < 200ms
- [ ] **Sync**: < 300ms
- [ ] **Checkin save**: < 200ms

### Concurrent Users

- [ ] **Multiple registrations**
  - Register 5 users simultaneously
  - Should: All succeed with unique IDs

- [ ] **Concurrent logins**
  - Login 5 users at same time
  - Should: All get valid tokens

## Database Tests

### Data Integrity

- [ ] **Foreign keys work**
  - Check database directly
  - All checkins should have valid user_id
  - All cycles should have valid user_id
  - All settings should have valid user_id

- [ ] **Unique constraints**
  - Try inserting duplicate username in database
  - Should: Fail with constraint error

- [ ] **Database file persistence**
  - Restart backend server
  - Login
  - Should: See all previous data

## Edge Cases

### Empty States

- [ ] **No checkins**
  - Fresh account
  - Go to Status page
  - Should: Show 0 days, Ghāfil rank

- [ ] **No cycles**
  - Fresh account
  - Go to Cycle page
  - Should: Show empty or default state

### Boundary Conditions

- [ ] **Long username** (reasonable limit)
  - Try very long username
  - Should: Handle gracefully

- [ ] **Special characters**
  - Username with spaces, symbols
  - Should: Accept or reject cleanly (not crash)

- [ ] **Unicode characters**
  - Username with emojis
  - Should: Handle correctly

### Network Failures

- [ ] **Interrupted request**
  - Start registration
  - Stop backend mid-request
  - Should: Show error, not hang

- [ ] **Retry after failure**
  - Trigger network error
  - Fix issue
  - Try again
  - Should: Work on retry

## Browser Compatibility

- [ ] **Chrome/Edge** (Chromium)
- [ ] **Firefox**
- [ ] **Safari** (if on Mac)
- [ ] **Mobile browsers** (Chrome mobile, Safari mobile)

## Final Checks

- [ ] **No console errors** (check browser DevTools)
- [ ] **No server errors** (check terminal output)
- [ ] **Sync indicator works** consistently
- [ ] **Logout clears everything** properly
- [ ] **Documentation accurate** (README, guides)

## Pre-Production Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to strong random value
- [ ] Update API_URL to production backend
- [ ] Enable HTTPS on both frontend and backend
- [ ] Configure proper CORS origins
- [ ] Test full flow on production URLs
- [ ] Setup database backups
- [ ] Monitor logs for errors
- [ ] Test on actual mobile devices

---

## Test Results Template

```
Test Date: _________________
Tester: ___________________

Authentication:     [ ] Pass  [ ] Fail
Data Sync:          [ ] Pass  [ ] Fail
Multi-Device:       [ ] Pass  [ ] Fail
Offline Mode:       [ ] Pass  [ ] Fail
UI/UX:              [ ] Pass  [ ] Fail
Security:           [ ] Pass  [ ] Fail
Performance:        [ ] Pass  [ ] Fail

Critical Issues Found: _______________________
_____________________________________________
_____________________________________________

Ready for Production: [ ] Yes  [ ] No
```

---

**Note:** This checklist is comprehensive. For initial testing, focus on Authentication, Data Sync, and Multi-Device sections first.
