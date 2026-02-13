# Online Chat Application

A full-stack real-time messenger with Group Chat support.

## Stack
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, Redis
- **Frontend**: React (Vite), TailwindCSS

## Local Development (No Docker)

### Prerequisites
- **PostgreSQL**: Running locally on port 5432.
- **Redis**: Running locally on port 6379.
- **Node.js**: v18+ installed.
- **Python**: v3.10+ installed.

### 1. Backend Setup
1.  **Create Virtual Environment** :
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```
2.  **Configure Environment**:
    - Ensure `.env` exists in root with correct DB credentials.
    - Default assumes `postgres:postgres` on localhost.
3.  **Run Backend**:
    ```bash
    uvicorn app.main:app --reload
    ```
    - API will run at `http://localhost:8000`.
    - Database tables will be created automatically on first run.

### 2. Frontend Setup
1.  **Install Dependencies**:
    ```bash
    cd frontend
    npm install
    ```
2.  **Run Frontend**:
    ```bash
    npm run dev
    ```
    - App will run at `http://localhost:3000`.

## Docker Setup (Optional)
If you prefer Docker, you can run everything with:
```bash
docker-compose up -d --build
```
This starts Backend, Frontend, Postgres, and Redis automatically.
