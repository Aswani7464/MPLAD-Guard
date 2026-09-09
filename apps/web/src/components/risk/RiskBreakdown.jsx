function RiskBreakdown({ risks = [] }) {
  const getRiskLevel = (score) => {
    if (score >= 80) return 'Critical'
    if (score >= 60) return 'High'
    if (score >= 30) return 'Medium'
    return 'Low'
  }

  const getRiskClass = (score) => {
    if (score >= 80) return 'critical'
    if (score >= 60) return 'high'
    if (score >= 30) return 'medium'
    return 'low'
  }

  return (
    <div className="risk-breakdown">
      <div className="risk-breakdown-header">
        <div>
          <p className="risk-section-label">RISK FACTORS</p>
          <h3>Risk Breakdown</h3>
          <p>Factors currently affecting project risk</p>
        </div>

        <div className="risk-factor-count">
          <strong>{risks.length}</strong>
          <span>Factors</span>
        </div>
      </div>

      {risks.length === 0 ? (
        <div className="risk-breakdown-empty">
          <div className="risk-empty-icon">✓</div>
          <h4>No risk factors available</h4>
          <p>
            Risk factors will appear here when project risk assessment data
            becomes available.
          </p>
        </div>
      ) : (
        <div className="risk-breakdown-list">
          {risks.map((risk, index) => {
            const score = Math.max(
              0,
              Math.min(Number(risk.score) || 0, 100)
            )

            const level = risk.level || getRiskLevel(score)
            const riskClass = getRiskClass(score)

            return (
              <div
                className="risk-factor"
                key={risk.id || `${risk.name}-${index}`}
              >
                <div className="risk-factor-header">
                  <div className="risk-factor-name">
                    <span className={`risk-factor-dot ${riskClass}`} />
                    <div>
                      <strong>{risk.name || 'Risk Factor'}</strong>

                      {risk.description && (
                        <p>{risk.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="risk-factor-score">
                    <strong>{score}</strong>
                    <span>/100</span>
                  </div>
                </div>

                <div className="risk-factor-progress">
                  <div
                    className={`risk-factor-progress-bar ${riskClass}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <div className="risk-factor-footer">
                  <span>Risk level</span>

                  <span className={`risk-factor-level ${riskClass}`}>
                    {level}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RiskBreakdown