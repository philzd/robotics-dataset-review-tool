"""
API route definitions.

Expose endpoints for:
- retrieving merged episode + label data
- retireving session health metrics
- retrieving label metadata
- creating/updating labels
"""
from __future__ import annotations

from fastapi import APIRouter

from app.data_access import(
    get_merged_episodes,
    get_session_health,
    load_labels,
    upsert_label,
)
from app.models import EpisodeLabel

router = APIRouter()

@router.get("/health")
def health_check() -> dict:
    """
    Basic health check endpoint.
    """
    return {"status": "ok"}


@router.get("/episodes")
def get_episodes(
    session_id: str = "demo_session",
    min_length: int = 0,
    unlabeled_only: bool = False,
    needs_review_only: bool = False,
):
    """
    Retrieve merged episode rows with optional filtering.
    """
    return get_merged_episodes(
        session_id=session_id,
        min_length=min_length,
        unlabeled_only=unlabeled_only,
        needs_review_only=needs_review_only,
    )


@router.get("/session-health")
def session_health(session_id: str = "demo_session"):
    """
    Retrieve session-level health metrics.
    """
    return get_session_health(session_id=session_id)


@router.get("/labels")
def get_labels():
    """
    Retrieve all label metadata.
    """
    return load_labels()


@router.post("/labels")
def post_label(label: EpisodeLabel):
    """
    Create or update label metadata for an episode.
    """
    return upsert_label(label.model_dump())
