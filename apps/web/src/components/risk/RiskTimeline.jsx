function RiskTimeline({ events = [] }) {
  return (
    <div className="risk-timeline">
      <div className="risk-timeline-header">
        <div>
          <p className="risk-section-label">RISK HISTORY</p>
          <h3>Risk Timeline</h3>
          <p>Track important changes in project risk</p>
        </div>

        <div className="timeline-status">
          <span className="timeline-status-dot"></span>
          Monitoring
        </div>
      </div>

      {events.length === 0 ? (
        <div className="risk-timeline-empty">
          <div className="timeline-empty-icon">◷</div>

          <h4>No risk history available</h4>

          <p>
            Risk assessment events will appear here as the project is
            monitored and updated.
          </p>
        </div>
      ) : (
        <div className="timeline-list">
          {events.map((event, index) => {
            const level = event.level || 'Low'
            const levelClass = String(level).toLowerCase()

            return (
              <div
                className="timeline-item"
                key={event.id || `${event.title}-${index}`}
              >
                <div className="timeline-marker-wrapper">
                  <div className={`timeline-marker ${levelClass}`}>
                    <span></span>
                  </div>

                  {index < events.length - 1 && (
                    <div className="timeline-line"></div>
                  )}
                </div>

                <div className="timeline-content">
                  <div className="timeline-top">
                    <div>
                      <strong>
                        {event.title || 'Risk assessment update'}
                      </strong>

                      {event.date && (
                        <small>{event.date}</small>
                      )}
                    </div>

                    <span className={`timeline-level ${levelClass}`}>
                      {level}
                    </span>
                  </div>

                  {event.description && (
                    <p>{event.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RiskTimeline