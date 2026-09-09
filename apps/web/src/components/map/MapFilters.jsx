function MapFilters({
  status = 'All',
  risk = 'All',
  onStatusChange,
  onRiskChange,
}) {
  return (
    <div className="map-filters">
      <div className="map-filter-group">
        <label htmlFor="map-status">Project Status</label>

        <select
          id="map-status"
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Delayed">Delayed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="map-filter-group">
        <label htmlFor="map-risk">Risk Level</label>

        <select
          id="map-risk"
          value={risk}
          onChange={(e) => onRiskChange?.(e.target.value)}
        >
          <option value="All">All Risk Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
    </div>
  )
}

export default MapFilters
