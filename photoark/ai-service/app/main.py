from fastapi import FastAPI
from .routes import health

app = FastAPI(title="PhotoArk AI Service")

app.include_router(health.router)

# Placeholder for the main functionality
# @app.post("/generate-embedding")
# async def generate_embedding(data: dict):
#     # This is where the core logic will go.
#     # 1. Download image from S3 URL
#     # 2. Process with Pillow
#     # 3. Generate embedding with CLIP model
#     # 4. Return the vector
#     return {"message": "Endpoint not implemented yet"}
