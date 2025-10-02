from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health", tags=["Monitoring"])
def get_health():
    """
    Health check endpoint to verify the service is running.
    """
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat()
    }
