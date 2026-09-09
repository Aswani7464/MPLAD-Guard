import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MapView from '../components/map/MapView.jsx'
import { apiRequest } from '../services/api.js'
import BackToDashboard from '../components/common/BackToDashboard'

function ProjectView() {
  const { id } = useParams()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [locationStatus, setLocationStatus] = useState('')
  const [updatingLocation, setUpdatingLocation] = useState(false)

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiRequest(`/projects/${id}`)
      setProject(data)
    } catch (err) {
      setError(err.message || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const updateCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus(
        '❌ Geolocation is not supported by this browser.'
      )
      return
    }

    setUpdatingLocation(true)
    setLocationStatus('📍 Getting your real GPS location...')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        setLocationStatus(
          '📍 GPS captured. Saving location to the project...'
        )

        try {
          const updatedProject = await apiRequest(
            `/projects/${id}`,
            {
              method: 'PUT',
              body: JSON.stringify({
                name: project.name,
                description: project.description,
                location: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                latitude: latitude,
                longitude: longitude,
                budget: Number(project.budget),
                status: project.status,
                completion_percentage: Number(
                  project.completion_percentage || 0
                ),
              }),
            }
          )

          setProject(
            updatedProject.project || updatedProject
          )

          setLocationStatus(
            '✅ Real GPS location saved successfully!'
          )
        } catch (err) {
          setLocationStatus(
            `❌ Failed to save GPS location: ${
              err.message || 'Unknown error'
            }`
          )
        } finally {
          setUpdatingLocation(false)
        }
      },
      (error) => {
        let message = '❌ Unable to get your location.'

        if (error.code === 1) {
          message =
            '❌ Location permission was denied. Please allow location access.'
        } else if (error.code === 2) {
          message =
            '❌ Your current location could not be determined.'
        } else if (error.code === 3) {
          message =
            '❌ Location request timed out. Please try again.'
        }

        setLocationStatus(message)
        setUpdatingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  }

  if (loading) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          fontSize: '18px',
        }}
      >
        Loading project...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Unable to load project</h2>
        <p>{error}</p>

        <Link to="/projects">
          ← Back to Projects
        </Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ padding: '40px' }}>
        <h2>Project not found</h2>

        <Link to="/projects">
          ← Back to Projects
        </Link>
      </div>
    )
  }

  const hasGPS =
    project.latitude !== null &&
    project.latitude !== undefined &&
    project.longitude !== null &&
    project.longitude !== undefined

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        padding: '30px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Back */}
        <Link
          to="/projects"
          style={{
            textDecoration: 'none',
            color: '#4169e1',
            fontWeight: '600',
          }}
        >
          ← Back to Projects
        </Link>

        {/* Project Header */}
        <div
          style={{
            background: 'white',
            marginTop: '20px',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  color: '#64748b',
                  fontSize: '14px',
                }}
              >
                Project ID: #{project.id}
              </p>

              <h1
                style={{
                  margin: '8px 0',
                  color: '#172033',
                }}
              >
                {project.name}
              </h1>

              <p
                style={{
                  color: '#64748b',
                  margin: 0,
                }}
              >
                {project.description ||
                  'No description available.'}
              </p>
            </div>

            <div
              style={{
                alignSelf: 'flex-start',
                padding: '8px 16px',
                borderRadius: '20px',
                background: '#e0f2fe',
                color: '#0369a1',
                fontWeight: '600',
              }}
            >
              {project.status}
            </div>
          </div>
        </div>

        {/* Project Information */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            marginTop: '20px',
          }}
        >
          <InfoCard
            title="MPLADS Sanctioned Amount"
            value={`₹${Number(
              project.budget || 0
            ).toLocaleString('en-IN')}`}
          />

          <InfoCard
            title="Completion"
            value={`${project.completion_percentage || 0}%`}
          />

          <InfoCard
            title="Project Status"
            value={project.status || 'Not specified'}
          />

          <InfoCard
            title="Project ID"
            value={`#${project.id}`}
          />
        </div>

        {/* GPS Section */}
        <div
          style={{
            background: 'white',
            marginTop: '25px',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: '#172033',
            }}
          >
            📍 Real Project Location
          </h2>

          <p style={{ color: '#475569' }}>
            The project location is captured from the
            device's real GPS. No manual location entry is
            required.
          </p>

          {/* GPS Update Button */}
          <button
            onClick={updateCurrentLocation}
            disabled={updatingLocation}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '10px',
              background: updatingLocation
                ? '#94a3b8'
                : '#4169e1',
              color: 'white',
              fontSize: '15px',
              fontWeight: '600',
              cursor: updatingLocation
                ? 'not-allowed'
                : 'pointer',
              marginBottom: '15px',
            }}
          >
            {updatingLocation
              ? '📡 Getting GPS...'
              : '📍 Update Current GPS Location'}
          </button>

          {/* GPS Status */}
          {locationStatus && (
            <div
              style={{
                padding: '12px 15px',
                marginBottom: '20px',
                borderRadius: '10px',
                background: '#f1f5f9',
                color: '#334155',
              }}
            >
              {locationStatus}
            </div>
          )}

          {hasGPS ? (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    padding: '15px',
                    background: '#f1f5f9',
                    borderRadius: '10px',
                  }}
                >
                  <strong>Latitude</strong>
                  <br />
                  {Number(project.latitude).toFixed(6)}
                </div>

                <div
                  style={{
                    padding: '15px',
                    background: '#f1f5f9',
                    borderRadius: '10px',
                  }}
                >
                  <strong>Longitude</strong>
                  <br />
                  {Number(project.longitude).toFixed(6)}
                </div>
              </div>

              <MapView
                latitude={Number(project.latitude)}
                longitude={Number(project.longitude)}
                height="450px"
              />
            </>
          ) : (
            <div
              style={{
                padding: '25px',
                background: '#fff7ed',
                borderRadius: '10px',
                color: '#9a3412',
              }}
            >
              <strong>
                ⚠️ GPS location not available
              </strong>

              <p>
                This project does not have GPS coordinates
                saved yet.
              </p>

              <p>
                Click <strong>Update Current GPS Location</strong>{' '}
                above to capture and save the real location.
              </p>
            </div>
          )}
        </div>

        {/* Location Data */}
        <div
          style={{
            background: 'white',
            marginTop: '25px',
            padding: '25px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Location Data
          </h2>

          <p>
            <strong>Stored location:</strong>{' '}
            {project.location || 'GPS coordinates only'}
          </p>

          {hasGPS && (
            <p style={{ color: '#64748b' }}>
              📡 GPS: {Number(project.latitude).toFixed(6)},{' '}
              {Number(project.longitude).toFixed(6)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        background: 'white',
        padding: '22px',
        borderRadius: '14px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
      }}
    >
      <p
        style={{
          margin: 0,
          color: '#64748b',
          fontSize: '14px',
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: '8px 0 0',
          color: '#172033',
        }}
      >
        {value}
      </h2>
    </div>
  )
}

export default ProjectView