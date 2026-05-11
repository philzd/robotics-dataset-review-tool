"""
FastAPI application entrypoint.

Sets up the API server, configures middleware (CORS),
and registers route handlers for the dataset review tool.

This service exposes endpoints for:
- retrieving episode-level data
- retrieving session health metrics
- retrieving and updating labeling metadata
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application instance.
    """
    app = FastAPI(title="Robotics Dataset Review Tool")

    # Allow all origins for simplicity (internal demo tool).
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(router)

    return app

app = create_app()
