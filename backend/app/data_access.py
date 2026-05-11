"""
Data access layer for the dataset review tool.

Responsible for:
- loading episode data
- loading session health metrics
- loading and persisting labels
- merging episode + label metadata
- applying simple filtering logic

This layer mirrors the logic used in CLI inspection and labeling tools,
but adapts it for API usage.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, TypedDict

class LabelRow(TypedDict):
    session_id: str
    episode_id: int
    label: str
    review_status: str
    notes: str

# Resolve base directories.
BASE_DIR = Path(__file__).resolve().parent.parent
SAMPLE_DATA_DIR = BASE_DIR / "sample_data"

# Input data paths.
EPISODES_PATH = SAMPLE_DATA_DIR / "episodes.json"
EPISODE_HEALTH_PATH = SAMPLE_DATA_DIR / "episode_health.json"
ALIGNMENT_HEALTH_PATH = SAMPLE_DATA_DIR / "alignment_health.json"

# Label storage.
LABELS_PATH = SAMPLE_DATA_DIR / "episodes_label.json"

def load_json(path: Path) -> Any:
    """
    Load a JSON file from disk.
    """
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)
    

def load_episodes(session_id: str) -> list[dict]:
    """
    Load episode rows for a given session.

    Returns:
        List of episode dictionaries.
    """
    data = load_json(EPISODES_PATH)
    episodes = data.get("episodes", [])

    rows = []
    for ep in episodes:
        rows.append({
            "session_id": session_id,
            "episode_id": ep["episode_id"],
            "start_frame_idx": ep["start_frame_idx"],
            "end_frame_idx": ep["end_frame_idx"],
            "length": ep["length"],
            "start_t": ep["start_t"],
            "end_t": ep["end_t"]
        })
    
    return rows


def load_labels() -> list[dict[str, Any]]:
    """
    Load episode-level label metadata.

    Returns empty list if no labels exist.
    """
    if not LABELS_PATH.exists():
        return []
    
    return load_json(LABELS_PATH)


def save_labels(labels: list[dict[str, Any]]) -> None:
    """
    Persist label metadata to disk.
    """
    with open(LABELS_PATH, "w", encoding="utf-8") as f:
        json.dump(labels, f, indent=2)
        f.write("\n")

def build_label_index(labels: list[LabelRow]) -> dict[tuple[str, int], LabelRow]:
    """
    Build lookup index for labels keyed by (session_id, episode_id).
    """
    return {
        (row["session_id"], int(row["episode_id"])): row
        for row in labels
    }


def get_merged_episodes(
    session_id: str,
    min_length: int = 0,
    unlabeled_only: bool = False,
    needs_review_only: bool = False,
) -> list[dict]:
    """
    Merge episode rows with label metadata and apply filters.
    """
    episodes = load_episodes(session_id)
    labels = load_labels()
    label_index = build_label_index(labels)

    merged = []

    for ep in episodes:
        key = (ep["session_id"], int(ep["episode_id"]))
        label_info = label_index.get(key)

        row = {
            **ep,
            "label": label_info["label"] if label_info else None,
            "review_status": label_info["review_status"] if label_info else None,
            "notes": label_info["notes"] if label_info else None,
        }

        # Apply filters.
        if row["length"] < min_length:
            continue

        if unlabeled_only and row["label"] is not None:
            continue

        if needs_review_only and row["review_status"] != "needs_review":
            continue

        merged.append(row)

    return merged


def get_session_health(session_id: str) -> dict:
    """
    Combine alignment and episode health into a single summary object.
    """
    episode_health = load_json(EPISODE_HEALTH_PATH)
    alignment_health = load_json(ALIGNMENT_HEALTH_PATH)

    return {
        "session_id": session_id,
        "missing_ratio": alignment_health["missing_ratio"],
        "dt_abs_p95": alignment_health["dt_abs_p95"],
        "fragmentation_score": episode_health["fragmentation_score"],
        "overall_status": "OK",
    }


def upsert_label(payload: dict[str, Any]) -> dict[str, Any]:
    """
    Insert or update label metadata for a single episode.
    """
    labels = load_labels()

    updated = False

    for row in labels:
        if (
            row["session_id"] == payload["session_id"]
            and int(row["episode_id"]) == int(payload["episode_id"])
        ):
            row["label"] = payload["label"]
            row["review_status"] = payload["review_status"]
            row["notes"] = payload.get("notes", "")
            updated = True
            break

    if not updated:
        labels.append(payload)

    save_labels(labels)

    return payload
