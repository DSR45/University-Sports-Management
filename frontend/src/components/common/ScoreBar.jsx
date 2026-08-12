export default function ScoreBar({ label, score }) {
  return (
    <div className="score-row">
      <span>{label}</span>

      <div className="bar">
        <i style={{ width: `${score * 10}%` }} />
      </div>

      <strong>{score}/10</strong>
    </div>
  );
}