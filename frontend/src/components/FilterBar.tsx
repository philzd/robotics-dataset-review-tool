/**
 * FilterBar
 *
 * Provides simple filters for narrowing the episode review queue.
 * Filters are sent to the backend as query parameters.
 */

type Props = {
  minLength: number;
  unlabeledOnly: boolean;
  needsReviewOnly: boolean;
  onMinLengthChange: (value: number) => void;
  onUnlabeledOnlyChange: (value: boolean) => void;
  onNeedsReviewOnlyChange: (value: boolean) => void;
};

export function FilterBar({
  minLength,
  unlabeledOnly,
  needsReviewOnly,
  onMinLengthChange,
  onUnlabeledOnlyChange,
  onNeedsReviewOnlyChange,
}: Props) {
  return (
    <div style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "16px" }}>
      <h3>Filters</h3>

      <label>
        Min Length:{" "}
        <input
          type="number"
          value={minLength}
          onChange={(e) => onMinLengthChange(Number(e.target.value))}
        />
      </label>

      <div>
        <label>
          <input
            type="checkbox"
            checked={unlabeledOnly}
            onChange={(e) => onUnlabeledOnlyChange(e.target.checked)}
          />
          {" "}Unlabeled only
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={needsReviewOnly}
            onChange={(e) => onNeedsReviewOnlyChange(e.target.checked)}
          />
          {" "}Needs review only
        </label>
      </div>
    </div>
  );
}
