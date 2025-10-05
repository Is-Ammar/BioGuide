# BioGuide

A full‑stack biology research exploration and AI assistance platform. BioGuide lets users:

- Browse and visualize structured biomedical publication data (PMC JSON corpus in `bioc/`).
- Inspect article structure (documents, passages, section types) with hierarchical views.
- View synthesized dashboard metrics (years, journals, section distributions, prolific authors).
- Search & open publication detail pages (title, abstract, full text assembly, related items).
- Authenticate (email/password or Google OAuth) and personalize experience (saved / favorite publications).
- Chat with an upstream AI assistant tailored to user profile/context (protected endpoint).

> This repository currently focuses on local exploration & prototyping; production hardening, security hardening, and scalability enhancements are outlined in the Roadmap.

---
## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Data Layer](#data-layer)
4. [Key Features](#key-features)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Available NPM Scripts](#available-npm-scripts)
8. [API Reference](#api-reference)
9. [Authentication Flow](#authentication-flow)
10. [Frontend Structure](#frontend-structure)
11. [Backend Structure](#backend-structure)
12. [Data Model](#data-model)
13. [Chat Assistant Prompting](#chat-assistant-prompting)
14. [Testing](#testing)
15. [Deployment Notes](#deployment-notes)
16. [Roadmap](#roadmap)
17. [Contributing](#contributing)
18. [License](#license)
19. [Disclaimer](#disclaimer)

---
## Tech Stack
**Backend**
- Node.js + Express 5 (modular routing, REST API)
- MongoDB + Mongoose (user persistence)
- JWT (stateless API authentication)
- Express Session + Passport (Google OAuth 2.0 optional)
- Joi (request validation)
- bcryptjs (password hashing)
- dotenv (config)

**Frontend**
- React 18 + TypeScript (SPA)
- Vite (fast dev + build)
- Tailwind CSS (utility-first styling)
- Framer Motion (micro interactions & transitions)
- D3 / d3-geo / react-simple-maps (data + geographic visualizations)
- three (3D globe / visual effects)
- react-markdown + remark-gfm (rich markdown rendering)

**Data / Utilities**
- Local PMC-derived JSON documents in `bioc/`
- On-demand and cached data transformation (dashboard, inspector, publication indices)
- File watching for hot data reload

---
## Architecture Overview
```
┌──────────────┐        Auth / Data / Chat         ┌────────────────────────┐
│   Frontend   │  ───────────────────────────────▶ │  Express API (backend) │
│ (React/Vite) │ ◀────────── JSON Responses ────── │  Auth + Data Service   │
└─────┬────────┘                                    └───────┬────────────────┘
      │                                                     │
      │                                                     │ Data Loading / Caches
      │                                                     ▼
      │                                              ┌───────────────┐
      │                                              │  Data Service │ ⇒ Aggregations (dashboard)
      │                                              └──────┬────────┘
      │                                                     │
      │                                       Parses BioC-like JSON corpus
      │                                                     │
      │                                                     ▼
      │                                              ./bioc/*.json
      │
      │   Secure Chat (JWT)         Google OAuth (optional)
      └──────────────────────────── Passport / JWT Layer
```

---
## Data Layer
`backend/utils/dataService.js`:
- Discovers data directory (`BIOGUIDE_DATA_DIR` or fallbacks: `../bioc`, `./bioc`).
- Loads all `*.json` files into memory (intended for moderate local corpora; not yet streaming/paginated).
- Builds derived caches:
  - Dashboard metrics (section types, years, journals, top authors).
  - Inspector hierarchy (documents → passages + offsets/section types).
  - Flattened publications array with enriched fields (title, abstract, body-as-fullText, related by journal+year).
- Watches for filesystem changes and hot‑reloads with a debounce.

Performance considerations: for much larger corpora, transition to incremental indexing, search backend, or dedicated document store.

---
## Key Features
- Email/password signup & login (JWT).
- Google OAuth 2.0 (if client ID/secret provided) with seamless linking to existing accounts.
- Persisted user preferences: saved & favorite publications.
- Rich publication detail page (abstract + assembled full text + related links).
- Interactive dashboard visualizations (years, authors, section types, journals).
- Inspector for structural passage-level introspection.
- AI chat assistant (protected) with contextual personalization derived from user profile.
- Resilient data loading (environment override + path fallbacks + reload interval + file watching).

---
## Getting Started
### Prerequisites
- Node.js (LTS recommended)
- npm (comes with Node)
- A running MongoDB instance (local Docker or Atlas)
- (Optional) Google OAuth credentials for enabling social login

### Clone & Install
```sh
git clone https://github.com/Is-Ammar/BioGuide.git
cd BioGuide
# Install backend deps
cd backend && npm install
# Install frontend deps
cd ../frontend && npm install
```

### Environment Files
Create `backend/.env` (see [Environment Variables](#environment-variables)) and optionally `frontend/.env`.

### Run Development Servers (in two terminals)
```sh
# Backend (from repo root)
cd backend && npm start

# Frontend
cd frontend && npm run dev
```
Frontend will default to `http://localhost:5173` and talk to API at `http://localhost:3000/api` (adjust via `VITE_API_URL`).

---
## Environment Variables
### Backend (`backend/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| PORT | No (default 3000) | Express server port |
| MONGO_URL | Yes | MongoDB connection string |
| TOKEN_SECRET | Yes | JWT signing secret (for API auth) |
| SESSION_SECRET | Yes (if Google OAuth) | Session secret for Passport session serialization |
| GOOGLE_CLIENT_ID | Optional | Enable Google OAuth if both ID & secret present |
| GOOGLE_CLIENT_SECRET | Optional | As above |
| BIOGUIDE_DATA_DIR | Optional | Absolute/relative path to `*.json` corpus directory |

### Frontend (`frontend/.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| VITE_API_URL | Recommended | e.g. `http://localhost:3000/api` |

Security Tips:
- Never commit secrets.
- Use strong random values for TOKEN_SECRET & SESSION_SECRET.
- Rotate secrets if exposed.

---
## Available NPM Scripts
### Backend
| Script | Command | Purpose |
|--------|---------|---------|
| start | nodemon server.js | Dev server with reload |

### Frontend
| Script | Command | Purpose |
|--------|---------|---------|
| dev | vite | Start dev server |
| build | vite build | Production build |
| preview | vite preview | Preview prod build |
| lint | eslint . | Lint source code |
| test | jest | Run unit / component tests |
| test:coverage | jest --coverage | Coverage report |

---
## API Reference
Base URL: `http://localhost:<PORT>/api`

### Auth Routes (`/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /signup | No | Create account (email/password) |
| POST | /signin | No | Login, returns JWT |
| POST | /logout | Yes (token) | Invalidate client-side (stateless) |
| GET | /me | Yes | Current user profile (sans password) |
| GET | /fetch | Yes | (Deprecated) Same as /me (legacy) |
| POST | /toggle-saved | Yes | Add/remove publication ID from saved list |
| POST | /toggle-favorite | Yes | Add/remove publication ID from favorites |
| GET | /user-publications | Yes | Lists saved & favorite publication IDs |
| GET | /google | No | Initiate Google OAuth |
| GET | /google/callback | No | OAuth callback |
| GET | /google/success | No | Post-success redirection handler |

#### Auth Example: Sign Up
Request:
```http
POST /api/auth/signup
Content-Type: application/json

{
  "first_name": "Ada",
  "last_name": "Lovelace",
  "email": "ada@example.com",
  "password": "Secret123!",
  "age": 28,
  "profession": "researcher"
}
```
Response (201):
```json
{
  "success": true,
  "message": "Your account has been created successfully",
  "result": { "_id": "...", "first_name": "Ada", "email": "ada@example.com", ... }
}
```

#### Auth Example: Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{ "email": "ada@example.com", "password": "Secret123!" }
```
Response:
```json
{ "success": true, "message": "Login successful", "token": "<JWT>", "user": { "_id": "...", "email": "ada@example.com" } }
```
Include token in subsequent requests:
```
Authorization: Bearer <JWT>
```

### Chat Endpoint
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /chat | Yes | Forwards question + conversational context to upstream AI service |
Body:
```json
{ "question": "<system+history+delimiter+latest>" }
```
Returns upstream shaped JSON (expects `answer` field; fallback to message/raw).

### Data Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /data | No | Raw loaded JSON corpus keyed by filename |
| GET | /dashboard | No | Aggregated metrics per source file |
| GET | /inspector | No | Inspector dataset (documents + hierarchy metadata) |
| GET | /inspector/:id | No | Single document record by ID |
| GET | /publications | No | `{ publications: [...] }` flattened publication list |
| GET | /publications/:pubId | No | Single publication with `fullText` & related |

### Error Format
Most errors follow:
```json
{ "error": "<message>" }
```
Auth errors may use:
```json
{ "success": false, "message": "Invalid or expired token" }
```

---
## Authentication Flow
1. User signs in ⇒ backend returns JWT.
2. Frontend stores token (e.g., `localStorage`).
3. Authenticated requests add `Authorization: Bearer <token>`.
4. Protected routes (e.g. chat, user publication mutations) validated by `requireAuth` middleware.
5. Optional Google OAuth path uses session cookies internally (Passport) then can issue or associate data (current implementation stores user and uses session for OAuth completion; JWT use remains primary for API).

Security Notes:
- Passwords hashed with bcrypt. Never logged or returned.
- Tokens expire in 1 day; adjust as needed.
- Consider refresh token pattern for production.

---
## Frontend Structure
```
frontend/src
├── App.tsx (route + provider wiring)
├── components/ (UI widgets: ChatPanel, Navigation, etc.)
├── lib/
│   ├── api.ts (API layer)
│   ├── auth (context/provider - not shown above)
│   └── theme (theme provider)
├── pages/ (Lazy‑loaded route pages: Landing, Dashboard, PublicationDetail, Profile, etc.)
├── data/ (static assets: countries, publications stub)
├── styles/ (Tailwind / global styles)
└── tests/ (Jest + @testing-library tests)
```

Routing uses `react-router-dom` with suspense/lazy boundaries for code splitting. Chat UI keeps local persisted history with `localStorage`.

---
## Backend Structure
```
backend/
├── server.js (Express bootstrap + routes + OAuth + data endpoints)
├── routes/
│   └── authRouter.js
├── controllers/
│   ├── authController.js
│   └── googleAuthController.js
├── middlewares/
│   ├── auth.js (JWT guard)
│   └── validator.js (Joi schemas)
├── models/
│   └── userModel.js
├── utils/
│   ├── dataService.js (data loading + caches)
│   └── hashing.js (bcrypt wrappers)
└── .env (not committed)
```

---
## Data Model
### User (`users` collection)
| Field | Type | Notes |
|-------|------|-------|
| first_name | String | Required |
| last_name | String | Required |
| email | String | Unique, required |
| password | String | Hashed; optional if Google account |
| age | Number | Optional |
| profession | Enum | `student|researcher|scientist|other` |
| googleId | String | Set if linked with Google OAuth |
| savedPublications | [String] | Publication IDs (PMC IDs) |
| favoritePublications | [String] | Publication IDs |
| createdAt | Date | Auto timestamp |

### Publication (Derived / In-Memory)
| Field | Description |
|-------|-------------|
| id | PMC or fallback ID |
| title | First TITLE passage text |
| abstract | First ABSTRACT passage text |
| fullText | Concatenated non-title/abstract passages |
| authors | Extracted from passage infons name_* fields |
| year | Derived from infons |
| journal | Journal title if present |
| related | IDs sharing same journal+year |

---
## Chat Assistant Prompting
Frontend builds a structured composite string:
```
SYSTEM: You are BioGuide ... personalization line
USER / ASSISTANT: prior turns ...
<|BIOGUIDE_DIALOG_DELIM|>
<latest user question>
```
Rationale:
- Keeps upstream model stateless per request.
- Allows delimiting conversation history from latest user intent.
- Personalization adapts tone & depth to stored profile fields.

---
## Testing
Current coverage focuses on the frontend (Jest + jsdom + React Testing Library).
Run:
```sh
cd frontend
npm test
```
Generate coverage:
```sh
npm run test:coverage
```
Backend tests are not yet implemented. Suggested additions:
- Supertest integration suite for auth & data endpoints.
- DataService unit tests with synthetic small corpora.
- Contract tests verifying publication extraction invariants.

---
## Deployment Notes
- Serve frontend build (e.g., Netlify, Vercel, static hosting) pointed at deployed API base URL.
- Harden CORS: restrict to production origin(s).
- Move `UPSTREAM_CHAT_URL` to environment variable (currently hardcoded in `server.js`).
- Add rate limiting (e.g., express-rate-limit) for auth & chat endpoints.
- Add HTTPS termination / proxy (NGINX, CloudFront, etc.).
- Consider switching sessions to a store (Redis) if scaling OAuth sessions horizontally.

---
## Roadmap
| Area | Planned Enhancements |
|------|----------------------|
| Search | Full‑text / semantic search across publications (e.g., Elastic / Meili) |
| Chat | Streaming responses, citation highlighting, safety filters |
| Data | Incremental indexing, pagination, external data sources (PubMed API sync) |
| Auth | Email verification, password reset, refresh tokens |
| UX | Advanced filters, bookmarking UI, offline caching |
| Quality | Backend test suite, load testing, performance profiling |
| Security | Rate limiting, audit logging, dependency scanning CI |
| Observability | Structured logging, request tracing, metrics dashboard |

---
## Contributing
Contributions welcome! Suggested workflow:
1. Fork & branch (`feat/<name>`).
2. Keep changes focused & documented.
3. Run lint & tests (`npm run lint`, `npm test`).
4. Submit PR with clear description & screenshots (if UI).

Open to issues for: bug reports, feature ideas, performance notes.

---
## Disclaimer
- Included publication JSON files are for development & demonstration. Verify licensing / redistribution terms before public deployment.
- Not a medical device; no clinical guarantees. Always consult original sources.
- AI responses may contain inaccuracies; cross‑verify critical scientific claims.

---
## Quick Reference
| Action | Command |
|--------|---------|
| Start backend | `cd backend && npm start` |
| Start frontend | `cd frontend && npm run dev` |
| Run frontend tests | `cd frontend && npm test` |
| Build frontend | `cd frontend && npm run build` |

---
**Happy exploring!** If you have questions or want to extend BioGuide, feel free to open an issue.
