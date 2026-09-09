function RecommendationCard({
  title = 'Risk Recommendation',
  recommendation = 'No recommendation available.',
  priority = 'Medium',
}) {
  const priorityClass = String(priority || 'Medium').toLowerCase()

  return (
    <div className="recommendation-card">
      <div className="recommendation-header">
        <div className="recommendation-title">
          <p className="risk-section-label">AI-POWERED INSIGHT</p>

          <h3>{title}</h3>

          <span>
            Recommendation generated from available project risk data
          </span>
        </div>

        <div className={`recommendation-priority ${priorityClass}`}>
          <span className="recommendation-priority-dot"></span>
          {priority}
        </div>
      </div>

      <div className="recommendation-body">
        <div className="recommendation-icon">
          ✦
        </div>

        <div className="recommendation-content">
          <p>{recommendation}</p>
        </div>
      </div>

      <div className="recommendation-footer">
        <span>
          Review this recommendation during the next project assessment.
        </span>

        <button
          type="button"
          className="recommendation-action"
        >
          View Recommendation
          <span>→</span>
        </button>
      </div>
    </div>
  )
}

export default RecommendationCard