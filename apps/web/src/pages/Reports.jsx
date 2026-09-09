import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../services/api'
import BackToDashboard from '../components/common/BackToDashboard'

function Reports() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reportLoading, setReportLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedProject = useMemo(
    () =>
      projects.find(
        (project) => String(project.id) === String(selectedProjectId),
      ),
    [projects, selectedProjectId],
  )

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiRequest('/projects/')
      const projectList = Array.isArray(data) ? data : []

      setProjects(projectList)

      if (projectList.length > 0) {
        setSelectedProjectId((current) => current || String(projectList[0].id))
      }
    } catch (err) {
      setError(err.message || 'Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  const loadReport = async (projectId) => {
    if (!projectId) {
      setReport(null)
      return
    }

    try {
      setReportLoading(true)
      setError('')

      const data = await apiRequest(`/reports/${projectId}`)
      setReport(data)
    } catch (err) {
      setReport(null)
      setError(err.message || 'Unable to load project report.')
    } finally {
      setReportLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (selectedProjectId) {
      loadReport(selectedProjectId)
    }
  }, [selectedProjectId])

  const completion = Number(
    selectedProject?.completion_percentage ??
      report?.completion_percentage ??
      0,
  )

  const budget = Number(
    selectedProject?.budget ??
      report?.budget ??
      0,
  )

  const status =
    selectedProject?.status ||
    report?.status ||
    'Unknown'

  const location =
    selectedProject?.location ||
    report?.location ||
    'Location not available'

  const reportTitle =
    report?.title ||
    report?.report_title ||
    `Project Monitoring Report — ${selectedProject?.name || 'Project'}`

  const reportDescription =
    report?.description ||
    report?.summary ||
    'Monitoring report for project progress, budget and implementation status.'

  const formatBudget = (value) => {
    if (!Number.isFinite(value) || value <= 0) {
      return 'Not available'
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (value) => {
    if (!value) return 'Not available'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return String(value)
    }

    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const statusClass = status.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="reports-page">
      <style>{`
        .reports-page {
          min-height: 100%;
          padding: 28px;
          background: #f5f7fb;
          color: #172033;
        }

        .reports-container {
          max-width: 1450px;
          margin: 0 auto;
        }

        .reports-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .reports-title h1 {
          margin: 0 0 7px;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .reports-title p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .reports-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .refresh-button {
          border: 1px solid #dbe3ee;
          background: #ffffff;
          color: #1e3a8a;
          border-radius: 9px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .refresh-button:hover {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .project-selector-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 20px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .selector-label {
          display: block;
          margin-bottom: 8px;
          color: #475569;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .project-selector {
          width: 100%;
          max-width: 600px;
          padding: 12px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 9px;
          background: #ffffff;
          color: #172033;
          font-size: 14px;
          outline: none;
        }

        .project-selector:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .error-box {
          margin-bottom: 20px;
          padding: 14px 16px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fff1f2;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 600;
        }

        .loading-box,
        .empty-box {
          padding: 55px 20px;
          text-align: center;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          color: #64748b;
        }

        .report-banner {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 24px;
          margin-bottom: 20px;
          border-radius: 15px;
          background: linear-gradient(135deg, #0f3b82, #2563eb);
          color: #ffffff;
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.18);
        }

        .report-banner h2 {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 800;
        }

        .report-banner p {
          margin: 0;
          max-width: 780px;
          color: rgba(255,255,255,0.82);
          font-size: 13px;
          line-height: 1.6;
        }

        .report-id {
          padding: 10px 14px;
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 9px;
          background: rgba(255,255,255,0.1);
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .report-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          padding: 18px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .stat-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 9px;
        }

        .stat-value {
          color: #172033;
          font-size: 21px;
          font-weight: 800;
        }

        .stat-subtext {
          margin-top: 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .report-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .report-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .card-title {
          margin: 0 0 17px;
          font-size: 16px;
          font-weight: 800;
          color: #172033;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .progress-label {
          font-size: 13px;
          color: #64748b;
          font-weight: 600;
        }

        .progress-value {
          font-size: 14px;
          color: #2563eb;
          font-weight: 800;
        }

        .progress-track {
          height: 11px;
          overflow: hidden;
          border-radius: 999px;
          background: #e8eef7;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #2563eb, #60a5fa);
          transition: width 0.4s ease;
        }

        .info-list {
          display: grid;
          gap: 0;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 12px 0;
          border-bottom: 1px solid #eef2f7;
          font-size: 13px;
        }

        .info-row:last-child {
          border-bottom: 0;
        }

        .info-label {
          color: #64748b;
          font-weight: 600;
        }

        .info-value {
          color: #172033;
          font-weight: 700;
          text-align: right;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          background: #eff6ff;
          color: #2563eb;
        }

        .status-badge.active {
          background: #ecfdf5;
          color: #047857;
        }

        .status-badge.completed {
          background: #eef2ff;
          color: #4338ca;
        }

        .status-badge.proposed {
          background: #fff7ed;
          color: #c2410c;
        }

        .status-badge.pending {
          background: #fffbeb;
          color: #b45309;
        }

        .summary-text {
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
          margin: 0;
        }

        .report-footer {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          align-items: center;
          padding: 15px 18px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          color: #64748b;
          font-size: 12px;
        }

        .report-footer strong {
          color: #334155;
        }

        @media (max-width: 1000px) {
          .report-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .report-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .reports-page {
            padding: 18px;
          }

          .reports-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .report-banner {
            grid-template-columns: 1fr;
          }

          .report-stats {
            grid-template-columns: 1fr;
          }

          .report-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div className="reports-container">
        <BackToDashboard />

        <div className="reports-header">
          <div className="reports-title">
            <h1>Reports</h1>
            <p>Generate and view project monitoring reports.</p>
          </div>

          <div className="reports-actions">
            <button
              className="refresh-button"
              onClick={() => {
                loadProjects()
                if (selectedProjectId) {
                  loadReport(selectedProjectId)
                }
              }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="project-selector-card">
          <label className="selector-label">
            Select Project
          </label>

          {loading ? (
            <div style={{ color: '#64748b', fontSize: '13px' }}>
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '13px' }}>
              No projects available.
            </div>
          ) : (
            <select
              className="project-selector"
              value={selectedProjectId}
              onChange={(event) =>
                setSelectedProjectId(event.target.value)
              }
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name} — #{project.id}
                </option>
              ))}
            </select>
          )}
        </div>

        {reportLoading ? (
          <div className="loading-box">
            Loading project report...
          </div>
        ) : !selectedProject ? (
          <div className="empty-box">
            <h3 style={{ marginBottom: '8px', color: '#334155' }}>
              No project selected
            </h3>
            <p style={{ margin: 0 }}>
              Select a project to view its monitoring report.
            </p>
          </div>
        ) : (
          <>
            <div className="report-banner">
              <div>
                <h2>{reportTitle}</h2>
                <p>{reportDescription}</p>
              </div>

              <div className="report-id">
                Project #{selectedProject.id}
              </div>
            </div>

            <div className="report-stats">
              <div className="stat-card">
                <div className="stat-label">Project Status</div>
                <div className="stat-value">
                  <span className={`status-badge ${statusClass}`}>
                    {status}
                  </span>
                </div>
                <div className="stat-subtext">
                  Current implementation status
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Completion</div>
                <div className="stat-value">
                  {completion.toFixed(0)}%
                </div>
                <div className="stat-subtext">
                  Reported project progress
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Sanctioned Budget</div>
                <div className="stat-value">
                  {formatBudget(budget)}
                </div>
                <div className="stat-subtext">
                  Project-specific sanctioned amount
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Report Date</div>
                <div className="stat-value">
                  {formatDate(
                    report?.created_at ||
                      report?.updated_at ||
                      selectedProject?.created_at,
                  )}
                </div>
                <div className="stat-subtext">
                  Latest available project record
                </div>
              </div>
            </div>

            <div className="report-grid">
              <div className="report-card">
                <h3 className="card-title">
                  Project Progress
                </h3>

                <div className="progress-header">
                  <span className="progress-label">
                    Overall completion
                  </span>
                  <span className="progress-value">
                    {completion.toFixed(0)}%
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, completion),
                      )}%`,
                    }}
                  />
                </div>

                <div style={{ marginTop: '24px' }}>
                  <h3 className="card-title">
                    Report Summary
                  </h3>

                  <p className="summary-text">
                    {report?.summary ||
                      report?.description ||
                      selectedProject.description ||
                      'No detailed report summary is available for this project yet. Project status, completion percentage, budget and location are shown from the current project record.'}
                  </p>
                </div>
              </div>

              <div className="report-card">
                <h3 className="card-title">
                  Project Information
                </h3>

                <div className="info-list">
                  <div className="info-row">
                    <span className="info-label">Project ID</span>
                    <span className="info-value">
                      #{selectedProject.id}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Project Name</span>
                    <span className="info-value">
                      {selectedProject.name}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Location</span>
                    <span className="info-value">
                      {location}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Status</span>
                    <span className="info-value">
                      {status}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Budget</span>
                    <span className="info-value">
                      {formatBudget(budget)}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Created</span>
                    <span className="info-value">
                      {formatDate(selectedProject.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="report-card" style={{ marginBottom: '20px' }}>
              <h3 className="card-title">
                Monitoring Notes
              </h3>

              <p className="summary-text">
                This report uses the selected project's current
                information from the MPLAD-Guard backend. As more
                monitoring, verification, risk and progress records
                are added, this section can be expanded into a full
                downloadable project report.
              </p>
            </div>

            <div className="report-footer">
              <span>
                <strong>MPLAD-Guard</strong> · Project Monitoring &
                Risk Analysis System
              </span>

              <span>
                Report generated from live project data
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Reports