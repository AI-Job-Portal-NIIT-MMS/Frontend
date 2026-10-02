# 🌐 AI-Powered Job Portal — Production Architecture & Deployment Guide

A modern, production-grade, distributed AI job portal built with **React (Vite)** on the frontend, **7 Spring Boot Microservices** on the backend, **MySQL** persistence, and backend-orchestrated **Groq AI** for intelligent CV document parsing, skill extraction, and candidate matching.

---

## 🏗 System Architecture Overview

```
                      +---------------------------------------+
                      |   React 19 + Vite Frontend (Vercel)   |
                      |  - Context API State Management        |
                      |  - Role-based routing (Seeker/Employer)|
                      |  - Multi-step Onboarding & CV Studio   |
                      |  - Real DB Settings Persistence       |
                      +-------------------+-------------------+
                                          |
                        HTTPS REST APIs   | (Environment URLs)
                                          v
+-----------------------------------------------------------------------------------+
|                           Spring Boot Microservices (Railway)                     |
|                                                                                   |
|  +-------------------------+  +--------------------------+  +-------------------+  |
|  | user-service (5001)     |  | company-service (5002)   |  | job-service (5003)|  |
|  | - Auth (JWT, BCrypt)    |  | - Company Profiles       |  | - Job Postings    |  |
|  | - User & Admin Profiles |  | - Employer Verification  |  | - Categories      |  |
|  | - Settings Persistence  |  +--------------------------+  +-------------------+  |
|  +-------------------------+                                                      |
|                                                                                   |
|  +-------------------------+  +--------------------------+  +-------------------+  |
|  | resume-service (5004)   |  | application-service(5005)|  |interview-svc(5006)|  |
|  | - CV Upload (PDF/DOCX)  |  | - Candidate Applications |  | - Scheduling      |  |
|  | - Document Parsing      |  | - Pipeline Statuses      |  | - Status Trackers |  |
|  | - Groq AI Integration   |  +--------------------------+  +-------------------+  |
|  | - Skill Enrichment      |                                                      |
|  +------------+------------+  +--------------------------+                        |
|               |               | notification-svc (5007)  |                        |
|               | (Groq Cloud)  | - Live Alerts & Feeds    |                        |
|               v               +--------------------------+                        |
|       [ Groq AI API ]                                                             |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          | Spring Data JPA / JDBC
                                          v
                      +---------------------------------------+
                      |          MySQL Database               |
                      |   (Local MySQL / Railway MySQL)       |
                      +---------------------------------------+
```

---

## 💼 Core Microservices Breakdown

| Service | Port | Primary Responsibilities | Health Endpoint |
|---|---|---|---|
| **`job-portal-user-service`** | `5001` | JWT Auth, Role validation (`ROLE_JOB_SEEKER`, `ROLE_EMPLOYER`), BCrypt passwords, profile details, persistent settings & preferences | `/health`, `/` |
| **`job-portal-company-service`** | `5002` | Company registry, employer ownership checks, company profiles | `/health`, `/` |
| **`job-portal-job-service`** | `5003` | Job catalogs, salary filtering, skills tags, category management | `/health`, `/` |
| **`job-portal-resume-service`** | `5004` | Multi-format CV upload (PDF/DOCX/TXT), text extraction (Apache PDFBox/POI), Groq AI analysis, skill enrichment | `/health`, `/` |
| **`job-portal-application-service`** | `5005` | Job application pipeline, resume attachment, status workflow | `/health`, `/` |
| **`job-portal-interview-service`** | `5006` | Interview scheduling, date/time coordination, notes | `/health`, `/` |
| **`job-portal-notification-service`** | `5007` | In-app notification feeds, real-time alert logs | `/health`, `/` |

---

## 🤖 CV Processing & Groq AI Pipeline

1. **Upload & Validation**: 
   - Accepts `.pdf`, `.docx`, and `.txt` files up to 10 MB.
   - Files are validated for non-empty content and allowed MIME types.
   - Storage uses sanitized unique filenames (`UUID_originalName`) stored in `uploads/resumes/`.
2. **Text Extraction**:
   - **PDF**: Parsed securely using Apache PDFBox (`Loader.loadPDF`).
   - **DOCX**: Parsed securely using Apache POI (`XWPFDocument` and `XWPFWordExtractor`).
   - **TXT**: Read directly via UTF-8 character stream.
3. **Groq AI Analysis**:
   - Backend calls the Groq Cloud Chat Completions API (`https://api.groq.com/openai/v1/chat/completions`) using the configured model (`llama-3.3-70b-versatile` or `mixtral-8x7b-32768`).
   - Requests structured JSON containing candidate summary, technical skills, soft skills, experience highlights, and recommended roles.
   - **Fail-safe fallback**: If Groq is unavailable, rate-limited, or if the API key is not configured, the service logs the event, marks status as `PENDING`, extracts candidate skills using rule-based keywords, and prevents system breakdown.
4. **Candidate Review & Confirmation**:
   - Extracted information is presented to the user on the Onboarding Wizard (`/onboarding`).
   - The user reviews, edits, and confirms skills, which are saved to the database via `PUT /api/resumes/{id}/enrich-skills`.

---

## 🔐 Production Security & Role Validation

- **Role Selection**: Public registration strictly permits only `ROLE_JOB_SEEKER` or `ROLE_EMPLOYER`. Registration with `ROLE_ADMIN` from public endpoints is rejected with `400 Bad Request`.
- **Zero Secrets in Frontend**: `GROQ_API_KEY` is exclusively read by `job-portal-resume-service` on the backend. No `VITE_GROQ_API_KEY` exists.
- **Dynamic CORS**: Backends configure CORS via `${FRONTEND_URL:http://localhost:3000}`, allowing seamless origin authorization in staging and production.
- **Password Security**: Passwords are hashed using BCrypt. Password update requires verification of the current password before committing changes.
- **Zero Mock Data**: All views, search queries, profiles, and dashboards display real data from the database or clear empty/loading states.

---

## ⚙️ Environment Configuration

### Frontend (`.env` for Vite / Vercel)
```ini
# Production Microservice URLs (e.g. Railway domains or Localhost for dev)
VITE_AUTH_API_URL=http://localhost:5001
VITE_USER_API_URL=http://localhost:5001
VITE_COMPANY_API_URL=http://localhost:5002
VITE_JOB_API_URL=http://localhost:5003
VITE_RESUME_API_URL=http://localhost:5004
VITE_APPLICATION_API_URL=http://localhost:5005
VITE_INTERVIEW_API_URL=http://localhost:5006
VITE_NOTIFICATION_API_URL=http://localhost:5007
```

### Backend (`ai-job-portal-backend-develop/.env` or Railway Variables)
```ini
# Database Connection (Railway MySQL or Local MySQL)
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/job_portal?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=root

# Hibernate DDL Strategy (Never use create-drop in production)
SPRING_JPA_HIBERNATE_DDL_AUTO=update

# Dynamic Port Binding (Assigned automatically by Railway)
PORT=5001 # (or 5002, 5003, etc.)

# Security & CORS
FRONTEND_URL=https://your-frontend-domain.vercel.app
JWT_SECRET=production_secret_key_minimum_256_bits_for_hmac_sha256_signing

# Groq Cloud AI (Used by job-portal-resume-service)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions

# Inter-Service Communication (Railway Internal Domains)
USER_SERVICE_URL=http://localhost:5001
COMPANY_SERVICE_URL=http://localhost:5002
JOB_SERVICE_URL=http://localhost:5003
RESUME_SERVICE_URL=http://localhost:5004
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Java 21 (JDK 21)**
- **Maven 3.9+**
- **Node.js 18+ & npm**
- **MySQL 8.0+** (or default fallback to H2 embedded database)

### 2. Start Backend Services
From `ai-job-portal-backend-develop/`:
```bash
# Build all microservices
mvn clean package -DskipTests

# Run services individually or via startup script
java -jar services/job-portal-user-service/target/job-portal-user-service-0.0.1-SNAPSHOT.jar
java -jar services/job-portal-company-service/target/job-portal-company-service-0.0.1-SNAPSHOT.jar
java -jar services/job-portal-job-service/target/job-portal-job-service-0.0.1-SNAPSHOT.jar
java -jar services/job-portal-resume-service/target/job-portal-resume-service-0.0.1-SNAPSHOT.jar
java -jar services/job-portal-application-service/target/job-portal-application-service-0.0.1-SNAPSHOT.jar
java -jar services/job-portal-interview-service/target/job-portal-interview-service-0.0.1-SNAPSHOT.jar
java -jar services/job-portal-notification-service/target/job-portal-notification-service-0.0.1-SNAPSHOT.jar
```

### 3. Start Frontend Development Server
From the root directory:
```bash
npm install
npm run dev
```
The frontend is accessible at `http://localhost:3000`.

---

## 🚢 Production Deployment

### Step A: Deploy MySQL on Railway
1. Log in to [Railway](https://railway.app/).
2. Create a new project and add a **MySQL** database service.
3. Note the connection variables provided by Railway (`MYSQLHOST`, `MYSQLPORT`, `MYSQLDATABASE`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQL_URL`).

### Step B: Deploy Backend Services to Railway
Each service in `services/job-portal-*-service` contains a production-ready multi-stage `Dockerfile`.
Deploy each service in order of dependency:
1. `job-portal-user-service`
2. `job-portal-company-service`
3. `job-portal-job-service`
4. `job-portal-resume-service` (Configure `GROQ_API_KEY`)
5. `job-portal-application-service`
6. `job-portal-interview-service`
7. `job-portal-notification-service`

Configure the Railway Environment Variables for each service:
- `SPRING_DATASOURCE_URL`: `${{MySQL.MYSQL_URL}}`
- `SPRING_DATASOURCE_USERNAME`: `${{MySQL.MYSQLUSER}}`
- `SPRING_DATASOURCE_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
- `FRONTEND_URL`: URL of your deployed Vercel application.
- Service URLs (`USER_SERVICE_URL`, etc.): Internal Railway service networking names.

### Step C: Deploy Frontend to Vercel
1. Push the repository to GitHub.
2. In [Vercel](https://vercel.com/), create a new project and select the frontend root.
3. Build Settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables:
   - Set `VITE_AUTH_API_URL`, `VITE_USER_API_URL`, etc., to the respective Railway public HTTPS domains.
5. Deploy. SPA client-side routing is handled automatically via `vercel.json`.

---

## 🧪 Verification & Testing

Run the automated production integration test suite:
```powershell
powershell -ExecutionPolicy Bypass -File .\test_production_integration.ps1
```
This executes:
- ✅ Health checks for all 7 microservices
- ✅ Role-validated registration (`ROLE_JOB_SEEKER`)
- ✅ Database settings persistence across sessions (email alerts, weekly digest, profile details)
- ✅ Password update and re-authentication with new credentials
- ✅ Multipart CV file upload, text extraction, and Groq AI pipeline
- ✅ Profile skills enrichment and confirmation
- ✅ Vercel production build validation (`dist/index.html` and `vercel.json`)
