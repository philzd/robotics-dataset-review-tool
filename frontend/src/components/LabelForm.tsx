/**
 * LabelForm
 *
 * Allows user to assign or update a label for the selected episode.
 * Sends data to backend via POST /labels.
 */

import { useEffect, useState } from "react";
import type { EpisodeRow, EpisodeLabel } from "../types";
import { saveLabel } from "../api";

type Props = {
  episode: EpisodeRow | null;
  onSaved: () => void;
};

export function LabelForm({ episode, onSaved }: Props) {
  const [label, setLabel] = useState<string>("good");
  const [reviewStatus, setReviewStatus] = useState<string>("needs_review");
  const [notes, setNotes] = useState<string>("");

  // When episode changes, preload existing values
  useEffect(() => {
    if (episode) {
      setLabel(episode.label ?? "good");
      setReviewStatus(episode.review_status ?? "needs_review");
      setNotes(episode.notes ?? "");
    }
  }, [episode]);

  if (!episode) {
    return null;
  }

  async function handleSave() {
    const payload: EpisodeLabel = {
      session_id: episode.session_id,
      episode_id: episode.episode_id,
      label,
      review_status: reviewStatus,
      notes,
    };

    await saveLabel(payload);
    onSaved();
  }

  return (
  <div>
    <h3>Label Episode</h3>

    <div style={{ marginBottom: "8px" }}>
      <label>Label:</label>
      <select value={label} onChange={(e) => setLabel(e.target.value)}>
        <option value="good">good</option>
        <option value="bad_alignment">bad_alignment</option>
        <option value="missing_data">missing_data</option>
      </select>
    </div>

    <div style={{ marginBottom: "8px" }}>
      <label>Review Status:</label>
      <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}>
        <option value="needs_review">needs_review</option>
        <option value="reviewed">reviewed</option>
      </select>
    </div>

    <div style={{ marginBottom: "8px" }}>
      <label>Notes:</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />
    </div>

    <button onClick={handleSave}>Save</button>
  </div>
);
}
