/**
 * Types
 *
 * Defines shared data models used across the frontend.
 * These types represent API responses from the FastAPI backend
 * (episodes, labels, and session health metrics).
 */

export type EpisodeRow = {
  session_id: string;
  episode_id: number;
  start_frame_idx: number;
  end_frame_idx: number;
  length: number;
  start_t: number;
  end_t: number;
  label: string | null;
  review_status: string | null;
  notes: string | null;
};

export type EpisodeLabel = {
  session_id: string;
  episode_id: number;
  label: string;
  review_status: string;
  notes: string;
};

export type SessionHealth = {
  session_id: string;
  missing_ratio: number;
  dt_abs_p95: number;
  fragmentation_score: number;
  overall_status: string;
};
