function RiskScore({ score = 0, level = 'Low' }) {
  const safeScore = Math.max(0, Math.min(Number(score) || 0, 100))

  const normalizedLevel = String(level || 'Low').toLowerCase()

  const getRiskClass = () => {
    if (normalizedLevel === 'critical') return 'critical'
    if (normalizedLevel === 'high') return 'high'
    if (normalizedLevel === 'medium') return 'medium'
    return 'low'
  }

  const getRiskMessage = () => {
    if (normalizedLevel === 'critical') {
      return 'Immediate attention required. High probability of project issues.'
    }

    if (normalizedLevel === 'high') {
      return 'Project requires close monitoring and corrective action.'
    }

    if (normalizedLevel === 'medium') {
      return 'Some risk factors require monitoring during project execution.'
    }

    return 'Project is currently within the acceptable risk range.'
  }

  return (
    <div className={`risk-score-card risk-${getRiskClass()}`}>
      <div className="risk-score-header">
        <div className="risk-score-title">
          <p>Overall Project Risk</p>

          <h3>{level} Risk</h3>

          <span className="risk-score-description">
            {getRiskMessage()}
          </span>
        </div>

        <div className="risk-score-number">
          <strong>{safeScore}</strong>
          <span>/100</span>
        </div>
      </div>

      <div className="risk-score-progress">
        <div
          className="risk-score-progress-bar"
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <div className="risk-score-scale">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
        <span>Critical</span>
      </div>

      <div className="risk-score-footer">
        <span>Risk assessment score</span>
        <strong>{safeScore}/100</strong>
      </div>
    </div>
  )
}

export default RiskScore