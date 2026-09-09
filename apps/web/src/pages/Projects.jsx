import ProjectFilters from '../components/projects/ProjectFilters'
import ProjectTable from '../components/projects/ProjectTable'

function Projects() {
  return (
    <div className="page projects-page">
      <div className="page-header">
        <h1>Projects</h1>
        <p>Monitor and manage registered development projects.</p>
      </div>

      <ProjectFilters />

      <ProjectTable />
    </div>
  )
}

export default Projects
