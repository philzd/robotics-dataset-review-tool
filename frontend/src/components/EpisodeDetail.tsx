/**
 * EpisodeDetail
 *
 * Displays metadata for the currently selected episode.
 * This panel helps reviewers inspect episode boundaries and timing
 * before assigning a label.
 */

import type { EpisodeRow } from "../types";

type Props = {
  episode: EpisodeRow | null;
};

export function EpisodeDetail({ episode }: Props) {
  if (!episode) {
    return <p>Select an episode to view details.</p>;
  }

  return (
    <div>
      <h3>Episode Detail</h3>

      <p><strong>Session:</strong> {episode.session_id}</p>
      <p><strong>Episode ID:</strong> {episode.episode_id}</p>
      <p><strong>Frames:</strong> {episode.start_frame_idx} → {episode.end_frame_idx}</p>
      <p><strong>Length:</strong> {episode.length}</p>
      <p><strong>Time:</strong> {episode.start_t.toFixed(2)}s → {episode.end_t.toFixed(2)}s</p>
      <p><strong>Label:</strong> {episode.label ?? "Unlabeled"}</p>
      <p><strong>Review Status:</strong> {episode.review_status ?? "—"}</p>
      <p><strong>Notes:</strong> {episode.notes ?? "—"}</p>
    </div>
  );
}
