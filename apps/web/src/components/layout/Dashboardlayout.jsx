import { Outlet, useLocation, useNavigate } from 'react-router-dom'

function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard'
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    )
  }

  const menuSections = [
    {
      title: 'MAIN MENU',
      items: [
        { label: 'Dashboard', icon: '▦', path: '/dashboard' },
        { label: 'Projects', icon: '▣', path: '/projects' },
        { label: 'Risk Analysis', icon: '⚠', path: '/risk' },
        { label: 'Verification', icon: '✓', path: '/verification' },
        { label: 'Map View', icon: '⌖', path: '/map' },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Analytics', icon: '▤', path: '/analytics' },
        { label: 'Reports', icon: '▧', path: '/reports' },
        { label: 'Notifications', icon: '◉', path: '/notifications' },
        { label: 'Settings', icon: '⚙', path: '/profile' },
      ],
    },
  ]

  const getPageTitle = () => {
    if (
      location.pathname === '/' ||
      location.pathname === '/dashboard'
    ) {
      return 'Dashboard'
    }

    if (location.pathname.startsWith('/projects/')) {
      return 'Project Monitoring'
    }

    if (location.pathname === '/projects') return 'Projects'
    if (location.pathname === '/risk') return 'Risk Analysis'
    if (location.pathname === '/verification') return 'Verification'
    if (location.pathname === '/map') return 'Map View'
    if (location.pathname === '/analytics') return 'Analytics'
    if (location.pathname === '/reports') return 'Reports'
    if (location.pathname === '/notifications') return 'Notifications'
    if (location.pathname === '/profile') return 'Settings'
    if (location.pathname === '/admin') return 'Administration'

    return 'Dashboard'
  }

  return (
    <div className="dashboard-page">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="sidebar-brand">
          <div className="brand-logo">
            M
          </div>

          <div>
            <h2>MPLAD-Guard</h2>
            <span>Monitoring System</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          {menuSections.map((section) => (
            <div key={section.title}>

              <div className="nav-section-title">
                {section.title}
              </div>

              {section.items.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={
                    isActive(item.path)
                      ? 'active'
                      : ''
                  }
                  onClick={(event) => {
                    event.preventDefault()
                    navigate(item.path)
                  }}
                >
                  <span className="nav-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.label}
                  </span>
                </a>
              ))}

            </div>
          ))}

        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-help">

            <div className="help-icon">
              ?
            </div>

            <div>
              <strong>Need help?</strong>
              <span>View documentation</span>
            </div>

          </div>
        </div>

      </aside>


      {/* MAIN APPLICATION */}
      <main className="dashboard-main">

        {/* TOP HEADER */}
        <header className="dashboard-header">

          <div className="header-left">

            <span className="breadcrumb">
              MPLAD-Guard
            </span>

            <span className="breadcrumb-arrow">
              /
            </span>

            <strong>
              {getPageTitle()}
            </strong>

          </div>


          <div className="header-right">

            <div className="search-box">

              <span>
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search projects..."
              />

            </div>


            <button
              className="header-icon-button"
              type="button"
              onClick={() => navigate('/notifications')}
              title="Notifications"
            >
              ◉
              <span className="notification-dot"></span>
            </button>


            <div
              className="profile-area"
              onClick={() => navigate('/profile')}
              style={{
                cursor: 'pointer',
              }}
            >

              <div className="profile-avatar">
                A
              </div>

              <div className="profile-info">

                <strong>
                  Administrator
                </strong>

                <span>
                  Admin
                </span>

              </div>

              <span className="profile-arrow">
                ⌄
              </span>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}
        <section
          className="dashboard-content"
          style={{
            minHeight: 'calc(100vh - 160px)',
          }}
        >
          <Outlet />
        </section>


        {/* FOOTER */}
        <footer className="dashboard-footer">

          <span>
            © 2026 MPLAD-Guard
          </span>

          <span>
            Project Monitoring & Risk Analysis System
          </span>

        </footer>

      </main>

    </div>
  )
}

export default DashboardLayout