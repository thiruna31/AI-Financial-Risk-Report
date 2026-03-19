from fastapi import FastAPI
from app.api.routes import router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="AI Financial Risk API",
    version="1.0.0",
    description="API for detecting financial anomalies and risk scoring"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(router, prefix="")


@app.get("/", tags=["Health"])
def home():
    return {
        "status": "success",
        "message": "AI Financial Risk API is running 🚀",
        "docs_url": "http://127.0.0.1:8000/docs"
    }