import { useEffect, useState } from 'react'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../services/projects'

function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProjects()
      setProjects(data)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const addProject = async (projectData) => {
    const data = await createProject(projectData)
    await fetchProjects()
    return data
  }

  const editProject = async (projectId, projectData) => {
    const data = await updateProject(projectId, projectData)
    await fetchProjects()
    return data
  }

  const removeProject = async (projectId) => {
    const data = await deleteProject(projectId)
    await fetchProjects()
    return data
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
  }
}

export default useProjects
