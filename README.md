# Client Risk & Compliance Workbench

Local stack: **Postgres** (Docker) + **FastAPI** backend + **Next.js** frontend.

## Prerequisites

- Docker / Docker Compose
- Python 3.12+ (recommended; project uses a local `.venv`)
- Node.js 20+

## 1. Start the database

From the repo root:

```bash
docker compose up -d
```

Postgres listens on `127.0.0.1:5433`. Check status:

```bash
docker compose ps
docker compose exec database pg_isready -U risk_workbench -d risk_workbench
```

Stop / restart when needed:

```bash
docker compose stop
docker compose start
```

If you see `Connection refused` on port `5433`, the container is usually stopped — run `docker compose up -d` again.

## 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # first time only
```

Run the API (reload for local development):

```bash
./.venv/bin/python -m uvicorn app.main:app --reload --port 8000
```

Optional demo data:

```bash
./.venv/bin/python -m app.seed
```

Health check:

```bash
curl http://127.0.0.1:8000/api/health
```

API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 3. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

App: [http://127.0.0.1:3000](http://127.0.0.1:3000)

## Quick reference

| Service  | Command                                      | URL / port        |
|----------|----------------------------------------------|-------------------|
| Database | `docker compose up -d`                       | `127.0.0.1:5433`  |
| Backend  | `uvicorn app.main:app --reload --port 8000`  | `:8000`           |
| Frontend | `npm run dev`                                | `:3000`           |
