function ProjectStatus({ status = 'Pending' }) {
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-')

  return (
    <span className={`project-status project-status-${normalizedStatus}`}>
      <span className="status-dot"></span>
      {status}
    </span>
  )
}

export default ProjectStatus
