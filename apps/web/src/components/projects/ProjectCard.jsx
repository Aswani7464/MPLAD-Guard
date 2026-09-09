function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-header">
        <div>
          <h3>{project?.name || 'Untitled Project'}</h3>
          <span>{project?.category || 'Development Project'}</span>
        </div>

        <span className="project-card-status">
          {project?.status || 'Pending'}
        </span>
      </div>

      <p className="project-card-description">
        {project?.description || 'No project description available.'}
      </p>

      <div className="project-card-details">
        <div>
          <span>Location</span>
          <strong>{project?.location || 'Not specified'}</strong>
        </div>

        <div>
          <span>Budget</span>
          <strong>{project?.budget || 'Not specified'}</strong>
        </div>

        <div>
          <span>Progress</span>
          <strong>{project?.progress ?? 0}%</strong>
        </div>
      </div>

      <div className="project-progress">
        <div
          className="project-progress-bar"
          style={{
            width: `${Math.min(project?.progress ?? 0, 100)}%`,
          }}
        ></div>
      </div>
    </div>
  )
}

export default ProjectCard
