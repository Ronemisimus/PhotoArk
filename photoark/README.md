# PhotoArk

**PhotoArk** is a self-hosted, intelligent photo backup and management solution designed for privacy, performance, and cost-effectiveness. It provides a native mobile experience for backing up photos, leveraging AI for powerful search capabilities, and ensuring you always have access to your original, full-quality files.

---

## 🏛️ High-Level Architecture

The system is designed to be efficient and scalable by offloading file storage and transfers to a dedicated S3-compatible service. The backend orchestrates operations and manages metadata, while the AI service handles computationally intensive tasks in the background.

```
                  +-------------------------+      +--------------------------+
                  |  Client App (iOS/Android) |      | Local Dev/Test Machine |
                  +-------------------------+      +--------------------------+
                           |     ^                           |         ^
(2. Get Pre-signed URL)    |     | (7. View Thumbnails)      | (E2E Tests) |
                           v     |                           v         |
                  +-------------------------+      +--------------------------+
                  |  Backend API (Node/TS)  |<----->| MinIO (Local S3 Mock)  |
                  +-------------------------+      +--------------------------+
                      |    ^         |
(4. Notify on Upload) |    | (5. AI Task) | (6. DB Operations)
                      v    |         v
           +-----------------+  +----------------------+  +-------------------------+
           | AI Service (Python)|  | PostgreSQL + pgvector |  | S3 Storage (Backblaze)  |
           +-----------------+  +----------------------+  +-------------------------+
                  ^                                              ^          |
                  |                                              |          |
                  +----------------------------------------------+          | (3. Direct Upload)
                               (1. User Action)                             | (8. Download Original)
                                                                            |
                                                              +-------------+-------------+
                                                              |      User's Phone         |
                                                              +---------------------------+
```

---

## ✨ Tech Stack

| Component           | Technology                               | Rationale                                                                                                                                                        |
| ------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Companion App**   | React Native w/ TypeScript               | A placeholder skeleton. Build once for both iOS & Android with a consistent, typed codebase.                                                                     |
| **Backend Server**  | Node.js w/ Fastify & TypeScript          | Blazing fast, low overhead, and type-safe, perfect for a robust and maintainable API.                                                                            |
| **Primary Storage** | Backblaze B2, Wasabi, or MinIO           | Drastically cheaper S3-compatible object storage. The #1 way to keep operational costs low.                                                                      |
| **Database**        | PostgreSQL with `pgvector`               | A rock-solid, all-in-one solution for relational data and efficient vector search, avoiding the need for a separate vector database.                             |
| **AI Service**      | Python with FastAPI                      | A dedicated, high-performance microservice for image processing (Pillow) and AI vector generation (sentence-transformers/CLIP) using the GPU.                  |
| **Deployment**      | Docker & Docker Compose                  | Packages the backend server, database, and test utilities into a consistent, portable unit for a simple `git clone && docker-compose up` workflow.               |
| **Code Quality**    | ESLint, Prettier, Ruff                   | Enforces consistent coding standards and formatting across the entire monorepo for improved readability and maintainability.                                   |

---

## 🚀 Getting Started

Follow these instructions to get the PhotoArk services running on your local machine for development.

### Prerequisites

* **Docker & Docker Compose:** Required to run the main application stack. [Install Docker](https://docs.docker.com/get-docker/).
* **Node.js:** v20.x or later.
* **Python:** v3.10.x.
* **React Native Development Environment**: Required for the mobile app. Follow the [official setup guide](https://reactnative.dev/docs/environment-setup) for your target OS (iOS/Android).

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd photoark
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying the example file.

```bash
cp .env.example .env
```

Review the `.env` file and change `DB_PASSWORD` to a more secure password. The default values are configured to work with the `docker-compose.yml` setup out of the box.

### 3. Run the Main Backend Stack (Docker)

This single command will build the Node.js API container and start the API, PostgreSQL database, and MinIO storage server.

```bash
docker-compose up --build -d
```

* **API Server:** Available at `http://localhost:3000`
* **MinIO API:** Available at `http://localhost:9000`
* **MinIO Console:** Available at `http://localhost:9001` (Use user/pass from your `.env` file to log in)

After starting, you'll need to manually create the bucket specified in `.env` (default: `photos`) via the MinIO console.

### 4. Run the AI Service (Host)

The AI service runs directly on the host to simplify GPU access.

```bash
# Navigate to the AI service directory
cd ai-service

# Create a Python virtual environment
python3.10 -m venv .venv

# Activate the environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

* **AI Service:** Available at `http://localhost:8001`

### 5. Prepare the Frontend App

Install dependencies for the React Native app.

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install
```

You can then run the app on your desired simulator or device.

---

## 🧪 Development & Testing

### Backend (TypeScript / Jest)

```bash
# Navigate to the backend directory
cd backend

# Install dependencies if you haven't already
npm install

# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Lint the code
npm run lint

# Format the code
npm run format
```

### AI Service (Python / Pytest / Ruff)

```bash
# Navigate to the AI service directory and ensure venv is active
cd ai-service
source .venv/bin/activate

# Run all tests
pytest

# Lint and format the code with Ruff
ruff check .
ruff format .
```

### Frontend App (React Native / Jest)

```bash
# Navigate to the app directory
cd app

# Run tests
npm test

# Lint and format the code
npm run lint
```

---

## 🌐 API Endpoints (Initial)

* `GET /health` (Backend API): Returns `{ "status": "ok", ... }`
* `GET /health` (AI Service): Returns `{ "status": "ok", ... }`