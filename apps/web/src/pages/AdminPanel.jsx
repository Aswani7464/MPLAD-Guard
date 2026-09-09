import { useEffect, useState } from 'react'
import BackToDashboard from '../components/common/BackToDashboard'
import { apiRequest } from '../services/api'

function AdminPanel() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  async function loadProjects() {
    try {
      setLoading(true)
      setError('')

      const data = await apiRequest('/projects/')
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  const totalProjects = projects.length

  const activeProjects = projects.filter(
    (project) =>
      String(project.status || '').toLowerCase() === 'active',
  ).length

  const completedProjects = projects.filter(
    (project) =>
      String(project.status || '').toLowerCase() === 'completed' ||
      Number(project.completion_percentage || 0) >= 100,
  ).length

  const highRiskProjects = projects.filter(
    (project) =>
      String(project.risk_level || '').toLowerCase() === 'high' ||
      String(project.risk_status || '').toLowerCase() === 'high',
  ).length

  function formatBudget(budget) {
    return `₹${Number(budget || 0).toLocaleString('en-IN')}`
  }

  return (
    <div className="admin-page">
      <style>{`
        .admin-page {
          min-height: 100vh;
          padding: 28px;
          background: #f6f8fb;
          color: #172033;
        }

        .admin-container {
          max-width: 1450px;
          margin: 0 auto;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
        }

        .admin-title {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .admin-subtitle {
          margin: 7px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .admin-refresh {
          padding: 10px 16px;
          border: 1px solid #d9e1eb;
          border-radius: 9px;
          background: white;
          color: #2563eb;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .admin-refresh:hover {
          background: #f8fbff;
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .admin-stat {
          padding: 20px;
          background: white;
          border: 1px solid #e4e9f0;
          border-radius: 15px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
        }

        .admin-stat-label {
          color: #718096;
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .admin-stat-value {
          margin-top: 9px;
          font-size: 28px;
          font-weight: 800;
        }

        .admin-content {
          background: white;
          border: 1px solid #e4e9f0;
          border-radius: 16px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .admin-content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 22px;
          border-bottom: 1px solid #edf0f4;
        }

        .admin-content-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
        }

        .admin-content-description {
          margin: 5px 0 0;
          color: #7b8494;
          font-size: 12px;
        }

        .project-table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .project-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 750px;
        }

        .project-table th {
          padding: 13px 18px;
          background: #f8fafc;
          color: #64748b;
          text-align: left;
          font-size: 11px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .project-table td {
          padding: 15px 18px;
          border-top: 1px solid #edf0f4;
          font-size: 13px;
        }

        .project-name {
          font-weight: 750;
        }

        .project-location {
          margin-top: 4px;
          color: #7b8494;
          font-size: 11px;
        }

        .status-badge {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 750;
        }

        .status-active {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .status-completed {
          background: #dcfce7;
          color: #15803d;
        }

        .status-proposed {
          background: #fef3c7;
          color: #a16207;
        }

        .status-other {
          background: #eef2f7;
          color: #475569;
        }

        .completion {
          min-width: 110px;
        }

        .completion-top {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 11px;
          font-weight: 700;
        }

        .completion-bar {
          height: 6px;
          overflow: hidden;
          border-radius: 99px;
          background: #e9eef4;
        }

        .completion-fill {
          height: 100%;
          border-radius: inherit;
          background: #2563eb;
        }

        .empty-state {
          padding: 50px 20px;
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
          padding: 50px;
          text-align: center;
          color: #64748b;
        }

        @media (max-width: 1000px) {
          .admin-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .admin-page {
            padding: 16px;
          }

          .admin-header {
            flex-direction: column;
          }

          .admin-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="admin-container">
        <BackToDashboard />

        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-subtitle">
              Manage projects and monitor the overall MPLAD-Guard system.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh"
            onClick={loadProjects}
          >
            ↻ Refresh
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-label">Total Projects</div>
            <div className="admin-stat-value">{totalProjects}</div>
          </div>

          <div className="admin-stat">
            <div className="admin-stat-label">Active Projects</div>
            <div className="admin-stat-value">{activeProjects}</div>
          </div>

          <div className="admin-stat">
            <div className="admin-stat-label">Completed Projects</div>
            <div className="admin-stat-value">{completedProjects}</div>
          </div>

          <div className="admin-stat">
            <div className="admin-stat-label">High Risk Projects</div>
            <div className="admin-stat-value">{highRiskProjects}</div>
          </div>
        </div>

        <div className="admin-content">
          <div className="admin-content-header">
            <div>
              <h2 className="admin-content-title">Project Management</h2>
              <p className="admin-content-description">
                Current projects registered in MPLAD-Guard.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="loading">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              No projects are available.
            </div>
          ) : (
            <div className="project-table-wrapper">
              <table className="project-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Completion</th>
                    <th>Project ID</th>
                  </tr>
                </thead>

                <tbody>
                  {projects.map((project) => {
                    const completion = Math.min(
                      Math.max(
                        Number(project.completion_percentage || 0),
                        0,
                      ),
                      100,
                    )

                    const status = String(
                      project.status || 'Proposed',
                    )

                    const statusClass =
                      status.toLowerCase() === 'active'
                        ? 'status-active'
                        : status.toLowerCase() === 'completed'
                          ? 'status-completed'
                          : status.toLowerCase() === 'proposed'
                            ? 'status-proposed'
                            : 'status-other'

                    return (
                      <tr key={project.id}>
                        <td>
                          <div className="project-name">
                            {project.name}
                          </div>

                          <div className="project-location">
                            {project.location ||
                              'Location not available'}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${statusClass}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          {formatBudget(project.budget)}
                        </td>

                        <td>
                          <div className="completion">
                            <div className="completion-top">
                              <span>Progress</span>
                              <span>{completion}%</span>
                            </div>

                            <div className="completion-bar">
                              <div
                                className="completion-fill"
                                style={{
                                  width: `${completion}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td>
                          #{project.id}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPanel