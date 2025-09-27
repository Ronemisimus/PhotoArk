from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class FilePayload(BaseModel):
    file_path: str

@app.get("/health")
def read_root():
    return {"status": "ai service ready"}

@app.post("/generate-vector")
async def generate_vector(payload: FilePayload):
    """
    Placeholder endpoint to generate a mock vector for a given file path.
    """
    # In a real implementation, this would download the file from the path
    # (e.g., an S3 URL) and generate a real vector embedding using a CLIP model.
    print(f"Received request to generate vector for file: {payload.file_path}")

    # Return a mock vector of the correct dimension (512 for CLIP)
    mock_vector = [0.123] * 512

    return {
        "file_path": payload.file_path,
        "vector": mock_vector,
        "message": "This is a mock vector for development purposes."
    }