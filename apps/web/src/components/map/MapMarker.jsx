function MapMarker({ project, onClick }) {
  return (
    <button
      type="button"
      className="map-marker"
      onClick={() => onClick?.(project)}
    >
      <span className="map-marker-icon">📍</span>

      <span className="map-marker-info">
        <strong>{project?.name || 'Project'}</strong>

        <small>
          {project?.location || 'Location not available'}
        </small>
      </span>
    </button>
  )
}

export default MapMarker
