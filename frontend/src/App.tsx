/**
 * App
 *
 * Root component for the dataset review tool.
 * Fetches episode data, session health metrics, and renders
 * the episode table, detail panel, filters, and label form.
 */

import { useEffect, useState } from "react";
import { fetchEpisodes, fetchSessionHealth } from "./api";
import type { EpisodeRow, SessionHealth } from "./types";
import { EpisodeTable } from "./components/EpisodeTable";
import { EpisodeDetail } from "./components/EpisodeDetail";
import { LabelForm } from "./components/LabelForm";
import { SessionHealthPanel } from "./components/SessionHealthPanel";
import { FilterBar } from "./components/FilterBar";

function App() {
  const [episodes, setEpisodes] = useState<EpisodeRow[]>([]);
  const [sessionHealth, setSessionHealth] = useState<SessionHealth | null>(null);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);

  const [minLength, setMinLength] = useState<number>(0);
  const [unlabeledOnly, setUnlabeledOnly] = useState<boolean>(false);
  const [needsReviewOnly, setNeedsReviewOnly] = useState<boolean>(false);

  async function reloadEpisodes() {
    const data = await fetchEpisodes({
      minLength,
      unlabeledOnly,
      needsReviewOnly,
    });

    setEpisodes(data);

    if (data.length === 0) {
      setSelectedEpisodeId(null);
      return;
    }

    const selectedStillExists = data.some(
      (episode) => episode.episode_id === selectedEpisodeId
    );

    if (!selectedStillExists) {
      setSelectedEpisodeId(data[0].episode_id);
    }
  }

  useEffect(() => {
    async function loadInitialData() {
      const health = await fetchSessionHealth();
      setSessionHealth(health);

      const data = await fetchEpisodes({
        minLength,
        unlabeledOnly,
        needsReviewOnly,
      });

      setEpisodes(data);

      if (data.length > 0) {
        setSelectedEpisodeId(data[0].episode_id);
      }
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    reloadEpisodes();
  }, [minLength, unlabeledOnly, needsReviewOnly]);

  const selectedEpisode =
    episodes.find((episode) => episode.episode_id === selectedEpisodeId) ?? null;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "16px" }}>Episode Review Tool</h2>

      <SessionHealthPanel health={sessionHealth} />

      <FilterBar
        minLength={minLength}
        unlabeledOnly={unlabeledOnly}
        needsReviewOnly={needsReviewOnly}
        onMinLengthChange={setMinLength}
        onUnlabeledOnlyChange={setUnlabeledOnly}
        onNeedsReviewOnlyChange={setNeedsReviewOnly}
      />

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
        <EpisodeTable
          episodes={episodes}
          selectedEpisodeId={selectedEpisodeId}
          onSelectEpisode={setSelectedEpisodeId}
        />

        <div>
          <EpisodeDetail episode={selectedEpisode} />
          <LabelForm episode={selectedEpisode} onSaved={reloadEpisodes} />
        </div>
      </div>
    </div>
  );
}

export default App;
