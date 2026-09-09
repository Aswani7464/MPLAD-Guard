import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest } from '../services/api'
import MapView from '../components/map/MapView'
import BackToDashboard from '../components/common/BackToDashboard'

function ProjectDetails() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    budget: '',
    status: 'Proposed',
    completion_percentage: 0,
    location: '',
    latitude: null,
    longitude: null,
  })

  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')

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
      console.error(err)
      setError(err.message || 'Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function getCurrentLocation() {
    setGpsError('')
    setGpsLoading(true)

    if (!navigator.geolocation) {
      setGpsError(
        'Geolocation is not supported by this browser.'
      )
      setGpsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        setForm((previous) => ({
          ...previous,
          latitude,
          longitude,
          location: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        }))

        setGpsLoading(false)
      },
      (err) => {
        console.error(err)

        let message =
          'Unable to get your current GPS location.'

        if (err.code === 1) {
          message =
            'Location permission was denied. Please allow location access.'
        }

        if (err.code === 2) {
          message =
            'Your location could not be determined.'
        }

        if (err.code === 3) {
          message =
            'Location request timed out. Please try again.'
        }

        setGpsError(message)
        setGpsLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (!form.name.trim()) {
      setError('Please enter the project name.')
      return
    }

    if (!form.budget || Number(form.budget) <= 0) {
      setError(
        'Please enter the sanctioned amount for this project.'
      )
      return
    }

    if (
      form.latitude === null ||
      form.longitude === null
    ) {
      setError(
        'Please get the real GPS location before sanctioning the project.'
      )
      return
    }

    try {
      setSaving(true)

      const projectData = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        location: form.location,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        budget: Number(form.budget),
        status: form.status,
        completion_percentage: Number(
          form.completion_percentage
        ),
      }

      const response = await apiRequest('/projects/', {
        method: 'POST',
        body: JSON.stringify(projectData),
      })

      console.log('Project created:', response)

      setSuccess(
        'Project sanctioned successfully and saved to the database.'
      )

      setForm({
        name: '',
        description: '',
        budget: '',
        status: 'Proposed',
        completion_percentage: 0,
        location: '',
        latitude: null,
        longitude: null,
      })

      setShowForm(false)

      await loadProjects()
    } catch (err) {
      console.error('Project creation error:', err)

      setError(
        err.message ||
          'Unable to sanction the project.'
      )
    } finally {
      setSaving(false)
    }
  }

  function getRisk(project) {
    const progress = Number(
      project.completion_percentage || 0
    )

    if (project.status === 'Completed') {
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

  function getRiskClass(risk) {
    if (risk === 'High') return 'risk-high'
    if (risk === 'Medium') return 'risk-medium'
    return 'risk-low'
  }

  function getStatusClass(status) {
    if (status === 'Completed') {
      return 'status-completed'
    }

    if (status === 'Ongoing') {
      return 'status-ongoing'
    }

    return 'status-proposed'
  }

  function formatMoney(amount) {
    const value = Number(amount || 0)

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const totalSanctioned = projects.reduce(
    (total, project) =>
      total + Number(project.budget || 0),
    0
  )

  const activeProjects = projects.filter(
    (project) =>
      project.status !== 'Completed'
  ).length

  const completedProjects = projects.filter(
    (project) =>
      project.status === 'Completed'
  ).length

  const highRiskProjects = projects.filter(
    (project) =>
      getRisk(project) === 'High'
  ).length

  return (
    <div className="projects-page">
      <BackToDashboard />

      {/* =========================
          HEADER
      ========================== */}
      <header className="projects-header">
        <div>
          <div className="header-eyebrow">
            MPLAD-GUARD • MONITORING MODULE
          </div>

          <h1>
            MPLADS Project Registry
          </h1>

          <p>
            Search, monitor and manage real MPLADS
            projects with location, sanctioned amount,
            progress and risk information.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-button"
            onClick={loadProjects}
          >
            ↻ Refresh
          </button>

          <button
            className="primary-button"
            onClick={() => {
              setShowForm(true)
              setError('')
              setSuccess('')
            }}
          >
            + Sanction New Project
          </button>
        </div>
      </header>

      {/* =========================
          MESSAGES
      ========================== */}

      {error && (
        <div className="message error-message">
          <strong>⚠ Error</strong>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="message success-message">
          <strong>✓ Success</strong>
          <span>{success}</span>
        </div>
      )}

      {/* =========================
          KPI CARDS
      ========================== */}

      <section className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon blue">
            ◫
          </div>

          <div>
            <span>Total Projects</span>
            <strong>
              {loading ? '...' : projects.length}
            </strong>
            <small>
              Real records in portal
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            ●
          </div>

          <div>
            <span>Active Projects</span>
            <strong>
              {loading ? '...' : activeProjects}
            </strong>
            <small>
              Not marked completed
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            ₹
          </div>

          <div>
            <span>Total Sanctioned</span>
            <strong className="money-value">
              {loading
                ? '...'
                : formatMoney(totalSanctioned)}
            </strong>
            <small>
              Based on project records
            </small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            !
          </div>

          <div>
            <span>High Risk</span>
            <strong>
              {loading ? '...' : highRiskProjects}
            </strong>
            <small>
              Monitoring attention required
            </small>
          </div>
        </div>

      </section>

      {/* =========================
          PROJECT REGISTRY
      ========================== */}

      <section className="registry-card">

        <div className="registry-heading">
          <div>
            <h2>
              All Registered Projects
            </h2>

            <p>
              {loading
                ? 'Loading project records...'
                : `${projects.length} real project record${
                    projects.length === 1 ? '' : 's'
                  } available`}
            </p>
          </div>

          <div className="registry-status">
            <span className="live-dot"></span>
            DATABASE CONNECTED
          </div>
        </div>

        {loading ? (
          <div className="empty-box">
            <div className="loader"></div>
            <p>Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-box">
            <div className="empty-icon">
              ◫
            </div>

            <h3>
              No projects found
            </h3>

            <p>
              No project records are currently
              available in the database.
            </p>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              + Sanction First Project
            </button>
          </div>
        ) : (
          <div className="project-grid">

            {projects.map((project) => {
              const risk = getRisk(project)
              const progress = Number(
                project.completion_percentage || 0
              )

              return (
                <article
                  className="project-card"
                  key={project.id}
                >

                  <div className="project-top">

                    <div className="project-id">
                      PROJECT #
                      {project.id}
                    </div>

                    <div className="badge-row">

                      <span
                        className={`status-badge ${getStatusClass(
                          project.status
                        )}`}
                      >
                        {project.status ||
                          'Proposed'}
                      </span>

                      <span
                        className={`risk-badge ${getRiskClass(
                          risk
                        )}`}
                      >
                        {risk} Risk
                      </span>

                    </div>

                  </div>

                  <h3>
                    {project.name}
                  </h3>

                  <p className="project-description">
                    {project.description ||
                      'No project description available.'}
                  </p>

                  <div className="project-location">

                    <span className="location-icon">
                      📍
                    </span>

                    <div>
                      <small>
                        PROJECT LOCATION
                      </small>

                      <strong>
                        {project.location ||
                          'Location not available'}
                      </strong>
                    </div>

                  </div>

                  <div className="project-finance">

                    <div>
                      <small>
                        SANCTIONED AMOUNT
                      </small>

                      <strong>
                        {formatMoney(
                          project.budget
                        )}
                      </strong>
                    </div>

                    <div>
                      <small>
                        PROJECT ID
                      </small>

                      <strong>
                        MPLAD-{project.id}
                      </strong>
                    </div>

                  </div>

                  <div className="progress-section">

                    <div className="progress-header">

                      <span>
                        Physical Progress
                      </span>

                      <strong>
                        {progress}%
                      </strong>

                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(
                            Math.max(progress, 0),
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>

                  </div>

                  {project.latitude !==
                    null &&
                    project.latitude !==
                      undefined &&
                    project.longitude !==
                      null &&
                    project.longitude !==
                      undefined && (
                      <div className="mini-map">

                        <MapView
                          latitude={Number(
                            project.latitude
                          )}
                          longitude={Number(
                            project.longitude
                          )}
                          height="180px"
                        />

                      </div>
                    )}

                  <div className="project-footer">

                    <div className="gps-status">
                      {project.latitude !==
                        null &&
                      project.latitude !==
                        undefined &&
                      project.longitude !==
                        null &&
                      project.longitude !==
                        undefined ? (
                        <>
                          <span className="gps-good">
                            ●
                          </span>
                          GPS available
                        </>
                      ) : (
                        <>
                          <span className="gps-none">
                            ●
                          </span>
                          GPS unavailable
                        </>
                      )}
                    </div>

                    <Link
                      to={`/projects/${project.id}`}
                      className="details-button"
                    >
                      View Details →
                    </Link>

                  </div>

                </article>
              )
            })}

          </div>
        )}

      </section>

      {/* =========================
          SANCTION MODAL
      ========================== */}

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving
            ) {
              setShowForm(false)
            }
          }}
        >

          <div className="sanction-modal">

            <div className="modal-header">

              <div>
                <div className="modal-eyebrow">
                  MPLADS WORK SANCTION
                </div>

                <h2>
                  Sanction New Project
                </h2>

                <p>
                  Enter the official project details
                  and capture its real GPS location.
                </p>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  !saving &&
                  setShowForm(false)
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="sanction-form"
            >

              {/* PROJECT INFORMATION */}

              <div className="form-section">

                <div className="form-section-title">
                  01 • Project Information
                </div>

                <div className="form-grid">

                  <div className="form-field full">
                    <label>
                      Project Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter official project name"
                      required
                    />
                  </div>

                  <div className="form-field full">
                    <label>
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Enter official project description"
                      rows="4"
                    />
                  </div>

                </div>

              </div>

              {/* FINANCIAL INFORMATION */}

              <div className="form-section">

                <div className="form-section-title">
                  02 • Financial & Status Information
                </div>

                <div className="form-grid">

                  <div className="form-field">

                    <label>
                      Sanctioned Amount (₹) *
                    </label>

                    <input
                      type="number"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      placeholder="Enter sanctioned amount"
                      min="1"
                      step="0.01"
                      required
                    />

                    <small>
                      Enter the amount officially
                      sanctioned for this project.
                    </small>

                  </div>

                  <div className="form-field">

                    <label>
                      Status
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option value="Proposed">
                        Proposed
                      </option>

                      <option value="Ongoing">
                        Ongoing
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>

                  </div>

                  <div className="form-field">

                    <label>
                      Physical Progress (%)
                    </label>

                    <input
                      type="number"
                      name="completion_percentage"
                      value={
                        form.completion_percentage
                      }
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="1"
                    />

                  </div>

                </div>

              </div>

              {/* LOCATION */}

              <div className="form-section">

                <div className="form-section-title">
                  03 • Real GPS Location
                </div>

                <div className="gps-panel">

                  <div className="gps-panel-icon">
                    📍
                  </div>

                  <div className="gps-panel-content">

                    <h3>
                      Capture Current GPS
                    </h3>

                    <p>
                      MPLAD-Guard will use your
                      device's real GPS coordinates.
                      No location will be invented.
                    </p>

                    {form.latitude !==
                      null &&
                      form.longitude !==
                        null && (
                        <div className="coordinates">
                          <span>
                            Latitude:{' '}
                            {Number(
                              form.latitude
                            ).toFixed(6)}
                          </span>

                          <span>
                            Longitude:{' '}
                            {Number(
                              form.longitude
                            ).toFixed(6)}
                          </span>
                        </div>
                      )}

                    {gpsError && (
                      <div className="gps-error">
                        {gpsError}
                      </div>
                    )}

                  </div>

                  <button
                    type="button"
                    className="gps-button"
                    onClick={
                      getCurrentLocation
                    }
                    disabled={gpsLoading}
                  >
                    {gpsLoading
                      ? 'Locating...'
                      : form.latitude !== null
                        ? 'Update GPS'
                        : 'Get GPS Location'}
                  </button>

                </div>

                {form.latitude !==
                  null &&
                  form.longitude !==
                    null && (
                    <div className="form-map">

                      <MapView
                        latitude={Number(
                          form.latitude
                        )}
                        longitude={Number(
                          form.longitude
                        )}
                        height="260px"
                      />

                    </div>
                  )}

              </div>

              {/* ACTIONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    !saving &&
                    setShowForm(false)
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button sanction-submit"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving Project...'
                    : '✓ Sanction & Save Project'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        .projects-page {
          min-height: 100vh;
          background: #f4f7fb;
          color: #172033;
          padding: 32px;
          font-family: Inter, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .projects-header {
          max-width: 1500px;
          margin: 0 auto 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
        }

        .header-eyebrow,
        .modal-eyebrow {
          color: #16834a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }

        .projects-header h1 {
          margin: 0;
          font-size: 32px;
          line-height: 1.15;
          color: #10213b;
          letter-spacing: -0.7px;
        }

        .projects-header p {
          margin: 10px 0 0;
          max-width: 760px;
          color: #68758a;
          font-size: 14px;
          line-height: 1.6;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }

        button {
          font: inherit;
        }

        .primary-button,
        .secondary-button,
        .details-button,
        .gps-button,
        .cancel-button {
          border-radius: 9px;
          padding: 11px 16px;
          font-size: 13px;
          font-weight: 750;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .primary-button {
          border: 1px solid #16834a;
          background: #16834a;
          color: white;
          box-shadow: 0 5px 15px rgba(22,131,74,.16);
        }

        .primary-button:hover {
          background: #106b3b;
          transform: translateY(-1px);
        }

        .secondary-button {
          border: 1px solid #d8e0eb;
          background: white;
          color: #26344a;
        }

        .secondary-button:hover {
          border-color: #9eacbf;
          background: #f8fafc;
        }

        .message {
          max-width: 1500px;
          margin: 0 auto 18px;
          padding: 13px 16px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }

        .error-message {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #9f1239;
        }

        .success-message {
          background: #ecfdf5;
          border: 1px solid #bbf7d0;
          color: #166534;
        }

        .stats-grid {
          max-width: 1500px;
          margin: 0 auto 22px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          padding: 20px;
          display: flex;
          gap: 15px;
          align-items: center;
          min-width: 0;
          box-shadow: 0 3px 12px rgba(15,23,42,.035);
        }

        .stat-icon {
          width: 46px;
          height: 46px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 21px;
          font-weight: 800;
          flex-shrink: 0;
        }

        .stat-icon.blue {
          background: #eaf2ff;
          color: #2563eb;
        }

        .stat-icon.green {
          background: #e9f9f0;
          color: #16834a;
        }

        .stat-icon.purple {
          background: #f2edff;
          color: #7c3aed;
        }

        .stat-icon.orange {
          background: #fff4e8;
          color: #ea580c;
        }

        .stat-card span {
          display: block;
          color: #718096;
          font-size: 12px;
          font-weight: 650;
          margin-bottom: 5px;
        }

        .stat-card strong {
          display: block;
          color: #14213a;
          font-size: 25px;
          line-height: 1.1;
        }

        .stat-card small {
          display: block;
          margin-top: 5px;
          color: #9aa5b5;
          font-size: 10px;
        }

        .money-value {
          font-size: 20px !important;
        }

        .registry-card {
          max-width: 1500px;
          margin: 0 auto;
          background: white;
          border: 1px solid #e1e7ef;
          border-radius: 15px;
          box-shadow: 0 4px 18px rgba(15,23,42,.035);
          overflow: hidden;
        }

        .registry-heading {
          padding: 22px 24px;
          border-bottom: 1px solid #e8edf3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .registry-heading h2 {
          margin: 0;
          font-size: 18px;
          color: #15233a;
        }

        .registry-heading p {
          margin: 5px 0 0;
          color: #8490a1;
          font-size: 12px;
        }

        .registry-status {
          color: #637084;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .7px;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          background: #16a34a;
          border-radius: 50%;
          box-shadow: 0 0 0 4px #dcfce7;
        }

        .project-grid {
          padding: 22px;
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(330px, 1fr)
          );
          gap: 18px;
        }

        .project-card {
          min-width: 0;
          border: 1px solid #e1e7ef;
          border-radius: 13px;
          padding: 18px;
          background: #fff;
          transition: .2s ease;
          overflow: hidden;
        }

        .project-card:hover {
          border-color: #b9c8dc;
          box-shadow: 0 10px 25px rgba(15,23,42,.07);
          transform: translateY(-2px);
        }

        .project-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .project-id {
          color: #8793a5;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .7px;
        }

        .badge-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        .status-badge,
        .risk-badge {
          padding: 5px 8px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 800;
        }

        .status-proposed {
          background: #eef2ff;
          color: #4f46e5;
        }

        .status-ongoing {
          background: #ecfdf5;
          color: #15803d;
        }

        .status-completed {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .risk-high {
          background: #fff1f2;
          color: #dc2626;
        }

        .risk-medium {
          background: #fff7ed;
          color: #ea580c;
        }

        .risk-low {
          background: #ecfdf5;
          color: #15803d;
        }

        .project-card h3 {
          margin: 15px 0 7px;
          color: #14213a;
          font-size: 17px;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .project-description {
          color: #718096;
          font-size: 12px;
          line-height: 1.6;
          min-height: 39px;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .project-location {
          margin-top: 15px;
          padding: 12px;
          border-radius: 9px;
          background: #f7f9fc;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .location-icon {
          font-size: 16px;
        }

        .project-location small,
        .project-finance small {
          display: block;
          color: #8b97a8;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .6px;
          margin-bottom: 4px;
        }

        .project-location strong {
          display: block;
          color: #334155;
          font-size: 11px;
          line-height: 1.4;
          overflow-wrap: anywhere;
        }

        .project-finance {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 14px;
        }

        .project-finance > div {
          padding: 11px;
          border: 1px solid #e8edf3;
          border-radius: 9px;
          min-width: 0;
        }

        .project-finance strong {
          display: block;
          color: #17243a;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .progress-section {
          margin-top: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 7px;
          font-size: 11px;
          color: #718096;
        }

        .progress-header strong {
          color: #17243a;
        }

        .progress-track {
          height: 7px;
          background: #e8edf3;
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #16834a;
          border-radius: inherit;
          transition: width .3s ease;
        }

        .mini-map {
          margin-top: 14px;
          overflow: hidden;
          border-radius: 9px;
        }

        .project-footer {
          margin-top: 14px;
          padding-top: 13px;
          border-top: 1px solid #edf1f5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .gps-status {
          color: #748195;
          font-size: 10px;
          font-weight: 700;
        }

        .gps-good {
          color: #16a34a;
          margin-right: 5px;
        }

        .gps-none {
          color: #94a3b8;
          margin-right: 5px;
        }

        .details-button {
          background: #10213b;
          color: white;
          text-decoration: none;
          padding: 9px 12px;
          font-size: 11px;
        }

        .details-button:hover {
          background: #1c3557;
        }

        .empty-box {
          min-height: 330px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          padding: 40px;
          color: #7a8799;
        }

        .empty-icon {
          font-size: 40px;
          margin-bottom: 12px;
          opacity: .45;
        }

        .empty-box h3 {
          color: #26344a;
          margin: 5px 0;
        }

        .empty-box p {
          font-size: 13px;
          margin: 4px 0 18px;
        }

        .loader {
          width: 32px;
          height: 32px;
          border: 3px solid #dbe4ee;
          border-top-color: #16834a;
          border-radius: 50%;
          animation: spin .8s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* MODAL */

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(8, 20, 37, .62);
          backdrop-filter: blur(5px);
          z-index: 5000;
          padding: 24px;
          overflow-y: auto;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .sanction-modal {
          width: min(900px, 100%);
          margin: 20px auto;
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 25px 70px rgba(0,0,0,.25);
        }

        .modal-header {
          background: #10213b;
          color: white;
          padding: 25px 28px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .modal-header .modal-eyebrow {
          color: #4ade80;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .modal-header p {
          margin: 7px 0 0;
          color: #b8c5d7;
          font-size: 12px;
          line-height: 1.5;
        }

        .close-button {
          width: 34px;
          height: 34px;
          border: 1px solid rgba(255,255,255,.2);
          background: rgba(255,255,255,.08);
          color: white;
          border-radius: 8px;
          font-size: 23px;
          line-height: 1;
          cursor: pointer;
          flex-shrink: 0;
        }

        .sanction-form {
          padding: 26px;
        }

        .form-section {
          margin-bottom: 25px;
        }

        .form-section-title {
          font-size: 11px;
          font-weight: 850;
          color: #16834a;
          letter-spacing: 1px;
          margin-bottom: 13px;
          padding-bottom: 9px;
          border-bottom: 1px solid #e7edf3;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-field {
          min-width: 0;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .form-field label {
          display: block;
          margin-bottom: 6px;
          color: #334155;
          font-size: 11px;
          font-weight: 800;
        }

        .form-field input,
        .form-field textarea,
        .form-field select {
          width: 100%;
          border: 1px solid #d9e1eb;
          border-radius: 8px;
          background: #fff;
          color: #172033;
          padding: 11px 12px;
          font: inherit;
          font-size: 12px;
          outline: none;
        }

        .form-field textarea {
          resize: vertical;
          min-height: 90px;
        }

        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
          border-color: #16834a;
          box-shadow: 0 0 0 3px rgba(22,131,74,.1);
        }

        .form-field small {
          display: block;
          color: #8a96a7;
          font-size: 9px;
          margin-top: 5px;
          line-height: 1.4;
        }

        .gps-panel {
          padding: 17px;
          background: #f5f9f7;
          border: 1px solid #d8eee1;
          border-radius: 11px;
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .gps-panel-icon {
          width: 45px;
          height: 45px;
          border-radius: 10px;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }

        .gps-panel-content {
          flex: 1;
          min-width: 0;
        }

        .gps-panel-content h3 {
          margin: 0;
          color: #17352a;
          font-size: 14px;
        }

        .gps-panel-content p {
          margin: 4px 0;
          color: #708175;
          font-size: 10px;
          line-height: 1.5;
        }

        .coordinates {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          color: #166534;
          font-size: 10px;
          font-weight: 750;
        }

        .gps-error {
          margin-top: 6px;
          color: #b91c1c;
          font-size: 10px;
        }

        .gps-button {
          border: 1px solid #16834a;
          background: white;
          color: #16834a;
          white-space: nowrap;
        }

        .gps-button:hover:not(:disabled) {
          background: #16834a;
          color: white;
        }

        .gps-button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .form-map {
          margin-top: 13px;
          border-radius: 11px;
          overflow: hidden;
        }

        .modal-actions {
          padding-top: 18px;
          border-top: 1px solid #e7edf3;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .cancel-button {
          border: 1px solid #d7dee8;
          background: white;
          color: #526074;
        }

        .cancel-button:hover:not(:disabled) {
          background: #f7f9fb;
        }

        .sanction-submit:disabled {
          opacity: .6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 1000px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .projects-header {
            flex-direction: column;
          }

          .header-actions {
            width: 100%;
          }
        }

        @media (max-width: 700px) {
          .projects-page {
            padding: 16px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .project-grid {
            grid-template-columns: 1fr;
            padding: 14px;
          }

          .registry-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full {
            grid-column: auto;
          }

          .gps-panel {
            align-items: flex-start;
            flex-direction: column;
          }

          .gps-button {
            width: 100%;
          }

          .header-actions {
            flex-direction: column;
          }

          .header-actions button {
            width: 100%;
          }

          .modal-backdrop {
            padding: 10px;
          }

          .sanction-form {
            padding: 18px;
          }
        }
      `}</style>
    </div>
  )
}

export default ProjectDetails