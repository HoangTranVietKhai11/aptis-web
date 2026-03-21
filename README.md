# APTIS B2 Preparation Platform

Personal English exam preparation platform for APTIS ESOL B2.

## Quick Start

```bash
docker compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Features

- **Practice** — Grammar, Reading, Listening, Writing & Speaking exercises
- **Mock Exam** — Full APTIS B2 exam simulation with timer
- **Vocabulary** — Word library + personal notebook
- **Progress** — Charts, accuracy tracking & 27-session B2 roadmap

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + TailwindCSS |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| Charts | Chart.js |
| Audio | Native MediaRecorder API |
| Container | Docker + Docker Compose |

## Project Structure

```
aptis/
├── frontend/          # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
├── backend/           # Express API
│   ├── routes/
│   ├── database/
│   └── server.js
├── docker-compose.yml
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/practice?skill=grammar | Get practice questions |
| POST | /api/practice/answer | Submit answer |
| POST | /api/mocktest | Create mock test |
| GET | /api/mocktest/:id | Get mock test |
| GET | /api/vocabulary | List vocabulary |
| POST | /api/vocabulary | Add word |
| GET | /api/progress | Get stats |
| GET | /api/progress/roadmap | Get learning roadmap |
