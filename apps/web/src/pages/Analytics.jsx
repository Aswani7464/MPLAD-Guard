import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../services/api'
import BackToDashboard from '../components/common/BackToDashboard'

function Analytics() {
  const [projects, setProjects] = useState([])
  const [riskData, setRiskData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    try {
      setLoading(true)
      setError('')

      const [projectsResponse, risksResponse] =
        await Promise.all([
          apiRequest('/projects/'),
          apiRequest('/analytics/risks'),
        ])

      const projectList = Array.isArray(projectsResponse)
        ? projectsResponse
        : Array.isArray(projectsResponse?.projects)
          ? projectsResponse.projects
          : []

      const risks = Array.isArray(risksResponse)
        ? risksResponse
        : Array.isArray(risksResponse?.risks)
          ? risksResponse.risks
          : []

      setProjects(projectList)
      setRiskData(risks)
    } catch (err) {
      console.error(err)
      setError(
        err.message || 'Unable to load analytics data.'
      )
    } finally {
      setLoading(false)
    }
  }

  const analytics = useMemo(() => {
    const total = projects.length

    const active = projects.filter(
      (project) =>
        String(project.status || '').toLowerCase() ===
        'active'
    ).length

    const completed = projects.filter(
      (project) =>
        String(project.status || '').toLowerCase() ===
          'completed' ||
        Number(project.completion_percentage || 0) >= 100
    ).length

    const proposed = projects.filter(
      (project) =>
        String(project.status || '').toLowerCase() ===
        'proposed'
    ).length

    const averageCompletion =
      total > 0
        ? Math.round(
            projects.reduce(
              (sum, project) =>
                sum +
                Number(
                  project.completion_percentage || 0
                ),
              0
            ) / total
          )
        : 0

    const highRisk = riskData.filter(
      (risk) => {
        const level = String(
          risk.risk_level ||
          risk.risk_status ||
          risk.level ||
          ''
        ).toLowerCase()

        return level === 'high'
      }
    ).length

    const mediumRisk = riskData.filter(
      (risk) => {
        const level = String(
          risk.risk_level ||
          risk.risk_status ||
          risk.level ||
          ''
        ).toLowerCase()

        return level === 'medium'
      }
    ).length

    const lowRisk = riskData.filter(
      (risk) => {
        const level = String(
          risk.risk_level ||
          risk.risk_status ||
          risk.level ||
          ''
        ).toLowerCase()

        return level === 'low'
      }
    ).length

    return {
      total,
      active,
      completed,
      proposed,
      averageCompletion,
      highRisk,
      mediumRisk,
      lowRisk,
    }
  }, [projects, riskData])

  return (
    <div className="analytics-dashboard-page">

      <style>{`
        .analytics-dashboard-page {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding-bottom: 30px;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
        }

        .analytics-title h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          color: #172033;
          letter-spacing: -0.5px;
        }

        .analytics-title p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .analytics-refresh {
          border: 1px solid #dbe3ee;
          background: #ffffff;
          color: #2563eb;
          padding: 10px 15px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .analytics-refresh:hover {
          background: #f8fbff;
          border-color: #2563eb;
        }

        .analytics-refresh:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analytics-error {
          margin-bottom: 20px;
          padding: 14px 16px;
          border-radius: 10px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #c2410c;
          font-size: 13px;
          font-weight: 600;
        }

        .analytics-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .analytics-stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 19px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .analytics-stat-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .analytics-stat-value {
          color: #172033;
          font-size: 28px;
          font-weight: 800;
        }

        .analytics-stat-subtitle {
          margin-top: 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .analytics-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(300px, 0.8fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .analytics-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .analytics-card-header {
          margin-bottom: 20px;
        }

        .analytics-card-header h2 {
          margin: 0;
          color: #172033;
          font-size: 18px;
          font-weight: 800;
        }

        .analytics-card-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .analytics-progress-row {
          margin-bottom: 20px;
        }

        .analytics-progress-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .analytics-progress-label {
          color: #475569;
          font-size: 12px;
          font-weight: 700;
        }

        .analytics-progress-value {
          color: #172033;
          font-size: 12px;
          font-weight: 800;
        }

        .analytics-progress-track {
          height: 9px;
          background: #e8eef7;
          border-radius: 999px;
          overflow: hidden;
        }

        .analytics-progress-fill {
          height: 100%;
          background: #2563eb;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .analytics-status-list {
          display: grid;
          gap: 12px;
        }

        .analytics-status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .analytics-status-name {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .analytics-status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563eb;
        }

        .analytics-status-count {
          color: #172033;
          font-size: 16px;
          font-weight: 800;
        }

        .analytics-risk-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .analytics-risk-card {
          padding: 18px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
        }

        .analytics-risk-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
        }

        .analytics-risk-value {
          margin-top: 7px;
          color: #172033;
          font-size: 25px;
          font-weight: 800;
        }

        .analytics-risk-description {
          margin-top: 4px;
          color: #94a3b8;
          font-size: 11px;
        }

        .analytics-table-wrapper {
          overflow-x: auto;
        }

        .analytics-table {
          width: 100%;
          border-collapse: collapse;
        }

        .analytics-table th {
          padding: 12px;
          text-align: left;
          color: #64748b;
          background: #f8fafc;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          border-bottom: 1px solid #e2e8f0;
        }

        .analytics-table td {
          padding: 14px 12px;
          color: #475569;
          font-size: 12px;
          border-bottom: 1px solid #eef2f7;
        }

        .analytics-project-name {
          color: #172033;
          font-weight: 800;
        }

        .analytics-completion {
          font-weight: 800;
          color: #2563eb;
        }

        .analytics-loading {
          padding: 45px;
          text-align: center;
          color: #64748b;
          font-size: 13px;
        }

        .analytics-empty {
          padding: 35px;
          text-align: center;
          color: #64748b;
          font-size: 13px;
        }

        @media (max-width: 1050px) {
          .analytics-stat-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .analytics-main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .analytics-stat-grid {
            grid-template-columns: 1fr;
          }

          .analytics-risk-grid {
            grid-template-columns: 1fr;
          }

          .analytics-header {
            flex-direction: column;
          }

          .analytics-refresh {
            width: 100%;
          }

          .analytics-title h1 {
            font-size: 25px;
          }
        }
      `}</style>


      {/* BACK TO DASHBOARD */}

      <BackToDashboard />


      {/* HEADER */}

      <div className="analytics-header">

        <div className="analytics-title">
          <h1>Analytics</h1>

          <p>
            Monitor project performance, completion and
            risk distribution.
          </p>
        </div>

        <button
          className="analytics-refresh"
          onClick={loadAnalytics}
          disabled={loading}
        >
          ↻ Refresh Analytics
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="analytics-error">
          {error}
        </div>
      )}


      {loading ? (

        <div className="analytics-card analytics-loading">
          Loading project analytics...
        </div>

      ) : (

        <>

          {/* STATISTICS */}

          <div className="analytics-stat-grid">

            <div className="analytics-stat-card">

              <div className="analytics-stat-label">
                Total Projects
              </div>

              <div className="analytics-stat-value">
                {analytics.total}
              </div>

              <div className="analytics-stat-subtitle">
                All registered projects
              </div>

            </div>


            <div className="analytics-stat-card">

              <div className="analytics-stat-label">
                Active Projects
              </div>

              <div className="analytics-stat-value">
                {analytics.active}
              </div>

              <div className="analytics-stat-subtitle">
                Currently active
              </div>

            </div>


            <div className="analytics-stat-card">

              <div className="analytics-stat-label">
                Completed Projects
              </div>

              <div className="analytics-stat-value">
                {analytics.completed}
              </div>

              <div className="analytics-stat-subtitle">
                Fully completed
              </div>

            </div>


            <div className="analytics-stat-card">

              <div className="analytics-stat-label">
                Average Completion
              </div>

              <div className="analytics-stat-value">
                {analytics.averageCompletion}%
              </div>

              <div className="analytics-stat-subtitle">
                Across all projects
              </div>

            </div>

          </div>


          {/* PERFORMANCE + STATUS */}

          <div className="analytics-main-grid">

            <div className="analytics-card">

              <div className="analytics-card-header">

                <h2>
                  Project Performance
                </h2>

                <p>
                  Overall project completion progress.
                </p>

              </div>

              <div className="analytics-progress-row">

                <div className="analytics-progress-top">

                  <span className="analytics-progress-label">
                    Average Project Completion
                  </span>

                  <span className="analytics-progress-value">
                    {analytics.averageCompletion}%
                  </span>

                </div>

                <div className="analytics-progress-track">

                  <div
                    className="analytics-progress-fill"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          analytics.averageCompletion,
                          0
                        ),
                        100
                      )}%`,
                    }}
                  />

                </div>

              </div>

              <div className="analytics-status-list">

                <div className="analytics-status-item">

                  <div className="analytics-status-name">
                    <span className="analytics-status-dot" />
                    Active
                  </div>

                  <div className="analytics-status-count">
                    {analytics.active}
                  </div>

                </div>


                <div className="analytics-status-item">

                  <div className="analytics-status-name">
                    <span className="analytics-status-dot" />
                    Proposed
                  </div>

                  <div className="analytics-status-count">
                    {analytics.proposed}
                  </div>

                </div>


                <div className="analytics-status-item">

                  <div className="analytics-status-name">
                    <span className="analytics-status-dot" />
                    Completed
                  </div>

                  <div className="analytics-status-count">
                    {analytics.completed}
                  </div>

                </div>

              </div>

            </div>


            {/* RISK */}

            <div className="analytics-card">

              <div className="analytics-card-header">

                <h2>
                  Risk Distribution
                </h2>

                <p>
                  Current risk levels from the analytics service.
                </p>

              </div>

              <div className="analytics-risk-grid">

                <div className="analytics-risk-card">

                  <div className="analytics-risk-label">
                    High Risk
                  </div>

                  <div className="analytics-risk-value">
                    {analytics.highRisk}
                  </div>

                  <div className="analytics-risk-description">
                    Requires attention
                  </div>

                </div>


                <div className="analytics-risk-card">

                  <div className="analytics-risk-label">
                    Medium Risk
                  </div>

                  <div className="analytics-risk-value">
                    {analytics.mediumRisk}
                  </div>

                  <div className="analytics-risk-description">
                    Needs monitoring
                  </div>

                </div>


                <div className="analytics-risk-card">

                  <div className="analytics-risk-label">
                    Low Risk
                  </div>

                  <div className="analytics-risk-value">
                    {analytics.lowRisk}
                  </div>

                  <div className="analytics-risk-description">
                    Normal condition
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* PROJECT TABLE */}

          <div className="analytics-card">

            <div className="analytics-card-header">

              <h2>
                Project Performance Details
              </h2>

              <p>
                Completion and current status for each project.
              </p>

            </div>

            {projects.length === 0 ? (

              <div className="analytics-empty">
                No projects available for analytics.
              </div>

            ) : (

              <div className="analytics-table-wrapper">

                <table className="analytics-table">

                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Status</th>
                      <th>Completion</th>
                      <th>Budget</th>
                      <th>Location</th>
                    </tr>
                  </thead>

                  <tbody>

                    {projects.map((project) => (

                      <tr key={project.id}>

                        <td>
                          <span className="analytics-project-name">
                            {project.name}
                          </span>
                        </td>

                        <td>
                          {project.status || 'Unknown'}
                        </td>

                        <td>
                          <span className="analytics-completion">
                            {Number(
                              project.completion_percentage || 0
                            )}%
                          </span>
                        </td>

                        <td>
                          ₹
                          {Number(
                            project.budget || 0
                          ).toLocaleString('en-IN')}
                        </td>

                        <td>
                          {project.location ||
                            'Location not provided'}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </>

      )}

    </div>
  )
}

export default Analytics