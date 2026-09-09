import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import BackToDashboard from '../components/common/BackToDashboard'

function RiskAnalysis() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [riskData, setRiskData] = useState(null)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingRisk, setLoadingRisk] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (selectedProjectId) {
      loadRisk(selectedProjectId)
    } else {
      setRiskData(null)
    }
  }, [selectedProjectId])

  async function loadProjects() {
    try {
      setLoadingProjects(true)
      setError('')

      const data = await apiRequest('/projects/')
      const projectList = Array.isArray(data) ? data : []

      setProjects(projectList)

      if (projectList.length > 0) {
        setSelectedProjectId(String(projectList[0].id))
      }
    } catch (err) {
      setError(err.message || 'Unable to load projects.')
    } finally {
      setLoadingProjects(false)
    }
  }

  async function loadRisk(projectId) {
    try {
      setLoadingRisk(true)
      setError('')

      const data = await apiRequest(`/risk/${projectId}`)
      setRiskData(data)
    } catch (err) {
      setRiskData(null)
      setError(err.message || 'Unable to load risk analysis.')
    } finally {
      setLoadingRisk(false)
    }
  }

  const selectedProject = useMemo(
    () =>
      projects.find(
        (project) => String(project.id) === String(selectedProjectId),
      ),
    [projects, selectedProjectId],
  )

  const riskScore = Number(
    riskData?.risk_score ??
      riskData?.score ??
      riskData?.overall_risk_score ??
      0,
  )

  const riskLevel = (
    riskData?.risk_level ??
    riskData?.risk_status ??
    riskData?.level ??
    (riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low')
  ).toString()

  const normalizedRiskLevel =
    riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1).toLowerCase()

  const riskFactors = Array.isArray(riskData?.factors)
    ? riskData.factors
    : Array.isArray(riskData?.risk_factors)
      ? riskData.risk_factors
      : []

  const recommendations = Array.isArray(riskData?.recommendations)
    ? riskData.recommendations
    : []

  const timeline = Array.isArray(riskData?.timeline)
    ? riskData.timeline
    : []

  const riskBreakdown =
    riskData?.breakdown ??
    riskData?.risk_breakdown ??
    riskData?.categories ??
    {}

  function getRiskClass(level) {
    const value = String(level).toLowerCase()

    if (value.includes('high')) return 'high'
    if (value.includes('medium')) return 'medium'
    return 'low'
  }

  function formatValue(value) {
    if (value === null || value === undefined || value === '') {
      return '—'
    }

    if (typeof value === 'object') {
      return value.value ?? value.score ?? value.name ?? '—'
    }

    return value
  }

  return (
    <div className="risk-page">
      <style>{`
        .risk-page {
          min-height: 100%;
          padding: 28px;
          background: #f6f8fb;
          color: #172033;
        }

        .risk-container {
          max-width: 1450px;
          margin: 0 auto;
        }

        .risk-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
        }

        .risk-title {
          margin: 0;
          font-size: 30px;
          font-weight: 750;
          letter-spacing: -0.5px;
        }

        .risk-subtitle {
          margin: 7px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .risk-selector {
          min-width: 280px;
        }

        .risk-selector label {
          display: block;
          margin-bottom: 7px;
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .risk-selector select {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid #d9e0e8;
          border-radius: 10px;
          background: white;
          color: #172033;
          font-size: 14px;
          outline: none;
        }

        .risk-selector select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .risk-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .risk-card {
          background: white;
          border: 1px solid #e4e9f0;
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
        }

        .risk-card-title {
          margin: 0 0 4px;
          font-size: 15px;
          font-weight: 750;
        }

        .risk-card-subtitle {
          margin: 0;
          color: #7b8494;
          font-size: 12px;
        }

        .risk-score-card {
          display: flex;
          align-items: center;
          gap: 24px;
          min-height: 170px;
        }

        .score-circle {
          width: 126px;
          height: 126px;
          flex: 0 0 126px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: conic-gradient(
            #2563eb ${Math.min(Math.max(riskScore, 0), 100)}%,
            #e8edf4 ${Math.min(Math.max(riskScore, 0), 100)}% 100%
          );
        }

        .score-circle::after {
          content: "";
          position: absolute;
          inset: 10px;
          background: white;
          border-radius: 50%;
        }

        .score-number {
          position: relative;
          z-index: 1;
          font-size: 30px;
          font-weight: 800;
        }

        .score-label {
          position: absolute;
          z-index: 1;
          margin-top: 55px;
          font-size: 10px;
          color: #7b8494;
          font-weight: 700;
        }

        .risk-level {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          margin-top: 14px;
          font-size: 12px;
          font-weight: 750;
        }

        .risk-level.high {
          background: #fee2e2;
          color: #b91c1c;
        }

        .risk-level.medium {
          background: #fef3c7;
          color: #a16207;
        }

        .risk-level.low {
          background: #dcfce7;
          color: #15803d;
        }

        .project-mini {
          margin-top: 16px;
          padding-top: 14px;
          border-top: 1px solid #edf0f4;
        }

        .project-mini-name {
          font-size: 14px;
          font-weight: 700;
        }

        .project-mini-location {
          margin-top: 4px;
          color: #7b8494;
          font-size: 12px;
        }

        .risk-breakdown-list {
          margin-top: 18px;
          display: grid;
          gap: 13px;
        }

        .breakdown-row {
          display: grid;
          grid-template-columns: 100px 1fr 45px;
          align-items: center;
          gap: 10px;
          font-size: 12px;
        }

        .breakdown-name {
          color: #526075;
          font-weight: 650;
        }

        .progress {
          height: 8px;
          overflow: hidden;
          border-radius: 99px;
          background: #edf1f5;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #2563eb;
        }

        .breakdown-value {
          text-align: right;
          font-weight: 750;
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          margin-bottom: 18px;
        }

        .factor-list,
        .recommendation-list,
        .timeline-list {
          display: grid;
          gap: 12px;
          margin-top: 17px;
        }

        .factor-item,
        .recommendation-item,
        .timeline-item {
          padding: 14px;
          border: 1px solid #e8edf3;
          border-radius: 11px;
          background: #fbfcfe;
        }

        .factor-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .factor-name {
          font-weight: 700;
          font-size: 13px;
        }

        .factor-value {
          font-size: 12px;
          color: #64748b;
        }

        .factor-description {
          margin: 6px 0 0;
          color: #718096;
          font-size: 12px;
          line-height: 1.5;
        }

        .recommendation-item {
          border-left: 4px solid #2563eb;
        }

        .recommendation-item strong {
          font-size: 13px;
        }

        .recommendation-item p {
          margin: 5px 0 0;
          color: #697586;
          font-size: 12px;
          line-height: 1.5;
        }

        .timeline-item {
          display: flex;
          gap: 12px;
        }

        .timeline-dot {
          width: 9px;
          height: 9px;
          margin-top: 5px;
          flex: 0 0 9px;
          border-radius: 50%;
          background: #2563eb;
        }

        .timeline-date {
          font-size: 11px;
          color: #7b8494;
        }

        .timeline-title {
          margin-top: 3px;
          font-size: 13px;
          font-weight: 700;
        }

        .project-details {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 18px;
        }

        .detail-box {
          padding: 14px;
          background: #f8fafc;
          border-radius: 10px;
        }

        .detail-label {
          font-size: 10px;
          color: #7b8494;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.4px;
        }

        .detail-value {
          margin-top: 5px;
          font-size: 14px;
          font-weight: 750;
        }

        .empty-state {
          padding: 30px 15px;
          text-align: center;
          color: #7b8494;
          font-size: 13px;
        }

        .error-box {
          margin-bottom: 18px;
          padding: 13px 15px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 13px;
        }

        .loading {
          padding: 60px;
          text-align: center;
          color: #64748b;
        }

        .back-link {
          display: inline-flex;
          margin-top: 18px;
          color: #2563eb;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        @media (max-width: 1050px) {
          .risk-grid {
            grid-template-columns: 1fr;
          }

          .section-grid {
            grid-template-columns: 1fr;
          }

          .project-details {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .risk-page {
            padding: 16px;
          }

          .risk-header {
            flex-direction: column;
          }

          .risk-selector {
            width: 100%;
            min-width: 0;
          }

          .risk-score-card {
            flex-direction: column;
            align-items: flex-start;
          }

          .project-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="risk-container">
        <BackToDashboard />
        <div className="risk-header">
          <div>
            <h1 className="risk-title">Risk Analysis</h1>
            <p className="risk-subtitle">
              Monitor project risk levels, contributing factors, and recommended actions.
            </p>
          </div>

          <div className="risk-selector">
            <label htmlFor="project-select">Select project</label>

            <select
              id="project-select"
              value={selectedProjectId}
              onChange={(event) => setSelectedProjectId(event.target.value)}
              disabled={loadingProjects || projects.length === 0}
            >
              {projects.length === 0 && (
                <option value="">No projects available</option>
              )}

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        {loadingProjects || loadingRisk ? (
          <div className="risk-card loading">
            Loading risk analysis...
          </div>
        ) : !selectedProject ? (
          <div className="risk-card empty-state">
            No project is available for risk analysis.
          </div>
        ) : (
          <>
            <div className="risk-grid">
              <div className="risk-card risk-score-card">
                <div className="score-circle">
                  <span className="score-number">{riskScore}</span>
                  <span className="score-label">RISK SCORE</span>
                </div>

                <div>
                  <h2 className="risk-card-title">Overall Risk</h2>
                  <p className="risk-card-subtitle">
                    Current assessment for this project
                  </p>

                  <span
                    className={`risk-level ${getRiskClass(normalizedRiskLevel)}`}
                  >
                    {normalizedRiskLevel} Risk
                  </span>

                  <div className="project-mini">
                    <div className="project-mini-name">
                      {selectedProject.name}
                    </div>

                    <div className="project-mini-location">
                      {selectedProject.location || 'Location not available'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="risk-card">
                <h2 className="risk-card-title">Risk Breakdown</h2>
                <p className="risk-card-subtitle">
                  Contribution of individual risk categories
                </p>

                {Object.keys(riskBreakdown).length === 0 ? (
                  <div className="empty-state">
                    No detailed breakdown is available yet.
                  </div>
                ) : (
                  <div className="risk-breakdown-list">
                    {Object.entries(riskBreakdown).map(([name, value]) => {
                      const numericValue = Number(
                        typeof value === 'object'
                          ? value?.score ?? value?.value ?? 0
                          : value,
                      )

                      return (
                        <div className="breakdown-row" key={name}>
                          <span className="breakdown-name">
                            {name.replace(/_/g, ' ')}
                          </span>

                          <div className="progress">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(
                                  Math.max(numericValue, 0),
                                  100,
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="breakdown-value">
                            {numericValue}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="risk-card">
                <h2 className="risk-card-title">Project Information</h2>
                <p className="risk-card-subtitle">
                  Details used for monitoring
                </p>

                <div className="project-details">
                  <div className="detail-box">
                    <div className="detail-label">Status</div>
                    <div className="detail-value">
                      {selectedProject.status || '—'}
                    </div>
                  </div>

                  <div className="detail-box">
                    <div className="detail-label">Completion</div>
                    <div className="detail-value">
                      {selectedProject.completion_percentage ?? 0}%
                    </div>
                  </div>

                  <div className="detail-box">
                    <div className="detail-label">Budget</div>
                    <div className="detail-value">
                      ₹{Number(selectedProject.budget || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="detail-box">
                    <div className="detail-label">Project ID</div>
                    <div className="detail-value">
                      #{selectedProject.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-grid">
              <div className="risk-card">
                <h2 className="risk-card-title">Risk Factors</h2>
                <p className="risk-card-subtitle">
                  Factors contributing to the current risk score
                </p>

                {riskFactors.length === 0 ? (
                  <div className="empty-state">
                    No detailed risk factors are available yet.
                  </div>
                ) : (
                  <div className="factor-list">
                    {riskFactors.map((factor, index) => {
                      const name =
                        typeof factor === 'object'
                          ? factor.name ||
                            factor.title ||
                            factor.factor ||
                            `Risk Factor ${index + 1}`
                          : `Risk Factor ${index + 1}`

                      const value =
                        typeof factor === 'object'
                          ? factor.score ?? factor.value ?? ''
                          : factor

                      const description =
                        typeof factor === 'object'
                          ? factor.description || factor.reason || ''
                          : ''

                      return (
                        <div className="factor-item" key={index}>
                          <div className="factor-top">
                            <span className="factor-name">{name}</span>
                            <span className="factor-value">
                              {formatValue(value)}
                            </span>
                          </div>

                          {description && (
                            <p className="factor-description">
                              {description}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="risk-card">
                <h2 className="risk-card-title">Recommendations</h2>
                <p className="risk-card-subtitle">
                  Suggested actions for project monitoring
                </p>

                {recommendations.length === 0 ? (
                  <div className="empty-state">
                    No recommendations are available yet.
                  </div>
                ) : (
                  <div className="recommendation-list">
                    {recommendations.map((recommendation, index) => {
                      const title =
                        typeof recommendation === 'object'
                          ? recommendation.title ||
                            recommendation.name ||
                            `Recommendation ${index + 1}`
                          : `Recommendation ${index + 1}`

                      const description =
                        typeof recommendation === 'object'
                          ? recommendation.description ||
                            recommendation.action ||
                            ''
                          : recommendation

                      return (
                        <div
                          className="recommendation-item"
                          key={index}
                        >
                          <strong>{title}</strong>

                          {description && <p>{description}</p>}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="risk-card">
              <h2 className="risk-card-title">Risk Timeline</h2>
              <p className="risk-card-subtitle">
                Recorded risk events and changes
              </p>

              {timeline.length === 0 ? (
                <div className="empty-state">
                  No risk timeline data is available yet.
                </div>
              ) : (
                <div className="timeline-list">
                  {timeline.map((item, index) => {
                    const date =
                      typeof item === 'object'
                        ? item.date || item.created_at || ''
                        : ''

                    const title =
                      typeof item === 'object'
                        ? item.title || item.event || `Risk event ${index + 1}`
                        : item

                    return (
                      <div className="timeline-item" key={index}>
                        <span className="timeline-dot" />

                        <div>
                          {date && (
                            <div className="timeline-date">
                              {date}
                            </div>
                          )}

                          <div className="timeline-title">{title}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <Link to={`/projects/${selectedProject.id}`} className="back-link">
              View full project details →
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default RiskAnalysis