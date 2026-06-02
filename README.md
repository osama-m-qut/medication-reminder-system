# 💊 Medication Reminder System (MediRemind)

A full-stack MERN application that helps patients manage their medications, schedule dose
reminders, and track adherence, with an admin panel for user and system oversight.
Built for **QUT IFQ636 Software Lifecycle Management — Assignment 1**.

> Project #17 — Medication Reminder System. Extends the `nahaQUT/sampleapp_IFQ636` starter.

---

##  Project links

| Resource | Link |
|---|---|
| **Live application (public URL)** | http://`3.27.69.84`:5001 |
| **GitHub repository** | `https://github.com/osama-m-qut/medication-reminder-system` |
| **JIRA board** | https://nomadsps.atlassian.net/jira/software/projects/MRS/boards/ |
| **Figma prototype** | https://www.figma.com/design/eOTBAmuSM5tgCKIcsGb490 (open → Present for the interactive prototype) |
| **Draw.io (SysML) diagrams** | [sysml-diagrams.drawio](docs/sysml-diagrams.drawio) (open at app.diagrams.net) |

##  Demo credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@mediremind.com` | `Admin@123` |
| Patient | `patient@mediremind.com` | `Patient@123` |

(Seeded by `backend/seed.js`. Change these before any real use.)

---

##  Tech stack

- **Frontend:** React 18 (Create React App), React Router 6, Tailwind CSS, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (runs locally on the EC2 instance)
- **Auth:** JWT (Bearer tokens), bcrypt password hashing
- **Tests:** Mocha + Chai + Sinon (backend), React Testing Library + Jest (frontend)
- **CI/CD:** GitHub Actions → SSH deploy to AWS EC2, served via PM2

##  Features

**Patient (user panel)**
- Register / log in (JWT auth)
- Medications — full CRUD
- Reminders — full CRUD (scheduled dose times per medication)
- Dashboard — adherence stats + one-tap "taken/skipped" dose logging
- History — view and delete dose logs

**Admin panel**
- System statistics (users, medications, reminders, overall adherence)
- User management — promote/demote role, delete users

---

##  Local setup

### Prerequisites
- Node.js 20+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

### 1. Clone and install
```bash
git clone https://github.com/osama-m-qut/medication-reminder-system
cd medication-reminder-system
npm run install-all        # installs root, backend and frontend deps
```

### 2. Configure backend environment
```bash
cp backend/.env.example backend/.env
# edit backend/.env: set MONGO_URI, JWT_SECRET, PORT
```

### 3. (Optional) seed demo data
```bash
cd backend && node seed.js
```

### 4. Run in development
```bash
npm run dev                # backend (nodemon) + frontend (CRA) concurrently
# frontend: http://localhost:3000   backend API: http://localhost:5001
```

### 5. Run tests
```bash
cd backend && npm test     # Mocha API tests (no DB required — Mongoose is stubbed)
cd frontend && npm test     # React Testing Library
```

---

## ☁️ Production / EC2 deployment

The app is deployed to an AWS EC2 (Ubuntu) instance. The backend runs under **PM2** and
also serves the built React frontend, so the single public URL shows the UI.

1. Install Node 20, MongoDB, PM2, and git on the instance.
2. Clone the repo to `~/medication-reminder-system`.
3. Create `backend/.env` with `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET`.
4. Build the frontend: `cd frontend && REACT_APP_API_URL=http://3.27.69.84:5001 npm run build`
5. Start: `pm2 start ecosystem.config.js && pm2 save`

After this, **GitHub Actions** (`.github/workflows/ci-cd.yml`) automates redeploys: every
push to `main` runs the tests and, on success, SSHes into EC2, pulls, rebuilds and reloads PM2.

### Required GitHub Actions secrets (Environment: `production`)
| Secret | Description |
|---|---|
| `EC2_HOST` | EC2 public IP / DNS |
| `EC2_USER` | SSH user (e.g. `ubuntu`) |
| `EC2_SSH_KEY` | Private key for SSH access |

---

##  Branching strategy

- `main` — protected, always deployable; deploys on merge.
- `feature/*` — one branch per feature (e.g. `feature/medication-crud`,
  `feature/reminder-scheduling`, `feature/dose-tracking`, `feature/admin-panel`,
  `feature/ci-cd`), merged into `main` via pull requests.

##  Structure
```
medication-reminder-system/
├── backend/            # Express API
│   ├── config/db.js
│   ├── controllers/    # auth, medication, reminder, doseLog, admin
│   ├── middleware/     # protect + admin guards
│   ├── models/         # User, Medication, Reminder, DoseLog
│   ├── routes/
│   ├── test/           # Mocha + Sinon unit tests
│   ├── seed.js
│   └── server.js
├── frontend/           # React app
│   └── src/{pages,components,context}
├── .github/workflows/ci-cd.yml
└── ecosystem.config.js # PM2
```

##  Use of GenAI
GitHub Copilot was used as an assistant during development — for brainstorming requirements,
advice on application structure, guidance on Figma, and generating code snippets/examples.
All AI-assisted output was reviewed, tested, and adapted. See the project report for the full
GenAI disclosure.
