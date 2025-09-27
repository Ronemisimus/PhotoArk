# Photo Storage & AI Analysis System

This project is a multi-service application for storing, managing, and analyzing photos using AI.

## Overview

The system allows users to upload photos, which are then processed by an AI service to generate vector embeddings for searching. The backend is built with Node.js and Fastify, the AI service with Python and FastAPI, and data is stored in PostgreSQL with the pgvector extension.

## Deployment Strategy

The main application is containerized using Docker and managed with Docker Compose.

- **Backend Service:** A Node.js/Fastify API.
- **Database Service:** PostgreSQL with pgvector.
- **Object Storage:** MinIO is used to mock an S3-compatible service for local development and testing.

To run the main services, use:
```bash
docker-compose up --build -d
```

## AI Service Setup

The Python-based AI service is run directly on the host machine to simplify GPU access.

**One-time setup:**
```bash
cd /path/to/your/project/ai-service
python3.10 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**To run the service:**
```bash
source .venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8001
```