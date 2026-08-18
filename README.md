# Ayush Kumar Dubey — Engineering Portfolio & Control Center

> Production-ready, dark-themed AI/ML + Backend Developer Portfolio built with a **React 19 + TypeScript + Tailwind CSS** frontend and a dedicated **FastAPI + SQLAlchemy + SQLite** backend.

---

## 📐 Architecture Overview

```
                          ┌───────────────────────────┐
                          │   Browser / Client (SPA)  │
                          │   React 19 + TypeScript   │
                          │  Electric Cyan Dark Theme │
                          └─────────────┬─────────────┘
                                        │
                         HTTP REST / JSON / Bearer JWT
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │    FastAPI Application    │
                          │    (Layered Architecture) │
                          │  Routers ──► Services     │
                          │        └──► Auth (Bcrypt) │
                          └─────────────┬─────────────┘
                                        │
                             SQLAlchemy 2.0 (WAL)
                                        │
                                        ▼
                          ┌───────────────────────────┐
                          │      SQLite Database      │
                          │   • contact_messages      │
                          │   • admin_users           │
                          └───────────────────────────┘
```

---

## 🚀 Key Features & Engineering Highlights

1. **Electric Cyan Visual Identity**
   - Engineered dark palette (`#070B0F` charcoal, `#00D4FF` electric cyan, `#7C3AED` violet accent).
   - High-performance micro-animations, 3D card tilt with mouse-tracked spotlight, and smooth scroll stacking.

2. **Interactive Developer Console / Terminal**
   - In-browser interactive CLI interface allowing visitors to run commands (`help`, `whoami`, `projects`, `skills`, `experience`, `contact`, `status`, `clear`, `easter`).
   - Connects live to backend telemetry to pull real-time API operational statistics.

3. **Backend-Powered Dispatch Terminal**
   - Real-time contact transmission form validated via Pydantic (`EmailStr`, length bounds, sanitization).
   - Automatically stores sender IP, timestamp, and message payload to SQLite.

4. **Protected Admin Telemetry & Control Panel (`/admin`)**
   - JWT-authenticated administrative dashboard (`/admin`).
   - View aggregated analytics: total dispatches, unread items, read items, and system uptime.
   - Searchable, filterable message manager with single-click read/unread status toggle and permanent deletion.

5. **Live Health & System Status Monitoring**
   - Polling hook pinging `/api/health` every 30 seconds for live database connectivity, uptime, and operational checks.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Design Tokens (Vanilla CSS variables)
- **Animations**: Framer Motion + Lenis Smooth Scroll
- **Typography**: Bebas Neue (Headings), Montserrat (Body), JetBrains Mono (Code/Terminal), Herr Von Muellerhoff (Signature)

### Backend
- **Framework**: FastAPI (Python 3.12) + ASGI Uvicorn
- **ORM & DB**: SQLAlchemy 2.0 + SQLite (WAL Mode enabled)
- **Validation**: Pydantic v2 + `email-validator`
- **Security**: Direct `bcrypt` password hashing + python-jose JWT tokens
- **Testing**: Pytest + Pytest-Asyncio + HTTPX TestClient

---

## 📦 Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── config.py              # Pydantic Settings from .env
│   │   ├── database.py            # SQLite Engine & Session Local
│   │   ├── main.py                # FastAPI app initialization & CORS
│   │   ├── models/                # SQLAlchemy ORM models (contact, admin)
│   │   ├── schemas/               # Pydantic validation schemas
│   │   ├── routers/               # health, contact, auth, admin routers
│   │   ├── services/              # Business logic (ContactService, AuthService)
│   │   └── utils/                 # JWT dependencies, IP extraction
│   ├── tests/                     # 26 automated unit & integration tests
│   ├── requirements.txt           # Python dependencies
│   ├── .env.example               # Environment variables template
│   └── .env                       # Local environment configuration
├── src/
│   ├── admin/                     # Admin Dashboard & Login components
│   │   ├── AdminApp.tsx           # Admin router & session container
│   │   ├── AdminLogin.tsx         # Secure admin login form
│   │   ├── Dashboard.tsx          # Overview metrics & recent dispatches
│   │   ├── MessagesPanel.tsx      # Full message logger & CRUD controls
│   │   └── components/            # Sidebar, StatCard
│   ├── components/                # Portfolio sections
│   │   ├── HeroSection.tsx        # Hero with status indicator & video
│   │   ├── AboutSection.tsx       # 3D interactive tilt portrait & bio
│   │   ├── ProjectsSection.tsx    # Filterable project architecture cards
│   │   ├── SkillsSection.tsx      # Categorized skills matrix
│   │   ├── ExperienceSection.tsx  # Expandable timeline
│   │   ├── TerminalSection.tsx    # Interactive terminal CLI
│   │   └── ContactSection.tsx     # Live API dispatch form
│   ├── hooks/                     # Custom hooks (useSystemStatus)
│   ├── services/                  # Centralized API client (api.ts)
│   ├── App.tsx                    # Root component with SPA routing
│   └── index.css                  # Global design system & theme variables
└── README.md
```

---

## ⚡ Getting Started

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template (or customize credentials)
cp .env.example .env

# Run FastAPI development server
uvicorn app.main:app --reload --port 8000
```

The API will now be running at `http://localhost:8000`.

---

### 2. Frontend Setup

```bash
# From repository root
npm install

# Start Vite development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔒 Admin Access

To access the administrator control panel:
1. Navigate to `http://localhost:5173/admin`
2. Default credentials (bootstrapped automatically on first backend launch):
   - **Username**: `admin`
   - **Password**: `adminpassword123` *(configurable in `backend/.env`)*

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System status, version, uptime, and DB health |
| `POST` | `/api/contact` | Public | Submit message payload to database |
| `POST` | `/admin/login` | Public | Authenticate administrator & issue JWT |
| `GET` | `/api/admin/stats` | Protected (JWT) | Aggregate dashboard metrics |
| `GET` | `/api/admin/messages` | Protected (JWT) | List all received contact messages |
| `GET` | `/api/admin/messages/{id}` | Protected (JWT) | Get details for single message |
| `PATCH` | `/api/admin/messages/{id}` | Protected (JWT) | Mark message as read/unread |
| `DELETE` | `/api/admin/messages/{id}` | Protected (JWT) | Permanently delete message |

---

## 🧪 Testing

### Running Backend Pytest Suite

```bash
cd backend
venv\Scripts\pytest tests/ -v
```

**Test Suite Coverage (26 / 26 Passed)**:
- ✅ Health status and system uptime validation
- ✅ Pydantic schema constraints (blank names, email formatting, minimum message length)
- ✅ Admin authentication (valid login, invalid username/password, token generation)
- ✅ Protected endpoint access control (unauthorized requests return 401/403)
- ✅ Contact message lifecycle (create, list, mark read, delete)

---

## 🚢 Production Build

```bash
npm run build
```

Generates optimized, bundled client assets in `dist/`.
