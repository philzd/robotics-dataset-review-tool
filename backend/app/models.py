"""
Pydantic data models for API request and response schemas.

These models define the structure of:
- episode rows returned to the frontend
- session-level health metrics
- label update payloads
"""

from __future__ import annotations

from pydantic import BaseModel

class EpisodeLabel(BaseModel):
    """
    Payload for creating or updating an episode label.
    """
    session_id: str
    episode_id: int
    label: str
    review_status: str
    notes: str = ""

class EpisodeRow(BaseModel):
    """
    Combined episode + label metadata returned to the frontend.
    """
    session_id: str
    episode_id: int
    start_frame_idx: int
    end_frame_idx: int
    length: int
    start_t: float
    end_t: float
    label: str | None = None
    review_status: str | None = None
    notes: str | None = None

class SessionHealth(BaseModel):
    """
    Session-level dataset quality metrics.
    """
    session_id: str
    missing_ratio: float
    dt_abs_p95: float
    fragmentation_score: float
    overall_status: str
