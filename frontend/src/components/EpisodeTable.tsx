/**
 * EpisodeTable
 *
 * Displays a list of episodes in a table format.
 * Allows selecting an episode for inspection.
 */

import type { EpisodeRow } from "../types";

type Props = {
  episodes: EpisodeRow[];
  selectedEpisodeId: number | null;
  onSelectEpisode: (episodeId: number) => void;
};

export function EpisodeTable({
  episodes,
  selectedEpisodeId,
  onSelectEpisode,
}: Props) {
  return (
    <table border={1} cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>Episode ID</th>
          <th>Length</th>
          <th>Label</th>
          <th>Review Status</th>
        </tr>
      </thead>

      <tbody>
        {episodes.map((ep) => (
          <tr
            key={ep.episode_id}
            onClick={() => onSelectEpisode(ep.episode_id)}
            style={{
              cursor: "pointer",
              backgroundColor:
                ep.episode_id === selectedEpisodeId ? "#eee" : "white",
            }}
          >
            <td>{ep.episode_id}</td>
            <td>{ep.length}</td>
            <td>{ep.label ?? "—"}</td>
            <td>{ep.review_status ?? "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
