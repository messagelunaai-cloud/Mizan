# Mizan - System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER DEVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   Desktop   │    │   Laptop    │    │   Mobile    │        │
│  │   Browser   │    │   Browser   │    │   Browser   │        │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘        │
│         │                   │                   │                │
│         └───────────────────┴───────────────────┘                │
│                             │                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────▼────────────────────────────────────┐
│                    FRONTEND (React SPA)                           │
│                   http://localhost:5174                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Components                             │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  Landing │ Access │ CheckIn │ Cycle │ Status │ Settings  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────┼────────────────────────────────┐  │
│  │         React Context    │                                │  │
│  │  ┌──────────────────┐   │   ┌────────────────────────┐  │  │
│  │  │   AuthContext    │───┼───│   Token Management     │  │  │
│  │  │  - user state    │   │   │  - localStorage        │  │  │
│  │  │  - login/logout  │   │   │  - JWT validation      │  │  │
│  │  │  - register      │   │   └────────────────────────┘  │  │
│  │  └──────────────────┘   │                                │  │
│  └──────────────────────────┼────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────┼────────────────────────────────┐  │
│  │     Custom Hooks         │                                │  │
│  │  ┌──────────────┐  ┌─────▼──────┐  ┌─────────────────┐  │  │
│  │  │  useCheckin  │  │  useAuth   │  │    useCycle     │  │  │
│  │  └──────────────┘  └────────────┘  └─────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────┼────────────────────────────────┐  │
│  │       Utils              │                                │  │
│  │  ┌──────────────┐   ┌────▼─────┐   ┌─────────────────┐  │  │
│  │  │  storage.ts  │◄──┤  api.ts  │──►│  localStorage   │  │  │
│  │  │ - sync       │   │ - fetch  │   │  (offline)      │  │  │
│  │  │ - checkins   │   │ - auth   │   └─────────────────┘  │  │
│  │  └──────────────┘   └──────────┘                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │ HTTP + JWT
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                BACKEND API (Express)                              │
│               http://localhost:3001                               │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      Middleware                            │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  CORS  │  JSON Parser  │  JWT Auth  │  Rate Limiter      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────┼────────────────────────────────┐  │
│  │         Routes           │                                │  │
│  │  ┌──────────────┐   ┌────▼──────┐   ┌─────────────────┐  │  │
│  │  │ /api/auth    │   │ /api/data │   │   /health       │  │  │
│  │  ├──────────────┤   ├───────────┤   └─────────────────┘  │  │
│  │  │ • register   │   │ • sync    │                        │  │
│  │  │ • login      │   │ • checkins│                        │  │
│  │  │ • login-code │   │ • cycles  │                        │  │
│  │  │              │   │ • settings│                        │  │
│  │  └──────────────┘   └───────────┘                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────┼────────────────────────────────┐  │
│  │       Auth Layer         │                                │  │
│  │  ┌──────────────────────┐│┌─────────────────────────────┐│  │
│  │  │  JWT Generation      │││  Password Hashing (bcrypt)  ││  │
│  │  │  - sign tokens       │││  - 10 salt rounds           ││  │
│  │  │  - verify tokens     │││  - compare hashes           ││  │
│  │  │  - 30 day expiry     │││                             ││  │
│  │  └──────────────────────┘│└─────────────────────────────┘│  │
│  └──────────────────────────┼────────────────────────────────┘  │
│                              │                                   │
│  ┌──────────────────────────▼────────────────────────────────┐  │
│  │              Database Layer (sql.js)                       │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  run()  │  exec()  │  getDB()  │  saveDB()               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               │ File I/O
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                    DATABASE (SQLite)                              │
│                      mizan.db                                     │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                        TABLES                             │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                           │   │
│  │  ┌─────────────────┐    ┌──────────────────┐           │   │
│  │  │     users       │    │    checkins      │           │   │
│  │  ├─────────────────┤    ├──────────────────┤           │   │
│  │  │ • id            │    │ • id             │           │   │
│  │  │ • username      │    │ • user_id  ◄─────┼───┐       │   │
│  │  │ • password_hash │    │ • date           │   │       │   │
│  │  │ • access_code   │    │ • categories     │   │       │   │
│  │  │ • created_at    │    │ • penalties      │   │       │   │
│  │  └─────────────────┘    │ • completed      │   │       │   │
│  │           │              │ • created_at     │   │       │   │
│  │           │              │ • updated_at     │   │       │   │
│  │           │              └──────────────────┘   │       │   │
│  │           │                                     │       │   │
│  │           │              ┌──────────────────┐   │       │   │
│  │           │              │     cycles       │   │       │   │
│  │           │              ├──────────────────┤   │       │   │
│  │           │              │ • id             │   │       │   │
│  │           └──────────────┼─► user_id       │◄──┘       │   │
│  │                          │ • cycle_number   │           │   │
│  │                          │ • days           │           │   │
│  │                          │ • completed      │           │   │
│  │                          │ • created_at     │           │   │
│  │                          │ • updated_at     │           │   │
│  │                          └──────────────────┘           │   │
│  │                                                          │   │
│  │                          ┌──────────────────┐           │   │
│  │                          │    settings      │           │   │
│  │                          ├──────────────────┤           │   │
│  │                          │ • id             │           │   │
│  │           ┌──────────────┼─► user_id       │◄──────────┘   │
│  │           │              │ • settings       │               │
│  │           │              │ • updated_at     │               │
│  │           │              └──────────────────┘               │
│  │           │                                                 │
│  │           └── Foreign Key Relationships                     │
│  │                                                             │
│  └─────────────────────────────────────────────────────────────┘
│                                                                  │
└──────────────────────────────────────────────────────────────────┘


══════════════════════════════════════════════════════════════════
                        DATA FLOW DIAGRAM
══════════════════════════════════════════════════════════════════

REGISTRATION FLOW:
─────────────────
User (Device 1)
    │
    │ 1. Enter username/password/access_code
    ├──► Frontend: POST /api/auth/register
    │        │
    │        ├──► Backend: Validate input
    │        │        │
    │        │        ├──► Hash password (bcrypt)
    │        │        │
    │        │        ├──► Database: INSERT users
    │        │        │
    │        │        ├──► Generate JWT token
    │        │        │
    │        │        └──► Response: { token, user }
    │        │
    │        ├──► Store token in localStorage
    │        │
    │        └──► Redirect to /checkin
    │
    └──► ✅ Logged in!


LOGIN FLOW (Access Code):
─────────────────────────
User (Device 2)
    │
    │ 1. Enter access_code only
    ├──► Frontend: POST /api/auth/login-code
    │        │
    │        ├──► Backend: Find user by access_code
    │        │        │
    │        │        ├──► Generate JWT token
    │        │        │
    │        │        └──► Response: { token, user }
    │        │
    │        ├──► Store token in localStorage
    │        │
    │        ├──► GET /api/data/sync
    │        │        │
    │        │        └──► Fetch all user data
    │        │
    │        ├──► Update localStorage with server data
    │        │
    │        └──► Redirect to /checkin
    │
    └──► ✅ Logged in with synced data!


CHECKIN SYNC FLOW:
──────────────────
User completes daily checkin
    │
    │ 1. Toggle categories, fill durations
    ├──► Frontend: Save to localStorage (immediate)
    │        │
    │        └──► Update UI (instant)
    │
    │ 2. Background sync
    ├──► API: POST /api/data/checkins
    │        │    Headers: { Authorization: "Bearer <jwt>" }
    │        │    Body: { date, categories, penalties, completed }
    │        │
    │        ├──► Backend: Verify JWT
    │        │        │
    │        │        ├──► Extract user_id from token
    │        │        │
    │        │        ├──► Database: INSERT/UPDATE checkins
    │        │        │
    │        │        └──► Response: { success: true }
    │        │
    │        └──► Update sync timestamp
    │
    └──► ✅ Synced to server!


MULTI-DEVICE SCENARIO:
──────────────────────
Device A                          Device B
    │                                 │
    │ Complete checkin                │
    ├──► localStorage                 │
    ├──► POST /api/data/checkins      │
    │        │                        │
    │        └──► Database UPDATE     │
    │                                 │
    │                                 │ Open app
    │                                 ├──► GET /api/data/sync
    │                                 │        │
    │                 Database ◄──────┤        │
    │                    │            │        │
    │                    └──Response──┴───────►│
    │                                 │        │
    │                                 ├──► Update localStorage
    │                                 │
    │                                 └──► ✅ Sees Device A's progress!


OFFLINE MODE:
─────────────
User (no internet)
    │
    │ Complete checkin
    ├──► Frontend: Save to localStorage ✅
    │        │
    │        └──► POST /api/data/checkins ❌ (fails)
    │                │
    │                └──► Continue silently
    │
    │ UI shows "Offline mode"
    │
    │ Internet reconnects
    ├──► Next data change triggers sync
    │        │
    │        └──► POST catches up all changes
    │
    └──► ✅ Back online and synced!


══════════════════════════════════════════════════════════════════
                    SECURITY ARCHITECTURE
══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: HTTPS (Transport)                                     │
│  ───────────────────────────                                    │
│  • Encrypts all traffic                                         │
│  • Prevents man-in-the-middle                                   │
│                                                                  │
│  Layer 2: JWT Authentication                                    │
│  ─────────────────────────────                                  │
│  • Signed tokens (HMAC SHA256)                                  │
│  • 30-day expiration                                            │
│  • Payload: { userId, iat, exp }                                │
│  • Secret: min 32 characters                                    │
│                                                                  │
│  Layer 3: Password Security                                     │
│  ─────────────────────────                                      │
│  • bcrypt hashing (10 rounds)                                   │
│  • Salt per password                                            │
│  • Never stored in plain text                                   │
│                                                                  │
│  Layer 4: API Authorization                                     │
│  ─────────────────────────────                                  │
│  • authMiddleware on all /api/data/* routes                     │
│  • Extracts userId from JWT                                     │
│  • Users can only access their own data                         │
│                                                                  │
│  Layer 5: Input Validation                                      │
│  ────────────────────────                                       │
│  • Username/password length checks                              │
│  • SQL injection prevention (parameterized queries)             │
│  • XSS protection (React escaping)                              │
│                                                                  │
│  Layer 6: CORS Policy                                           │
│  ──────────────────────                                         │
│  • Only allow frontend domain                                   │
│  • Credentials: true for cookies                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘


══════════════════════════════════════════════════════════════════
                    TECH STACK SUMMARY
══════════════════════════════════════════════════════════════════

Frontend:
  • React 18
  • TypeScript (strict)
  • Vite (build tool)
  • Tailwind CSS
  • Framer Motion
  • React Router
  • Lucide Icons

Backend:
  • Node.js
  • Express
  • TypeScript
  • sql.js (SQLite)
  • bcrypt
  • jsonwebtoken
  • cors
  • dotenv

Database:
  • SQLite (via sql.js)
  • 4 tables (users, checkins, cycles, settings)
  • Foreign key constraints
  • Unique constraints on username + access_code

Deployment:
  • Frontend: Vercel/Netlify (static)
  • Backend: Railway/Render (Node.js)
  • Database: File-based (backed up daily)
```
