import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProjectDetails from './pages/ProjectDetails.jsx'
import ProjectView from './pages/ProjectView.jsx'
import RiskAnalysis from './pages/RiskAnalysis.jsx'
import Verification from './pages/Verification.jsx'
import MapDashboard from './pages/MapDashboard.jsx'
import Analytics from './pages/Analytics.jsx'
import Reports from './pages/Reports.jsx'
import Notifications from './pages/Notifications.jsx'
import Profile from './pages/Profile.jsx'
import AdminPanel from './pages/AdminPanel.jsx'


function ProtectedRoute({ children }) {
  const location = useLocation()
  const isLoggedIn = localStorage.getItem('mplad_user')

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  return children
}


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main entry */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Public pages */}
        <Route
          path="/landing"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* Main Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* Projects */}
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectView />
            </ProtectedRoute>
          }
        />


        {/* Risk */}
        <Route
          path="/risk"
          element={
            <ProtectedRoute>
              <RiskAnalysis />
            </ProtectedRoute>
          }
        />


        {/* Verification */}
        <Route
          path="/verification"
          element={
            <ProtectedRoute>
              <Verification />
            </ProtectedRoute>
          }
        />


        {/* Map */}
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapDashboard />
            </ProtectedRoute>
          }
        />


        {/* Analytics */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />


        {/* Reports */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />


        {/* Notifications */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />


        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />


        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App