function RiskCard({
  title = 'Overall Risk',
  score = 0,
  level = 'Low',
  description = 'No major risks detected.',
}) {
  return (
    <div className="risk-card">
      <div className="risk-card-header">
        <div>
          <p className="risk-card-label">{title}</p>
          <h3>{level} Risk</h3>
        </div>

        <div className="risk-score">
          {score}
        </div>
      </div>

      <div className="risk-progress">
        <div
          className="risk-progress-bar"
          style={{ width: `${Math.min(score, 100)}%` }}
        ></div>
      </div>

      <p className="risk-card-description">{description}</p>
    </div>
  )
}

export default RiskCard
