import ProjectStatus from './ProjectStatus'

function ProjectTable({ projects = [], onProjectClick }) {
  return (
    <div className="project-table-container">
      <div className="project-table-header">
        <div>
          <h3>Projects</h3>
          <p>Monitor all registered projects</p>
        </div>

        <span>{projects.length} Projects</span>
      </div>

      {projects.length === 0 ? (
        <div className="project-table-empty">
          <p>No projects available.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="project-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => onProjectClick?.(project)}
                >
                  <td>
                    <strong>{project.name}</strong>
                    <small>
                      {project.category || 'Development Project'}
                    </small>
                  </td>

                  <td>{project.location || 'Not specified'}</td>

                  <td>{project.budget || 'Not specified'}</td>

                  <td>
                    <div className="table-progress">
                      <div className="table-progress-bar">
                        <div
                          style={{
                            width: `${Math.min(
                              project.progress ?? 0,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <span>{project.progress ?? 0}%</span>
                    </div>
                  </td>

                  <td>
                    <ProjectStatus status={project.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProjectTable
