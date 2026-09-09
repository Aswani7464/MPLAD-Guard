import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/global.css'
import { apiRequest } from '../services/api'

const activities = [
  {
    type: 'success',
    title: 'Project monitoring updated',
    description: 'Latest project information has been synchronized.',
    time: 'Recently',
  },
  {
    type: 'info',
    title: 'Project registry',
    description: 'All registered MPLADS projects are available in Projects.',
    time: 'System',
  },
  {
    type: 'warning',
    title: 'Risk monitoring',
    description: 'Projects requiring attention are highlighted automatically.',
    time: 'System',
  },
  {
    type: 'success',
    title: 'Location monitoring',
    description: 'Project GPS coordinates are displayed when available.',
    time: 'System',
  },
]

function getProjectRisk(project) {
  const progress = Number(project.completion_percentage || 0)

  if (project.status?.toLowerCase() === 'completed') {
    return 'Low'
  }

  if (progress < 30) {
    return 'High'
  }

  if (progress < 60) {
    return 'Medium'
  }

  return 'Low'
}

function isActiveProject(project) {
  const status = String(project.status || '').toLowerCase()

  return (
    status === 'active' ||
    status === 'in progress' ||
    status === 'proposed' ||
    status === 'ongoing' ||
    status === 'delayed'
  )
}

function Dashboard() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        setError('')

        const projectsData = await apiRequest('/projects/')

        const realProjects = Array.isArray(projectsData)
          ? projectsData
          : []

        setProjects(realProjects)
      } catch (err) {
        console.error('Dashboard loading error:', err)

        setError(
          'Unable to connect to the project database. Please make sure the FastAPI backend is running.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  /*
   * EVERYTHING BELOW IS CALCULATED FROM THE REAL
   * PROJECT DATA RECEIVED FROM SUPABASE.
   */

  const totalProjects = projects.length

  const activeProjects = projects.filter(
    (project) => isActiveProject(project)
  ).length

  const highRiskProjects = projects.filter(
    (project) => getProjectRisk(project) === 'High'
  ).length

  const completedProjects = projects.filter(
    (project) =>
      String(project.status || '').toLowerCase() === 'completed'
  ).length

  const stats = [
    {
      label: 'Total Projects',
      value: loading ? '...' : totalProjects,
      change: 'LIVE',
      icon: '▣',
      type: 'blue',
    },
    {
      label: 'Active Projects',
      value: loading ? '...' : activeProjects,
      change: 'LIVE',
      icon: '◉',
      type: 'green',
    },
    {
      label: 'High Risk Projects',
      value: loading ? '...' : highRiskProjects,
      change: 'MONITORED',
      icon: '⚠',
      type: 'orange',
    },
    {
      label: 'Completed Projects',
      value: loading ? '...' : completedProjects,
      change: 'LIVE',
      icon: '✓',
      type: 'purple',
    },
  ]

  /*
   * Use only real projects from the database.
   * No hard-coded project names.
   */
  const recentProjects = [...projects]
    .sort((a, b) => {
      return (
        new Date(b.created_at || 0) -
        new Date(a.created_at || 0)
      )
    })
    .slice(0, 6)

  /*
   * Real project progress data for the chart.
   */
  const chartProjects = [...projects]
    .slice(0, 7)
    .reverse()

  return (
    <div className="dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="sidebar-brand">

          <div className="brand-logo">
            M
          </div>

          <div>
            <h2>MPLAD-Guard</h2>
            <span>Monitoring System</span>
          </div>

        </div>

        <nav className="sidebar-nav">

          <div className="nav-section-title">
            MAIN MENU
          </div>

          <a
            href="#"
            className="active"
            onClick={(event) => {
              event.preventDefault()
              navigate('/dashboard')
            }}
          >
            <span className="nav-icon">▦</span>
            Dashboard
          </a>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              navigate('/projects')
            }}
          >
            <span className="nav-icon">▣</span>
            Projects

            {!loading && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: '#eef2ff',
                  color: '#4f46e5',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {totalProjects}
              </span>
            )}
          </a>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              navigate('/risk')
            }}
          >
            <span className="nav-icon">⚠</span>
            Risk Analysis

            {!loading && highRiskProjects > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: '#fee2e2',
                  color: '#dc2626',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {highRiskProjects}
              </span>
            )}
          </a>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              navigate('/verification')
            }}
          >
            <span className="nav-icon">✓</span>
            Verification
          </a>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              navigate('/map')
            }}
          >
            <span className="nav-icon">⌖</span>
            Map View
          </a>

          <div className="nav-section-title">
            MANAGEMENT
          </div>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              navigate('/analytics')
            }}
          >
            <span className="nav-icon">▤</span>
            Analytics
          </a>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              navigate('/reports')
            }}
          >
            <span className="nav-icon">▧</span>
            Reports
          </a>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              navigate('/notifications')
            }}
          >
            <span className="nav-icon">◉</span>
            Notifications
          </a>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault()
              navigate('/profile')
            }}
          >
            <span className="nav-icon">⚙</span>
            Settings
          </a>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-help">

            <div className="help-icon">
              ?
            </div>

            <div>
              <strong>Need help?</strong>
              <span>View documentation</span>
            </div>

          </div>

        </div>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">

          <div className="header-left">

            <span className="breadcrumb">
              MPLAD-Guard
            </span>

            <span className="breadcrumb-arrow">
              /
            </span>

            <strong>
              Dashboard
            </strong>

          </div>

          <div className="header-right">

            <div className="search-box">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search projects..."
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    navigate('/projects')
                  }
                }}
              />

            </div>

            <button
              className="header-icon-button"
              onClick={() => navigate('/notifications')}
            >
              ◉
              <span className="notification-dot"></span>
            </button>

            <div
              className="profile-area"
              onClick={() => navigate('/profile')}
              style={{
                cursor: 'pointer',
              }}
            >

              <div className="profile-avatar">
                A
              </div>

              <div className="profile-info">

                <strong>
                  Administrator
                </strong>

                <span>
                  Admin
                </span>

              </div>

              <span className="profile-arrow">
                ⌄
              </span>

            </div>

          </div>

        </header>

        {/* ================= CONTENT ================= */}

        <section className="dashboard-content">

          {/* ================= WELCOME ================= */}

          <div className="welcome-banner">

            <div>

              <span className="welcome-label">
                GOVERNMENT PROJECT MONITORING
              </span>

              <h1>
                Project Monitoring Dashboard
              </h1>

              <p>
                Monitor MPLADS projects, track sanctioned funds,
                identify risks, and verify development progress
                from one place.
              </p>

            </div>

            <div className="welcome-action">

              <button
                className="primary-button"
                onClick={() => navigate('/projects')}
              >
                + Add New Project
              </button>

            </div>

          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div
              style={{
                padding: '15px 18px',
                marginBottom: '20px',
                borderRadius: '10px',
                background: '#fff7ed',
                border: '1px solid #fed7aa',
                color: '#9a3412',
                fontWeight: 600,
              }}
            >
              ⚠ {error}
            </div>
          )}

          {/* ================= STATISTICS ================= */}

          <div className="stats-grid">

            {stats.map((stat) => (

              <div
                className={'stat-card ' + stat.type}
                key={stat.label}
                onClick={() => {
                  if (
                    stat.label === 'Total Projects' ||
                    stat.label === 'Active Projects'
                  ) {
                    navigate('/projects')
                  }

                  if (
                    stat.label === 'High Risk Projects'
                  ) {
                    navigate('/risk')
                  }
                }}
                style={{
                  cursor:
                    stat.label === 'Completed Projects'
                      ? 'default'
                      : 'pointer',
                }}
              >

                <div className="stat-card-top">

                  <div className="stat-icon">
                    {stat.icon}
                  </div>

                  <span
                    className="stat-change"
                    style={{
                      fontSize: '10px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {stat.change}
                  </span>

                </div>

                <div className="stat-value">
                  {stat.value}
                </div>

                <div className="stat-label">
                  {stat.label}
                </div>

              </div>

            ))}

          </div>

          {/* ================= CHARTS ================= */}

          <div className="dashboard-grid-two">

            {/* PROJECT PROGRESS */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h3>
                    Project Progress
                  </h3>

                  <p>
                    Real completion percentage from project registry
                  </p>

                </div>

                <button
                  className="card-menu"
                  onClick={() => navigate('/projects')}
                >
                  •••
                </button>

              </div>

              <div className="progress-chart">

                <div className="chart-y-axis">

                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>

                </div>

                <div className="chart-area">

                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>
                  <div className="chart-grid-line"></div>

                  <div className="chart-bars">

                    {loading ? (

                      <div
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          padding: '80px 0',
                          color: '#94a3b8',
                        }}
                      >
                        Loading real project data...
                      </div>

                    ) : chartProjects.length === 0 ? (

                      <div
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          padding: '80px 0',
                          color: '#94a3b8',
                        }}
                      >
                        No project data available.
                      </div>

                    ) : (

                      chartProjects.map((project) => {

                        const progress = Math.min(
                          100,
                          Math.max(
                            0,
                            Number(
                              project.completion_percentage || 0
                            )
                          )
                        )

                        return (
                          <div
                            className="chart-column"
                            key={project.id}
                            title={`${project.name}: ${progress}%`}
                          >

                            <div
                              className="chart-bar"
                              style={{
                                height: `${progress}%`,
                              }}
                            ></div>

                            <span>
                              {progress}%
                            </span>

                          </div>
                        )
                      })

                    )}

                  </div>

                </div>

              </div>

            </div>

            {/* RISK OVERVIEW */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h3>
                    Risk Overview
                  </h3>

                  <p>
                    Current risk classification from project data
                  </p>

                </div>

                <button
                  className="card-menu"
                  onClick={() => navigate('/risk')}
                >
                  •••
                </button>

              </div>

              <div className="risk-overview">

                <div className="risk-donut">

                  <div className="donut-inner">

                    <strong>
                      {loading ? '...' : totalProjects}
                    </strong>

                    <span>
                      Projects
                    </span>

                  </div>

                </div>

                <div className="risk-legend">

                  <div className="legend-item">

                    <span className="legend-dot low"></span>

                    <div>
                      <strong>
                        Low Risk
                      </strong>

                      <span>
                        {
                          projects.filter(
                            (project) =>
                              getProjectRisk(project) === 'Low'
                          ).length
                        } projects
                      </span>
                    </div>

                    <b>
                      {totalProjects
                        ? Math.round(
                            (projects.filter(
                              (project) =>
                                getProjectRisk(project) === 'Low'
                            ).length /
                              totalProjects) *
                              100
                          )
                        : 0}
                      %
                    </b>

                  </div>

                  <div className="legend-item">

                    <span className="legend-dot medium"></span>

                    <div>
                      <strong>
                        Medium Risk
                      </strong>

                      <span>
                        {
                          projects.filter(
                            (project) =>
                              getProjectRisk(project) === 'Medium'
                          ).length
                        } projects
                      </span>
                    </div>

                    <b>
                      {totalProjects
                        ? Math.round(
                            (projects.filter(
                              (project) =>
                                getProjectRisk(project) === 'Medium'
                            ).length /
                              totalProjects) *
                              100
                          )
                        : 0}
                      %
                    </b>

                  </div>

                  <div className="legend-item">

                    <span className="legend-dot high"></span>

                    <div>
                      <strong>
                        High Risk
                      </strong>

                      <span>
                        {highRiskProjects} projects
                      </span>
                    </div>

                    <b>
                      {totalProjects
                        ? Math.round(
                            (highRiskProjects /
                              totalProjects) *
                              100
                          )
                        : 0}
                      %
                    </b>

                  </div>

                  <div className="legend-item">

                    <span className="legend-dot critical"></span>

                    <div>
                      <strong>
                        Completed
                      </strong>

                      <span>
                        {completedProjects} projects
                      </span>
                    </div>

                    <b>
                      {totalProjects
                        ? Math.round(
                            (completedProjects /
                              totalProjects) *
                              100
                          )
                        : 0}
                      %
                    </b>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================= RECENT PROJECTS ================= */}

          <div className="dashboard-card projects-card">

            <div className="card-header">

              <div>

                <h3>
                  Project Registry
                </h3>

                <p>
                  Real MPLADS projects currently registered in the system
                </p>

              </div>

              <button
                className="view-all-button"
                onClick={() => navigate('/projects')}
              >
                View All →
              </button>

            </div>

            <div className="project-table-wrapper">

              <table className="project-table">

                <thead>

                  <tr>

                    <th>
                      PROJECT
                    </th>

                    <th>
                      LOCATION
                    </th>

                    <th>
                      PROGRESS
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      RISK
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign: 'center',
                          padding: '40px',
                        }}
                      >
                        Loading real projects...
                      </td>

                    </tr>

                  ) : recentProjects.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign: 'center',
                          padding: '50px',
                        }}
                      >

                        <div
                          style={{
                            fontSize: '32px',
                            marginBottom: '10px',
                          }}
                        >
                          📁
                        </div>

                        <strong>
                          No projects registered yet
                        </strong>

                        <p
                          style={{
                            color: '#94a3b8',
                            marginTop: '6px',
                          }}
                        >
                          Add your first MPLADS project to begin monitoring.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    recentProjects.map((project) => {

                      const progress = Number(
                        project.completion_percentage || 0
                      )

                      const risk =
                        getProjectRisk(project)

                      let location =
                        'GPS location unavailable'

                      if (
                        project.latitude !== null &&
                        project.latitude !== undefined &&
                        project.longitude !== null &&
                        project.longitude !== undefined
                      ) {
                        location =
                          `${Number(
                            project.latitude
                          ).toFixed(4)}, ${Number(
                            project.longitude
                          ).toFixed(4)}`
                      }

                      return (

                        <tr
                          key={project.id}
                          onClick={() =>
                            navigate(
                              `/projects/${project.id}`
                            )
                          }
                          style={{
                            cursor: 'pointer',
                          }}
                        >

                          <td>

                            <div className="project-name">

                              <div className="project-avatar">
                                {project.name
                                  ? project.name.charAt(0).toUpperCase()
                                  : 'P'}
                              </div>

                              <strong>
                                {project.name}
                              </strong>

                            </div>

                          </td>

                          <td>

                            <span className="project-location">
                              ⌖ {location}
                            </span>

                          </td>

                          <td>

                            <div className="progress-cell">

                              <div className="progress-bar">

                                <div
                                  className="progress-fill"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      Math.max(0, progress)
                                    )}%`,
                                  }}
                                ></div>

                              </div>

                              <span>
                                {progress}%
                              </span>

                            </div>

                          </td>

                          <td>

                            <span
                              className={
                                'project-status status-' +
                                String(
                                  project.status || 'Proposed'
                                )
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')
                              }
                            >
                              {project.status || 'Proposed'}
                            </span>

                          </td>

                          <td>

                            <span
                              className={
                                'risk-status risk-' +
                                risk.toLowerCase()
                              }
                            >
                              {risk}
                            </span>

                          </td>

                          <td>

                            <button
                              className="table-action"
                              onClick={(event) => {
                                event.stopPropagation()

                                navigate(
                                  `/projects/${project.id}`
                                )
                              }}
                            >
                              View →
                            </button>

                          </td>

                        </tr>

                      )
                    })

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* ================= BOTTOM ================= */}

          <div className="dashboard-grid-two">

            {/* ACTIVITY */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h3>
                    Monitoring Activity
                  </h3>

                  <p>
                    MPLAD-Guard system status
                  </p>

                </div>

              </div>

              <div className="activity-list">

                {activities.map((activity) => (

                  <div
                    className="activity-item"
                    key={activity.title}
                  >

                    <div
                      className={
                        'activity-icon ' +
                        activity.type
                      }
                    >
                      {activity.type === 'success'
                        ? '✓'
                        : activity.type === 'warning'
                        ? '!'
                        : 'i'}
                    </div>

                    <div className="activity-content">

                      <strong>
                        {activity.title}
                      </strong>

                      <span>
                        {activity.description}
                      </span>

                      <small>
                        {activity.time}
                      </small>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* QUICK ACTIONS */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <h3>
                    Quick Actions
                  </h3>

                  <p>
                    Project monitoring tools
                  </p>

                </div>

              </div>

              <div className="quick-actions">

                <button
                  className="quick-action"
                  onClick={() =>
                    navigate('/projects')
                  }
                >

                  <span className="quick-icon blue">
                    +
                  </span>

                  <div>
                    <strong>
                      Project Registry
                    </strong>

                    <span>
                      View all real projects
                    </span>
                  </div>

                  <b>
                    →
                  </b>

                </button>

                <button
                  className="quick-action"
                  onClick={() =>
                    navigate('/risk')
                  }
                >

                  <span className="quick-icon orange">
                    ⚠
                  </span>

                  <div>
                    <strong>
                      Risk Analysis
                    </strong>

                    <span>
                      Review project risks
                    </span>
                  </div>

                  <b>
                    →
                  </b>

                </button>

                <button
                  className="quick-action"
                  onClick={() =>
                    navigate('/verification')
                  }
                >

                  <span className="quick-icon green">
                    ✓
                  </span>

                  <div>
                    <strong>
                      Verification
                    </strong>

                    <span>
                      Verify project evidence
                    </span>
                  </div>

                  <b>
                    →
                  </b>

                </button>

                <button
                  className="quick-action"
                  onClick={() =>
                    navigate('/map')
                  }
                >

                  <span className="quick-icon purple">
                    ⌖
                  </span>

                  <div>
                    <strong>
                      Project Map
                    </strong>

                    <span>
                      View real GPS locations
                    </span>
                  </div>

                  <b>
                    →
                  </b>

                </button>

              </div>

            </div>

          </div>

        </section>

        {/* ================= FOOTER ================= */}

        <footer className="dashboard-footer">

          <span>
            © 2026 MPLAD-Guard
          </span>

          <span>
            Project Monitoring & Risk Analysis System
          </span>

        </footer>

      </main>

    </div>
  )
}

export default Dashboard