import type { EpisodeLabel, EpisodeRow, SessionHealth } from "./types";

const API_BASE = "http://127.0.0.1:8000";

export type EpisodeFilters = {
  minLength?: number;
  unlabeledOnly?: boolean;
  needsReviewOnly?: boolean;
};

export async function fetchEpisodes(
  filters: EpisodeFilters = {}
): Promise<EpisodeRow[]> {
  const params = new URLSearchParams();

  if (filters.minLength !== undefined) {
    params.set("min_length", String(filters.minLength));
  }

  if (filters.unlabeledOnly !== undefined) {
    params.set("unlabeled_only", String(filters.unlabeledOnly));
  }

  if (filters.needsReviewOnly !== undefined) {
    params.set("needs_review_only", String(filters.needsReviewOnly));
  }

  const query = params.toString();
  const url = query ? `${API_BASE}/episodes?${query}` : `${API_BASE}/episodes`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch episodes.");
  }

  return response.json();
}

export async function fetchSessionHealth(): Promise<SessionHealth> {
  const response = await fetch(`${API_BASE}/session-health`);

  if (!response.ok) {
    throw new Error("Failed to fetch session health.");
  }

  return response.json();
}

export async function saveLabel(payload: EpisodeLabel): Promise<EpisodeLabel> {
  const response = await fetch(`${API_BASE}/labels`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to save label.");
  }

  return response.json();
}
