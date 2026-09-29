# SOPET Momentum Backend (NestJS REST API)

**Product**: SOPET Momentum  
**Master Ecosystem**: THE SOFT PERSONA TOOL — SOPET  
**Organization**: ACoS EduTech and Consultancy  
**Architecture**: NestJS 11 + TypeScript + Prisma ORM + PostgreSQL + Argon2id + Google Gemini 2.5 Flash

---

## 1. System Architecture & Core Philosophy

The SOPET Momentum backend is a production-grade, privacy-conscious execution and developmental progress API built strictly according to the *SOPET Momentum Web Application Development Workflow* and the *SOPET Momentum Manual Pilot Protocol BASIC*.

### Core Principles
1. **Action Over Label**: Never pathologize or clinically label the person; diagnose action boundaries and friction points.
2. **AI Suggests, User Confirms, App Writes**: The AI engine proposes diagnoses and actions; the user retains explicit authority to accept, modify, or reject before anything is committed to the database.
3. **MMA Restores Momentum, Never Completes Parent**: Completing a Minimum Meaningful Action (MMA, 10–15 min) lowers resistance and restores forward movement; it explicitly **does not** mark the parent action as completed.
4. **Guilt-Free Restart Protocol**: Interruptions are natural. Fast recovery without shame is tracked via 5 diagnostic questions and immediate restart action creation.
5. **Zero-Knowledge Privacy Support**: Private goals, barrier explanations, and reflection notes can be client-encrypted. Raw private keys are never stored on the server.

---

## 2. API Endpoints Reference

All routes are prefixed with `/api/v1`. Interactive OpenAPI/Swagger documentation is hosted at `/api/docs`.

### Authentication (`/api/v1/auth`)
- `POST /register`: Register participant account with Argon2id password hashing.
- `POST /login`: Authenticate email/password with brute-force rate tracking.
- `POST /refresh`: Secure refresh token rotation (SHA-256 token hash storage, reuse detection).
- `POST /logout`: Revoke current session and clear HttpOnly cookies.
- `POST /logout-all`: Invalidate all active sessions for current user.
- `GET /me`: Get authenticated user profile, roles, and granular permissions.

### Sessions & Devices (`/api/v1/sessions`)
- `GET /`: List active sessions (IP, user agent, last active time).
- `DELETE /:id`: Revoke specific session.
- `DELETE /`: Revoke all sessions except the current one.

### Goals (`/api/v1/goals`)
- `GET /`: List all goals for the authenticated user.
- `GET /:id`: Get specific goal with milestones, actions, and KPIs (strict ownership check).
- `POST /`: Create new meaningful goal (optional primary designation).
- `PATCH /:id/status`: Update goal status (ACTIVE, PAUSED, COMPLETED) with history tracking.

### Actions & NMAs (`/api/v1/actions`)
- `GET /`: List user actions (filterable by `goalId`).
- `GET /:id`: Get action details, readiness history, and linked barriers.
- `POST /`: Create action (optional designation as Next Meaningful Action).
- `PATCH /:id/status`: Update status (`PENDING`, `READY`, `IN_PROGRESS`, `BLOCKED`, `COMPLETED`).
- `POST /:id/nma`: Designate as current Next Meaningful Action (supersedes previous NMA).

### Action Readiness Assessment (`/api/v1/actions/:id/readiness`)
- `POST /`: 5 diagnostic questions:
  1. Clearly understood?
  2. Knows how to do?
  3. Has resources?
  4. Prerequisites met?
  5. Internal resistance low?
  - Returns provisional verdict (`READY`, `NEEDS_CLARIFICATION`, `CAPABILITY_CONCERN`, etc.).

### Barriers & ACIF Diagnosis (`/api/v1/barriers` & `/api/v1/actions/:id`)
- `GET /barriers/taxonomy`: Retrieve 13-category ACIF taxonomy, definitions, and discriminating questions.
- `GET /barriers`: List diagnosed barriers for authenticated user.
- `POST /actions/:id/block`: Mark action as `BLOCKED` and record user's qualitative friction explanation.
- `POST /actions/:id/barriers/confirm`: Confirm or modify diagnosed category ("AI suggests, User confirms").

### Interventions (`/api/v1/interventions` & `/api/v1/actions/:id/interventions`)
- `GET /interventions`: Get methodology-approved interventions (Clarity, MMA, Resource, Evidence Log, etc.).
- `POST /actions/:id/interventions`: Link intervention to a blocked or resistant action.

### Minimum Meaningful Action (`/api/v1/actions/:id/mma` & `/api/v1/mma/:id`)
- `GET /actions/:id/mma`: List micro-actions linked to parent action.
- `POST /actions/:id/mma`: Create a 10–15 min MMA.
- `PATCH /mma/:id/complete`: Complete MMA. **Crucial rule**: Restores momentum without completing parent action.

### Interruption & Restart Protocol (`/api/v1/goals/:id`)
- `GET /goals/:id/restarts`: View interruption and restart history.
- `POST /goals/:id/restart`: Execute 5-question Restart Protocol:
  1. Is the goal still meaningful?
  2. What changed in circumstances?
  3. Root cause of interruption?
  4. Is the plan realistic?
  5. Restart decision (`RESUME`, `ADJUST`, `REDUCE_ACTION`, `CHANGE_NMA`, `PAUSE_GOAL`).
  - Automatically anchors an immediate Restart Action as the new NMA.

### Weekly Review & Lessons (`/api/v1/reviews` & `/api/v1/lessons`)
- `GET /reviews`: List weekly review reflections.
- `POST /reviews`: Submit 5-question Weekly Review:
  1. Meaningful progress
  2. Actions that mattered
  3. What got in the way
  4. Interventions evaluated
  5. Interruption / restart rhythm
  - Automatically creates Lesson & Adjustment records and anchors the Next NMA.
- `GET /lessons`: Extracted lessons and concrete behavioral adjustments.

### Momentum KPIs (`/api/v1/kpis`)
- `GET /kpis/momentum`: Computes the 6 core momentum metrics:
  1. Action Completion Rate (%)
  2. Momentum Continuity (weeks)
  3. Restart Speed (days)
  4. Barrier Resolution Rate (%)
  5. Goal Milestone Progress (%)
  6. Self-Efficacy Score & Trend

### AI Methodology Engine (`/api/v1/ai`)
- `POST /ai/diagnose-barrier`: Proposes ACIF category + approved intervention via Gemini 2.5 Flash.
- `POST /ai/suggest-mma`: Generates a low-friction 10–15 min micro-step.
- `POST /ai/suggest-restart`: Recommends restart decision and immediate restart action.
- `POST /ai/sharpen-nma`: Converts vague intentions into crisp actions with clear physical boundaries.

### Privacy & Encryption (`/api/v1/privacy`)
- `POST /keys`: Register client-wrapped encryption key metadata.
- `GET /keys/metadata`: Retrieve user's key wrapping parameters for client decryption.

### Administration & Security (`/api/v1/admin` & `/api/v1/health`)
- `GET /admin/metrics`: Anonymous aggregate system metrics (Admins/Owner).
- `GET /admin/audit-logs`: Tamper-evident, sanitized audit logs (Security/Owner).
- `GET /admin/security-events`: Security events and brute-force alerts.
- `GET /health`: Heartbeat, database status, and uptime.

---

## 3. Database Management (Prisma)

### Setup & Migrations
```bash
# Generate Prisma Client
bun run prisma:generate

# Apply migrations
bun run prisma:migrate

# Seed database with roles, ACIF taxonomy, approved interventions, and demo users
bun run prisma:seed

# Inspect database via GUI
bun run prisma:studio
```

### Pre-Seeded Demo Accounts (all password: `SopetPilot2026!`)
1. **Pilot Participant**: `amina@example.com` (Role: `USER`)
2. **Support Specialist**: `support@sopet.local` (Role: `SUPPORT_ADMIN`)
3. **Security Lead**: `security@sopet.local` (Role: `SECURITY_ADMIN`)
4. **System Owner**: `owner@sopet.local` (Role: `SYSTEM_OWNER`)

---

## 4. Running the Backend Server

```bash
# Development mode with hot-reload
bun run start:dev

# Production build and run
bun run build
bun run start:prod
```
The server will start on port 4000 (configurable via `PORT` in `.env`).
OpenAPI Swagger UI will be live at `http://localhost:4000/api/docs`.
