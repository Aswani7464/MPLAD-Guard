function RiskDistribution({
  low = 0,
  medium = 0,
  high = 0,
  critical = 0,
}) {
  const total = low + medium + high + critical

  const getPercentage = (value) => {
    if (total === 0) return 0
    return Math.round((value / total) * 100)
  }

  return (
    <div className="risk-distribution">
      <div className="distribution-header">
        <div>
          <h3>Risk Distribution</h3>
          <p>Current project risk levels</p>
        </div>

        <strong>{total}</strong>
      </div>

      <div className="risk-distribution-list">
        <div className="risk-distribution-item">
          <span>Low Risk</span>
          <strong>{low}</strong>
          <small>{getPercentage(low)}%</small>
        </div>

        <div className="risk-distribution-item">
          <span>Medium Risk</span>
          <strong>{medium}</strong>
          <small>{getPercentage(medium)}%</small>
        </div>

        <div className="risk-distribution-item">
          <span>High Risk</span>
          <strong>{high}</strong>
          <small>{getPercentage(high)}%</small>
        </div>

        <div className="risk-distribution-item">
          <span>Critical Risk</span>
          <strong>{critical}</strong>
          <small>{getPercentage(critical)}%</small>
        </div>
      </div>
    </div>
  )
}

export default RiskDistribution
