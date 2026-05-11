/**
 * SessionHealthPanel
 *
 * Displays session-level dataset quality metrics.
 * Helps reviewers understand whether a session has alignment,
 * missing-data, or fragmentation issues.
 */

import type { SessionHealth } from "../types";

type Props = {
  health: SessionHealth | null;
};

export function SessionHealthPanel({ health }: Props) {
  if (!health) {
    return <p>Loading session health...</p>;
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "16px" }}>
      <h3>Session Health</h3>

      <p><strong>Session:</strong> {health.session_id}</p>
      <p><strong>Status:</strong> {health.overall_status}</p>
      <p><strong>Missing Ratio:</strong> {health.missing_ratio.toFixed(3)}</p>
      <p><strong>Alignment p95:</strong> {health.dt_abs_p95.toFixed(4)}</p>
      <p><strong>Fragmentation:</strong> {health.fragmentation_score.toFixed(3)}</p>
    </div>
  );
}
