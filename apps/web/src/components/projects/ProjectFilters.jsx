function ProjectFilters({
  search = '',
  status = 'All',
  onSearchChange,
  onStatusChange,
}) {
  return (
    <div className="project-filters">
      <div className="project-search">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="project-status-filter">
        <select
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
    </div>
  )
}

export default ProjectFilters
