# 🚀 AI-Powered Job Portal - Frontend

An AI-driven job searching, application tracking, and talent matching web application built with **React 19**, **Vite**, **Tailwind CSS**, **Motion**, and **Context API**.

This repository is architected with a **decoupled REST API service layer** that supports seamless switching between offline hardcoded mock data and a live backend server.

---

## 📌 Table of Contents
- [Features](#-features)
- [Directory Structure](#-directory-structure)
- [Architecture & Data Flow](#-architecture--data-flow)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
- [Backend Integration Guide (For API Developers)](#-backend-integration-guide-for-api-developers)
- [Available Scripts](#-available-scripts)
- [Git & Branching Workflow](#-git--branching-workflow)

---

## ✨ Features

- 💼 **Job Discovery & Filtering**: Search jobs by role, location, job type (Full-Time, Remote, Contract), category, and salary range.
- 🤖 **AI Match System**: Calculates candidate-to-job compatibility scores based on profile skills and requirements.
- 📋 **Application Pipeline**: Dual views for **Job Seekers** (tracking submitted applications) and **Employers/Recruiters** (managing candidates, statuses, and notes).
- 📝 **Interactive Resume Builder**: Drag-and-drop resume builder with live preview and skill tags.
- 📅 **Interview Scheduler**: Track upcoming interview dates, times, and interviewers.
- 🌓 **Dark / Light Theme Toggle**: Dynamic visual styling with customizable themes.
- 🔔 **Toast Notification System**: Real-time feedback for job saves, application submissions, and profile updates.

---

## 📂 Directory Structure

```
ai-power-job-portal/
├── .env.example             # Template for environment variables
├── .env                     # Local environment settings (Ignored in git)
├── index.html               # Main HTML entry point
├── package.json             # Dependencies and build scripts
├── postcss.config.js        # PostCSS configuration for Tailwind CSS
├── tsconfig.json            # TypeScript compiler configuration
├── vite.config.ts           # Vite build and server configuration
│
└── src/
    ├── App.jsx              # Main App router and layout wrapper
    ├── main.jsx             # React DOM root renderer
    ├── index.css            # Base stylesheet
    │
    ├── components/          # Reusable UI Components
    │   ├── CircularGauge.jsx  # AI Match percentage visual gauge
    │   ├── Footer.jsx         # Global footer
    │   ├── JobCard.jsx        # Job card UI component
    │   ├── Sidebar.jsx        # Dynamic navigation sidebar (Job Seeker / Employer modes)
    │   ├── Toast.jsx          # Notification toast container
    │   └── Topbar.jsx         # Search bar, role toggle, theme toggle, and user profile popup
    │
    ├── context/
    │   └── AppContext.jsx     # Global React Context (State, Async Data Fetching, Toasts)
    │
    ├── data/
    │   └── mockData.js        # Fallback datasets (Jobs, Applications, Candidates, Profile)
    │
    ├── pages/               # Application Route Views
    │   ├── LandingPage.jsx    # Public marketing landing page
    │   ├── SignInPage.jsx     # User authentication (Sign In)
    │   ├── SignUpPage.jsx     # User registration (Sign Up)
    │   ├── DashboardPage.jsx  # Main user dashboard overview
    │   ├── JobsPage.jsx       # Job search catalog page
    │   ├── JobDetailPage.jsx # Individual job details page
    │   ├── AIMatchPage.jsx    # AI Job Matching matrix view
    │   ├── ApplicationsPage.jsx # Application status tracker / Recruiter candidate board
    │   ├── InterviewsPage.jsx # Scheduled interviews calendar list
    │   ├── PostJobPage.jsx   # Employer job posting form
    │   ├── ProfilePage.jsx   # Candidate user profile & skill tags manager
    │   ├── SavedJobsPage.jsx # Bookmarked saved jobs list
    │   ├── ResumeBuilderPage.jsx # Interactive resume editor
    │   ├── MessagesPage.jsx  # Candidate-Recruiter message interface
    │   ├── NotificationsPage.jsx # Activity notifications feed
    │   └── SettingsPage.jsx  # Account and application settings
    │
    ├── services/            # REST API Service Layer
    │   ├── apiClient.js     # Base fetch wrapper with auth headers & mock fallback
    │   ├── jobService.js    # Jobs API endpoints
    │   ├── applicationService.js # Applications & Candidates API endpoints
    │   ├── authService.js   # Authentication API endpoints (Login, Register, Logout)
    │   ├── userService.js   # Profile & Skills API endpoints
    │   └── interviewService.js # Interviews API endpoints
    │
    └── styles/              # Vanilla CSS stylesheets per component/page
        ├── ai-match.css
        ├── applications.css
        ├── auth.css
        ├── dashboard.css
        ├── global.css
        ├── interviews.css
        ├── jobs.css
        ├── landing.css
        ├── post-job.css
        ├── profile.css
        ├── sidebar.css
        ├── toast.css
        └── topbar.css
```

---

## ⚡ Architecture & Data Flow

```
[ UI Pages / Components ]
          │
          ▼
    [ AppContext ]  <-- Manages global state (loading, error, role, toasts)
          │
          ▼
   [ Services Layer ] (jobService, authService, applicationService, etc.)
          │
          ▼
    [ apiClient ]
      │         │
      │ (VITE_USE_MOCK_DATA=true)  ---> Returns [ mockData.js ] (With simulated network delay)
      │
      │ (VITE_USE_MOCK_DATA=false) ---> Sends HTTP fetch requests to [ VITE_API_BASE_URL ]
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env` in the root folder:

```bash
cp .env.example .env
```

Environment options:

| Variable | Default Value | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Base URL of your backend REST API server |
| `VITE_USE_MOCK_DATA` | `true` | `true` uses hardcoded fallback data (`mockData.js`). Set to `false` when connecting to a live API backend. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **bun**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AI-Job-Portal-NIIT-MMS/Frontend.git
   cd Frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 📡 Backend Integration Guide (For API Developers)

When connecting your backend server (e.g. Node.js/Express, Spring Boot, FastAPI, Django, Laravel), set `VITE_USE_MOCK_DATA=false` in `.env` and implement the following endpoint contracts:

### 1. Authentication Endpoints
- `POST /api/auth/login`
  - **Body**: `{ "email": "user@example.com", "password": "...", "role": "Job Seeker" }`
  - **Response**: `{ "token": "JWT_TOKEN_HERE", "user": { "name": "...", "email": "...", "role": "..." } }`
- `POST /api/auth/register`
  - **Body**: `{ "fullName": "...", "email": "...", "password": "...", "role": "..." }`
  - **Response**: `{ "token": "JWT_TOKEN_HERE", "user": { ... } }`

### 2. Jobs Endpoints
- `GET /api/jobs` - Return array of all job objects.
- `GET /api/jobs/:id` - Return single job details object.
- `POST /api/jobs` - Create new job post.
- `PATCH /api/jobs/:id/save` - Toggle save status for job.

### 3. Applications & Candidates Endpoints
- `GET /api/applications` - List applications for current user.
- `POST /api/applications` - Submit application (`{ "jobId": "..." }`).
- `GET /api/candidates` - Recruiter view: list candidates.
- `PATCH /api/candidates/:id` - Update candidate status/notes.

### 4. User Profile Endpoints
- `GET /api/user/profile` - Fetch current user profile details.
- `PUT /api/user/profile` - Update profile fields.
- `POST /api/user/skills` - Add skill (`{ "skill": "React" }`).

---

## 🛠️ Available Scripts

In the project root, you can run:

| Command | Action |
|---|---|
| `npm run dev` | Starts Vite local development server (`http://localhost:3000`) |
| `npm run build` | Builds optimized production bundle in `/dist` |
| `npm run preview` | Previews production build locally |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) |

---

## 🌿 Git & Branching Workflow

- **`main`**: Primary development and integration branch.
- **`production`**: Production release branch.

To push updates to both branches:
```bash
git checkout main
git add .
git commit -m "Your feature message"
git push origin main

git checkout production
git merge main
git push origin production
```
