import { useEffect, useMemo, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { apiRequest } from '../services/api.js'
import BackToDashboard from '../components/common/BackToDashboard'

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const INDIA_CENTER = [22.5937, 78.9629]

function formatAmount(amount) {
  const value = Number(amount || 0)

  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`
  }

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} Lakh`
  }

  return `₹${value.toLocaleString('en-IN')}`
}

function getStatusClass(status) {
  const value = String(status || 'Proposed').toLowerCase()

  if (value.includes('complete')) return 'complete'
  if (value.includes('progress')) return 'progress'
  if (value.includes('delay')) return 'delayed'

  return 'proposed'
}

function MapFocus({ project }) {
  const map = useMap()

  useEffect(() => {
    if (
      project &&
      project.latitude !== null &&
      project.latitude !== undefined &&
      project.longitude !== null &&
      project.longitude !== undefined
    ) {
      map.flyTo(
        [
          Number(project.latitude),
          Number(project.longitude),
        ],
        15,
        {
          duration: 1.2,
        }
      )
    }
  }, [project, map])

  return null
}

function MapDashboard() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [search, setSearch] = useState('')
  const [mapMode, setMapMode] = useState('satellite')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true)
        setError('')

        const data = await apiRequest('/projects/')

        const realProjects = Array.isArray(data)
          ? data
          : []

        setProjects(realProjects)

        const firstProjectWithGPS =
          realProjects.find(
            (project) =>
              project.latitude !== null &&
              project.latitude !== undefined &&
              project.longitude !== null &&
              project.longitude !== undefined
          )

        if (firstProjectWithGPS) {
          setSelectedProject(firstProjectWithGPS)
        }
      } catch (err) {
        console.error('Satellite project loading error:', err)

        setError(
          err?.message ||
            'Unable to load projects from the backend.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return projects
    }

    return projects.filter((project) => {
      return (
        String(project.name || '')
          .toLowerCase()
          .includes(query) ||
        String(project.location || '')
          .toLowerCase()
          .includes(query) ||
        String(project.description || '')
          .toLowerCase()
          .includes(query) ||
        String(project.status || '')
          .toLowerCase()
          .includes(query)
      )
    })
  }, [projects, search])

  const projectsWithGPS = useMemo(() => {
    return projects.filter(
      (project) =>
        project.latitude !== null &&
        project.latitude !== undefined &&
        project.longitude !== null &&
        project.longitude !== undefined
    )
  }, [projects])

  const totalSanctioned = useMemo(() => {
    return projects.reduce(
      (total, project) =>
        total + Number(project.budget || 0),
      0
    )
  }, [projects])

  const averageProgress = useMemo(() => {
    if (!projects.length) return 0

    const total = projects.reduce(
      (sum, project) =>
        sum +
        Number(project.completion_percentage || 0),
      0
    )

    return Math.round(total / projects.length)
  }, [projects])

  const selectProject = (project) => {
    setSelectedProject(project)
  }

  return (
    <div className="mplad-gis-page">
      <BackToDashboard />

      {/* PAGE HEADER */}
      <section className="gis-header">

        <div className="gis-title-area">

          <div className="gis-title-row">

            <span className="gis-title-icon">
              🛰️
            </span>

            <h1>
              All-India Satellite GIS & Project
              Evaluation System
            </h1>

            <span className="gis-chip">
              ISRO Cartosat • Sentinel-2 Orbit
            </span>

          </div>

          <p>
            Monitor and evaluate real MPLADS development
            projects using their registered GPS locations,
            sanctioned amounts, project progress, and
            ground-truth information.
          </p>

        </div>

        <div className="gis-view-switcher">

          <button
            className={
              mapMode === 'satellite'
                ? 'gis-view-button active'
                : 'gis-view-button'
            }
            onClick={() => setMapMode('satellite')}
          >
            🛰️
            <span>
              Satellite
            </span>
          </button>

          <button
            className={
              mapMode === 'map'
                ? 'gis-view-button active'
                : 'gis-view-button'
            }
            onClick={() => setMapMode('map')}
          >
            🌐
            <span>
              Road Map
            </span>
          </button>

        </div>

      </section>


      {/* ERROR */}
      {error && (
        <div className="gis-error">
          <strong>
            Unable to load project data
          </strong>

          <span>
            {error}
          </span>
        </div>
      )}


      {/* REAL DATABASE STATISTICS */}
      <section className="gis-stats">

        <div className="gis-stat-card">

          <div className="gis-stat-top">
            <span className="gis-stat-label">
              REGISTERED PROJECTS
            </span>

            <span className="gis-stat-icon blue">
              ▣
            </span>
          </div>

          <strong>
            {loading ? '...' : projects.length}
          </strong>

          <span>
            Real projects in database
          </span>

        </div>


        <div className="gis-stat-card">

          <div className="gis-stat-top">
            <span className="gis-stat-label">
              SANCTIONED FUNDS
            </span>

            <span className="gis-stat-icon purple">
              ₹
            </span>
          </div>

          <strong>
            {loading
              ? '...'
              : formatAmount(totalSanctioned)}
          </strong>

          <span>
            MPLADS sanctioned amount
          </span>

        </div>


        <div className="gis-stat-card">

          <div className="gis-stat-top">
            <span className="gis-stat-label">
              GPS MAPPED
            </span>

            <span className="gis-stat-icon green">
              ⌖
            </span>
          </div>

          <strong>
            {loading
              ? '...'
              : projectsWithGPS.length}
          </strong>

          <span>
            Projects with real coordinates
          </span>

        </div>


        <div className="gis-stat-card">

          <div className="gis-stat-top">
            <span className="gis-stat-label">
              AVERAGE PROGRESS
            </span>

            <span className="gis-stat-icon orange">
              ↗
            </span>
          </div>

          <strong>
            {loading
              ? '...'
              : `${averageProgress}%`}
          </strong>

          <span>
            Across registered projects
          </span>

        </div>

      </section>


      {/* SEARCH / FILTER BAR */}
      <section className="gis-filter-panel">

        <div className="gis-zone-title">
          <span>
            ⌖
          </span>

          <strong>
            Project Locations
          </strong>

          <span className="gis-live-badge">
            LIVE DATABASE
          </span>
        </div>


        <div className="gis-search-row">

          <div className="gis-search">

            <span>
              ⌕
            </span>

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search project, location, description or status..."
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="gis-clear"
              >
                ×
              </button>
            )}

          </div>


          <div className="gis-result-count">
            Showing{' '}
            <strong>
              {filteredProjects.length}
            </strong>{' '}
            of{' '}
            <strong>
              {projects.length}
            </strong>{' '}
            projects
          </div>

        </div>

      </section>


      {/* MAIN GIS AREA */}
      <section className="gis-main-grid">

        {/* MAP */}
        <div className="gis-map-card">

          <div className="gis-map-toolbar">

            <div className="gis-map-status">
              <span className="live-dot"></span>

              <strong>
                Real Project GPS Telemetry
              </strong>

              <span>
                {projectsWithGPS.length} mapped
              </span>
            </div>


            <button
              className="gis-reset-button"
              onClick={() => {
                setSelectedProject(null)
              }}
            >
              ⛶ Reset India View
            </button>

          </div>


          <div className="gis-map">

            <MapContainer
              center={INDIA_CENTER}
              zoom={5}
              scrollWheelZoom={true}
              style={{
                width: '100%',
                height: '100%',
              }}
            >

              {mapMode === 'satellite' ? (
                <TileLayer
                  attribution="Tiles © Esri"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              ) : (
                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              )}


              <MapFocus
                project={selectedProject}
              />


              {projectsWithGPS.map((project) => {

                const latitude =
                  Number(project.latitude)

                const longitude =
                  Number(project.longitude)

                const isSelected =
                  selectedProject?.id === project.id

                return (
                  <Marker
                    key={project.id}
                    position={[
                      latitude,
                      longitude,
                    ]}
                    eventHandlers={{
                      click: () =>
                        selectProject(project),
                    }}
                  >

                    <Popup>

                      <div
                        style={{
                          minWidth: '230px',
                          fontFamily:
                            'Arial, sans-serif',
                        }}
                      >

                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#16845b',
                            marginBottom: '7px',
                            textTransform:
                              'uppercase',
                          }}
                        >
                          MPLADS Project
                        </div>

                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#172033',
                            marginBottom: '8px',
                          }}
                        >
                          {project.name}
                        </div>

                        <div
                          style={{
                            color: '#64748b',
                            fontSize: '13px',
                            marginBottom: '10px',
                          }}
                        >
                          📍{' '}
                          {project.location ||
                            'GPS location'}
                        </div>

                        <div
                          style={{
                            borderTop:
                              '1px solid #e2e8f0',
                            paddingTop: '9px',
                            display: 'grid',
                            gap: '6px',
                            fontSize: '13px',
                          }}
                        >

                          <div>
                            <strong>
                              Sanctioned:
                            </strong>{' '}
                            {formatAmount(
                              project.budget
                            )}
                          </div>

                          <div>
                            <strong>
                              Progress:
                            </strong>{' '}
                            {Number(
                              project.completion_percentage ||
                                0
                            )}
                            %
                          </div>

                          <div>
                            <strong>
                              Status:
                            </strong>{' '}
                            {project.status ||
                              'Proposed'}
                          </div>

                        </div>

                      </div>

                    </Popup>

                  </Marker>
                )
              })}

            </MapContainer>


            {/* MAP INFORMATION */}
            <div className="gis-map-overlay">

              <div>
                <strong>
                  {mapMode === 'satellite'
                    ? 'Satellite Imagery'
                    : 'Road Map'}
                </strong>

                <span>
                  {projectsWithGPS.length > 0
                    ? 'Real project coordinates'
                    : 'No project GPS coordinates available'}
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* RIGHT PROJECT PANEL */}
        <aside className="gis-side-panel">

          {/* SELECTED PROJECT */}
          <div className="selected-project-card">

            {selectedProject ? (
              <>

                <div className="selected-project-header">

                  <div className="selected-project-icon">
                    📍
                  </div>

                  <div>
                    <span>
                      SELECTED PROJECT
                    </span>

                    <h2>
                      {selectedProject.name}
                    </h2>
                  </div>

                </div>


                <div className="selected-location">

                  <span>
                    GPS LOCATION
                  </span>

                  <strong>
                    {selectedProject.latitude !==
                      null &&
                    selectedProject.latitude !==
                      undefined &&
                    selectedProject.longitude !==
                      null &&
                    selectedProject.longitude !==
                      undefined
                      ? `${Number(
                          selectedProject.latitude
                        ).toFixed(
                          6
                        )}, ${Number(
                          selectedProject.longitude
                        ).toFixed(
                          6
                        )}`
                      : 'Not available'}
                  </strong>

                  <small>
                    {selectedProject.location ||
                      'Location name not available'}
                  </small>

                </div>


                <div className="selected-project-details">

                  <div className="detail-box">
                    <span>
                      SANCTIONED AMOUNT
                    </span>

                    <strong>
                      {formatAmount(
                        selectedProject.budget
                      )}
                    </strong>
                  </div>


                  <div className="detail-box">
                    <span>
                      STATUS
                    </span>

                    <strong
                      className={
                        `status-text ${getStatusClass(
                          selectedProject.status
                        )}`
                      }
                    >
                      {selectedProject.status ||
                        'Proposed'}
                    </strong>
                  </div>


                  <div className="detail-box full">
                    <div className="progress-heading">
                      <span>
                        PROJECT PROGRESS
                      </span>

                      <strong>
                        {Number(
                          selectedProject.completion_percentage ||
                            0
                        )}
                        %
                      </strong>
                    </div>

                    <div className="detail-progress">
                      <div
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              Number(
                                selectedProject.completion_percentage ||
                                  0
                              )
                            )
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                </div>


                {selectedProject.description && (
                  <div className="selected-description">

                    <span>
                      PROJECT DESCRIPTION
                    </span>

                    <p>
                      {selectedProject.description}
                    </p>

                  </div>
                )}

              </>
            ) : (
              <div className="no-selection">

                <div className="no-selection-icon">
                  🛰️
                </div>

                <h2>
                  Satellite Project Monitor
                </h2>

                <p>
                  Select a project marker or project
                  from the list to inspect its real
                  location, sanctioned amount,
                  progress and project information.
                </p>

              </div>
            )}

          </div>


          {/* PROJECT LIST */}
          <div className="gis-project-list-card">

            <div className="project-list-header">

              <div>
                <h3>
                  Registered Projects
                </h3>

                <span>
                  {filteredProjects.length} projects
                </span>
              </div>

              <span className="database-badge">
                DATABASE
              </span>

            </div>


            <div className="project-list">

              {loading ? (
                <div className="project-list-empty">
                  <div className="loading-spinner">
                    ⟳
                  </div>

                  <span>
                    Loading real projects...
                  </span>
                </div>
              ) : filteredProjects.length ===
                0 ? (
                <div className="project-list-empty">

                  <div>
                    🔎
                  </div>

                  <strong>
                    No projects found
                  </strong>

                  <span>
                    Try another search.
                  </span>

                </div>
              ) : (
                filteredProjects.map((project) => {

                  const hasGPS =
                    project.latitude !==
                      null &&
                    project.latitude !==
                      undefined &&
                    project.longitude !==
                      null &&
                    project.longitude !==
                      undefined

                  const progress = Number(
                    project.completion_percentage ||
                      0
                  )

                  const isSelected =
                    selectedProject?.id ===
                    project.id

                  return (
                    <button
                      key={project.id}
                      className={
                        isSelected
                          ? 'gis-project-item selected'
                          : 'gis-project-item'
                      }
                      onClick={() =>
                        selectProject(project)
                      }
                    >

                      <div className="project-item-top">

                        <span className="project-item-category">
                          MPLADS
                        </span>

                        <span
                          className={
                            `project-item-status ${getStatusClass(
                              project.status
                            )}`
                          }
                        >
                          {project.status ||
                            'Proposed'}
                        </span>

                      </div>


                      <h4>
                        {project.name}
                      </h4>


                      <div className="project-item-location">

                        <span>
                          📍
                        </span>

                        <span>
                          {project.location ||
                            (hasGPS
                              ? `${Number(
                                  project.latitude
                                ).toFixed(
                                  4
                                )}, ${Number(
                                  project.longitude
                                ).toFixed(
                                  4
                                )}`
                              : 'Location not available')}
                        </span>

                      </div>


                      <div className="project-item-finance">

                        <div>
                          <span>
                            SANCTIONED
                          </span>

                          <strong>
                            {formatAmount(
                              project.budget
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            PROGRESS
                          </span>

                          <strong>
                            {progress}%
                          </strong>
                        </div>

                      </div>


                      <div className="project-item-progress">

                        <div>
                          <span>
                            Physical Progress
                          </span>

                          <strong>
                            {progress}%
                          </strong>
                        </div>

                        <div className="mini-progress">
                          <div
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  progress
                                )
                              )}%`,
                            }}
                          ></div>
                        </div>

                      </div>


                      <div className="project-item-footer">

                        <span>
                          {hasGPS
                            ? '⌖ GPS mapped'
                            : '○ GPS unavailable'}
                        </span>

                        <span>
                          View →
                        </span>

                      </div>

                    </button>
                  )
                })
              )}

            </div>

          </div>

        </aside>

      </section>


      {/* FOOTER INFORMATION */}
      <section className="gis-bottom-bar">

        <div>

          <span className="bottom-live-dot"></span>

          <strong>
            MPLAD-Guard Live Project Registry
          </strong>

          <span>
            Data displayed directly from the project
            database.
          </span>

        </div>

        <div>
          {projectsWithGPS.length} GPS mapped
          {' • '}
          {projects.length} total projects
        </div>

      </section>


      {/* PAGE STYLES */}
      <style>{`

        .mplad-gis-page {
          min-height: 100%;
          padding: 30px 36px 40px;
          background: #f4f7fb;
          color: #172033;
          box-sizing: border-box;
        }

        .gis-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 24px;
        }

        .gis-title-area {
          flex: 1;
          min-width: 0;
        }

        .gis-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .gis-title-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #e8f7f0;
          font-size: 20px;
        }

        .gis-title-row h1 {
          margin: 0;
          font-size: 27px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .gis-chip {
          padding: 6px 10px;
          border-radius: 8px;
          background: #e5f7ff;
          border: 1px solid #a9e7fa;
          color: #16708f;
          font-size: 11px;
          font-weight: 800;
        }

        .gis-title-area p {
          margin: 9px 0 0 50px;
          color: #687a94;
          font-size: 14px;
          line-height: 1.55;
          max-width: 850px;
        }

        .gis-view-switcher {
          display: flex;
          padding: 4px;
          border-radius: 12px;
          background: #e7ecf4;
          flex-shrink: 0;
        }

        .gis-view-button {
          min-width: 120px;
          border: none;
          background: transparent;
          padding: 11px 16px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #51627d;
          font-weight: 700;
          cursor: pointer;
        }

        .gis-view-button.active {
          background: #318fb2;
          color: white;
          box-shadow: 0 4px 12px rgba(49, 143, 178, 0.25);
        }

        .gis-error {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 14px 18px;
          margin-bottom: 20px;
          border-radius: 12px;
          background: #fff2f2;
          border: 1px solid #f2c8c8;
          color: #a42635;
        }

        .gis-error span {
          color: #c24a56;
          font-size: 13px;
        }

        .gis-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .gis-stat-card {
          background: white;
          border: 1px solid #e1e7ef;
          border-radius: 14px;
          padding: 20px 22px;
          box-shadow: 0 4px 14px rgba(27, 43, 69, 0.05);
        }

        .gis-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }

        .gis-stat-label {
          color: #71819a;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.7px;
        }

        .gis-stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .gis-stat-icon.blue {
          background: #eaf2ff;
          color: #4169e1;
        }

        .gis-stat-icon.purple {
          background: #f0ebff;
          color: #7656db;
        }

        .gis-stat-icon.green {
          background: #e6f8ef;
          color: #36976e;
        }

        .gis-stat-icon.orange {
          background: #fff2dc;
          color: #d48a20;
        }

        .gis-stat-card > strong {
          display: block;
          margin-top: 13px;
          font-size: 27px;
          color: #182135;
        }

        .gis-stat-card > span:last-child {
          display: block;
          margin-top: 5px;
          color: #7b8aa1;
          font-size: 12px;
        }

        .gis-filter-panel {
          background: #12182c;
          border-radius: 15px;
          padding: 15px 18px;
          margin-bottom: 20px;
          box-shadow: 0 8px 22px rgba(18, 24, 44, 0.14);
        }

        .gis-zone-title {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #d9e3f3;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .gis-zone-title > span:first-child {
          color: #51b9dd;
          font-size: 17px;
        }

        .gis-live-badge {
          padding: 4px 8px;
          border-radius: 6px;
          background: rgba(67, 189, 140, 0.15);
          color: #5ad69f;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .gis-search-row {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .gis-search {
          flex: 1;
          height: 43px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 13px;
          border-radius: 10px;
          border: 1px solid #34405b;
          background: #080d1e;
        }

        .gis-search > span {
          color: #8ca0bd;
          font-size: 19px;
        }

        .gis-search input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: white;
          font-size: 13px;
        }

        .gis-search input::placeholder {
          color: #71819b;
        }

        .gis-clear {
          border: none;
          background: transparent;
          color: #9eacc1;
          font-size: 20px;
          cursor: pointer;
        }

        .gis-result-count {
          color: #8c9bb3;
          font-size: 12px;
          white-space: nowrap;
        }

        .gis-result-count strong {
          color: #f4f7fb;
        }

        .gis-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.8fr) minmax(330px, 0.8fr);
          gap: 18px;
          align-items: stretch;
        }

        .gis-map-card {
          min-width: 0;
          background: white;
          border: 1px solid #dce3ec;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 18px rgba(27, 43, 69, 0.07);
        }

        .gis-map-toolbar {
          height: 57px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e7ee;
        }

        .gis-map-status {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #35445c;
          font-size: 13px;
        }

        .gis-map-status > span:last-child {
          color: #8a98ac;
          font-size: 11px;
        }

        .live-dot,
        .bottom-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #38ad7b;
          box-shadow: 0 0 0 4px rgba(56, 173, 123, 0.12);
        }

        .gis-reset-button {
          border: 1px solid #d7dfea;
          background: white;
          color: #40506a;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .gis-reset-button:hover {
          background: #f5f7fa;
        }

        .gis-map {
          height: 650px;
          position: relative;
          background: #dbe1e6;
        }

        .gis-map-overlay {
          position: absolute;
          left: 14px;
          bottom: 14px;
          z-index: 500;
          padding: 10px 13px;
          border-radius: 9px;
          background: rgba(18, 24, 44, 0.9);
          color: white;
          box-shadow: 0 5px 15px rgba(0,0,0,0.18);
        }

        .gis-map-overlay div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .gis-map-overlay strong {
          font-size: 11px;
        }

        .gis-map-overlay span {
          color: #aebbd0;
          font-size: 10px;
        }

        .gis-side-panel {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .selected-project-card {
          background: #172036;
          border-radius: 15px;
          color: white;
          padding: 19px;
          box-shadow: 0 7px 20px rgba(18, 24, 44, 0.13);
        }

        .selected-project-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .selected-project-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #27324c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .selected-project-header span {
          display: block;
          color: #7e90ad;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.8px;
          margin-bottom: 5px;
        }

        .selected-project-header h2 {
          margin: 0;
          font-size: 17px;
          line-height: 1.3;
        }

        .selected-location {
          margin-top: 17px;
          padding: 13px;
          border-radius: 10px;
          background: #202b43;
          border: 1px solid #2f3b54;
        }

        .selected-location span {
          display: block;
          color: #8191aa;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .selected-location strong {
          display: block;
          margin-top: 6px;
          color: #62c7ea;
          font-size: 12px;
        }

        .selected-location small {
          display: block;
          margin-top: 5px;
          color: #a5b2c6;
          font-size: 11px;
        }

        .selected-project-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 10px;
        }

        .detail-box {
          padding: 12px;
          border-radius: 10px;
          background: #202b43;
          border: 1px solid #2f3b54;
        }

        .detail-box.full {
          grid-column: 1 / -1;
        }

        .detail-box > span {
          display: block;
          color: #8191aa;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .detail-box > strong {
          display: block;
          margin-top: 5px;
          font-size: 15px;
        }

        .status-text.complete {
          color: #59d39d;
        }

        .status-text.progress {
          color: #68a5ff;
        }

        .status-text.delayed {
          color: #ff8792;
        }

        .status-text.proposed {
          color: #e8c36c;
        }

        .progress-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .progress-heading strong {
          color: #67d39f;
        }

        .detail-progress {
          height: 7px;
          margin-top: 9px;
          background: #10182b;
          border-radius: 20px;
          overflow: hidden;
        }

        .detail-progress > div {
          height: 100%;
          background: #43ae7e;
          border-radius: inherit;
        }

        .selected-description {
          margin-top: 10px;
          padding: 13px;
          border-radius: 10px;
          background: #202b43;
          border: 1px solid #2f3b54;
        }

        .selected-description > span {
          color: #8191aa;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .selected-description p {
          margin: 7px 0 0;
          color: #b7c2d2;
          font-size: 11px;
          line-height: 1.55;
        }

        .no-selection {
          text-align: center;
          padding: 24px 12px;
        }

        .no-selection-icon {
          width: 55px;
          height: 55px;
          margin: 0 auto 12px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #26314a;
          font-size: 23px;
        }

        .no-selection h2 {
          margin: 0;
          font-size: 16px;
        }

        .no-selection p {
          margin: 10px 0 0;
          color: #94a4bd;
          font-size: 12px;
          line-height: 1.6;
        }

        .gis-project-list-card {
          min-height: 0;
          max-height: 510px;
          background: #1a2238;
          border-radius: 15px;
          overflow: hidden;
          color: white;
        }

        .project-list-header {
          padding: 15px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #303a51;
        }

        .project-list-header h3 {
          margin: 0;
          font-size: 14px;
        }

        .project-list-header span {
          color: #8998b0;
          font-size: 10px;
        }

        .database-badge {
          padding: 5px 8px;
          border-radius: 6px;
          background: #28334c;
          color: #65d2a1 !important;
          font-size: 8px !important;
          font-weight: 800;
          letter-spacing: 0.6px;
        }

        .project-list {
          padding: 10px;
          max-height: 430px;
          overflow-y: auto;
        }

        .project-list::-webkit-scrollbar {
          width: 6px;
        }

        .project-list::-webkit-scrollbar-thumb {
          background: #3b4660;
          border-radius: 10px;
        }

        .gis-project-item {
          width: 100%;
          display: block;
          text-align: left;
          border: 1px solid transparent;
          background: #11192d;
          color: white;
          border-radius: 10px;
          padding: 13px;
          margin-bottom: 9px;
          cursor: pointer;
          transition: 0.18s ease;
        }

        .gis-project-item:hover,
        .gis-project-item.selected {
          background: #202c45;
          border-color: #397c93;
        }

        .project-item-top {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          align-items: center;
        }

        .project-item-category {
          color: #63c99e;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }

        .project-item-status {
          padding: 4px 7px;
          border-radius: 5px;
          font-size: 8px;
          font-weight: 800;
        }

        .project-item-status.complete {
          background: #163d32;
          color: #65d4a1;
        }

        .project-item-status.progress {
          background: #1d345c;
          color: #75a8ff;
        }

        .project-item-status.delayed {
          background: #542a31;
          color: #ff8992;
        }

        .project-item-status.proposed {
          background: #4a3c1f;
          color: #f1c45f;
        }

        .gis-project-item h4 {
          margin: 9px 0 7px;
          font-size: 13px;
          line-height: 1.35;
        }

        .project-item-location {
          display: flex;
          gap: 6px;
          color: #8fa0b9;
          font-size: 10px;
          line-height: 1.4;
        }

        .project-item-location span:last-child {
          overflow-wrap: anywhere;
        }

        .project-item-finance {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid #29334a;
        }

        .project-item-finance span {
          display: block;
          color: #73839d;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.4px;
        }

        .project-item-finance strong {
          display: block;
          margin-top: 4px;
          font-size: 12px;
        }

        .project-item-progress {
          margin-top: 10px;
        }

        .project-item-progress > div:first-child {
          display: flex;
          justify-content: space-between;
          color: #7f8ea7;
          font-size: 9px;
        }

        .project-item-progress strong {
          color: #dce5f2;
        }

        .mini-progress {
          height: 5px;
          margin-top: 5px;
          background: #0c1325;
          border-radius: 10px;
          overflow: hidden;
        }

        .mini-progress > div {
          height: 100%;
          background: #4bb285;
          border-radius: inherit;
        }

        .project-item-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 9px;
          border-top: 1px solid #29334a;
          color: #71829c;
          font-size: 9px;
        }

        .project-item-footer span:last-child {
          color: #62c99d;
          font-weight: 700;
        }

        .project-list-empty {
          min-height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #8393ac;
          text-align: center;
          font-size: 11px;
        }

        .project-list-empty strong {
          color: #dce4f0;
        }

        .loading-spinner {
          font-size: 22px;
        }

        .gis-bottom-bar {
          margin-top: 18px;
          padding: 13px 17px;
          border-radius: 11px;
          background: #12182c;
          color: #8d9bb2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          font-size: 10px;
        }

        .gis-bottom-bar > div:first-child {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .gis-bottom-bar strong {
          color: #d9e2ef;
        }

        @media (max-width: 1100px) {

          .gis-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .gis-main-grid {
            grid-template-columns: 1fr;
          }

          .gis-side-panel {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .gis-project-list-card {
            max-height: 500px;
          }

        }

        @media (max-width: 760px) {

          .mplad-gis-page {
            padding: 20px 15px 30px;
          }

          .gis-header {
            flex-direction: column;
          }

          .gis-title-area p {
            margin-left: 0;
          }

          .gis-view-switcher {
            width: 100%;
          }

          .gis-view-button {
            flex: 1;
          }

          .gis-stats {
            grid-template-columns: 1fr 1fr;
          }

          .gis-search-row {
            flex-direction: column;
            align-items: stretch;
          }

          .gis-result-count {
            text-align: right;
          }

          .gis-side-panel {
            display: flex;
          }

          .gis-map {
            height: 480px;
          }

          .gis-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
          }

        }

        @media (max-width: 480px) {

          .gis-stats {
            grid-template-columns: 1fr;
          }

          .gis-title-row h1 {
            font-size: 22px;
          }

          .selected-project-details {
            grid-template-columns: 1fr;
          }

          .detail-box.full {
            grid-column: auto;
          }

        }

      `}</style>

    </div>
  )
}

export default MapDashboard