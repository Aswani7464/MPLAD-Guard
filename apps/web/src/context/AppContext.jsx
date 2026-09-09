import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

function AppProvider({ children }) {
  const [selectedProject, setSelectedProject] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const selectProject = (project) => {
    setSelectedProject(project)
  }

  const clearSelectedProject = () => {
    setSelectedProject(null)
  }

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current)
  }

  return (
    <AppContext.Provider
      value={{
        selectedProject,
        selectProject,
        clearSelectedProject,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error(
      'useAppContext must be used inside AppProvider'
    )
  }

  return context
}

export { AppProvider, useAppContext }
