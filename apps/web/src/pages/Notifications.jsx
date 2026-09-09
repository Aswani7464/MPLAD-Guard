import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../services/api'
import BackToDashboard from '../components/common/BackToDashboard'

function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await apiRequest('/notifications/')

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.notifications)
          ? data.notifications
          : []

      setNotifications(list)
    } catch (err) {
      setError(err.message || 'Unable to load notifications.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (item) =>
          item.read === false ||
          item.is_read === false ||
          item.status === 'Unread',
      ).length,
    [notifications],
  )

  const highPriorityCount = useMemo(
    () =>
      notifications.filter(
        (item) =>
          String(item.priority || '').toLowerCase() === 'high' ||
          String(item.type || '').toLowerCase() === 'high-risk',
      ).length,
    [notifications],
  )

  const filteredNotifications = useMemo(() => {
    if (filter === 'All') return notifications

    if (filter === 'Unread') {
      return notifications.filter(
        (item) =>
          item.read === false ||
          item.is_read === false ||
          item.status === 'Unread',
      )
    }

    if (filter === 'High Priority') {
      return notifications.filter(
        (item) =>
          String(item.priority || '').toLowerCase() === 'high' ||
          String(item.type || '').toLowerCase() === 'high-risk',
      )
    }

    return notifications
  }, [notifications, filter])

  const getTitle = (notification) =>
    notification.title ||
    notification.subject ||
    notification.name ||
    'Project Notification'

  const getMessage = (notification) =>
    notification.message ||
    notification.description ||
    notification.content ||
    'A new project monitoring update is available.'

  const getPriority = (notification) =>
    notification.priority ||
    (String(notification.type || '').toLowerCase().includes('risk')
      ? 'High'
      : 'Normal')

  const getProject = (notification) =>
    notification.project_name ||
    notification.project ||
    notification.project_id ||
    'System'

  const getDate = (notification) => {
    const value =
      notification.created_at ||
      notification.updated_at ||
      notification.timestamp ||
      notification.date

    if (!value) return 'Date not available'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return String(value)
    }

    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isUnread = (notification) =>
    notification.read === false ||
    notification.is_read === false ||
    notification.status === 'Unread'

  const getIcon = (notification) => {
    const text = `${notification.type || ''} ${notification.title || ''}`.toLowerCase()

    if (text.includes('risk')) return '⚠️'
    if (text.includes('verification')) return '✓'
    if (text.includes('project')) return '📁'
    if (text.includes('report')) return '📊'

    return '🔔'
  }

  return (
    <div className="notifications-page">
      <style>{`
        .notifications-page {
          min-height: 100%;
          padding: 28px;
          background: #f5f7fb;
          color: #172033;
        }

        .notifications-container {
          max-width: 1450px;
          margin: 0 auto;
        }

        .notifications-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .notifications-title h1 {
          margin: 0 0 7px;
          font-size: 30px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .notifications-title p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .refresh-button {
          border: 1px solid #dbe3ee;
          background: #ffffff;
          color: #1e3a8a;
          border-radius: 9px;
          padding: 10px 15px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .refresh-button:hover {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .notification-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 20px;
        }

        .stat-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 13px;
          padding: 18px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .stat-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 9px;
        }

        .stat-value {
          color: #172033;
          font-size: 24px;
          font-weight: 800;
        }

        .stat-subtext {
          margin-top: 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .notifications-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
          overflow: hidden;
        }

        .notifications-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 18px 20px;
          border-bottom: 1px solid #eef2f7;
        }

        .toolbar-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
        }

        .filter-buttons {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }

        .filter-button {
          border: 1px solid #dbe3ee;
          background: #ffffff;
          color: #64748b;
          border-radius: 8px;
          padding: 8px 11px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .filter-button.active {
          border-color: #2563eb;
          background: #eff6ff;
          color: #2563eb;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 19px 20px;
          border-bottom: 1px solid #eef2f7;
          transition: background 0.2s ease;
        }

        .notification-item:last-child {
          border-bottom: 0;
        }

        .notification-item:hover {
          background: #f8fafc;
        }

        .notification-item.unread {
          background: #f8fbff;
        }

        .notification-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          background: #eff6ff;
          font-size: 18px;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 6px;
        }

        .notification-title {
          margin: 0;
          font-size: 14px;
          font-weight: 800;
          color: #172033;
        }

        .unread-dot {
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-left: 7px;
          border-radius: 50%;
          background: #2563eb;
          vertical-align: middle;
        }

        .notification-message {
          margin: 0 0 9px;
          color: #64748b;
          font-size: 13px;
          line-height: 1.55;
        }

        .notification-meta {
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .meta-item {
          color: #94a3b8;
          font-size: 11px;
          font-weight: 600;
        }

        .priority-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
          background: #f1f5f9;
          color: #64748b;
        }

        .priority-badge.high {
          background: #fef2f2;
          color: #dc2626;
        }

        .priority-badge.medium {
          background: #fffbeb;
          color: #b45309;
        }

        .priority-badge.low {
          background: #ecfdf5;
          color: #047857;
        }

        .empty-state {
          padding: 65px 20px;
          text-align: center;
        }

        .empty-icon {
          width: 58px;
          height: 58px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #eff6ff;
          font-size: 25px;
        }

        .empty-state h3 {
          margin: 0 0 7px;
          color: #334155;
          font-size: 17px;
        }

        .empty-state p {
          max-width: 450px;
          margin: 0 auto;
          color: #94a3b8;
          font-size: 13px;
          line-height: 1.6;
        }

        .error-box {
          margin-bottom: 20px;
          padding: 14px 16px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fff1f2;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 600;
        }

        .loading-state {
          padding: 55px 20px;
          text-align: center;
          color: #64748b;
          font-size: 13px;
        }

        @media (max-width: 850px) {
          .notification-stats {
            grid-template-columns: 1fr;
          }

          .notifications-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .notifications-page {
            padding: 18px;
          }

          .notifications-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .notification-item {
            padding: 16px;
          }

          .notification-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>

      <div className="notifications-container">
        <BackToDashboard />

        <div className="notifications-header">
          <div className="notifications-title">
            <h1>Notifications</h1>
            <p>View important project and risk alerts.</p>
          </div>

          <button
            className="refresh-button"
            onClick={loadNotifications}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="notification-stats">
          <div className="stat-card">
            <div className="stat-label">Total Notifications</div>
            <div className="stat-value">
              {notifications.length}
            </div>
            <div className="stat-subtext">
              All available system notifications
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Unread</div>
            <div className="stat-value">
              {unreadCount}
            </div>
            <div className="stat-subtext">
              Notifications requiring attention
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-label">High Priority</div>
            <div className="stat-value">
              {highPriorityCount}
            </div>
            <div className="stat-subtext">
              Important project or risk alerts
            </div>
          </div>
        </div>

        <div className="notifications-card">
          <div className="notifications-toolbar">
            <h2 className="toolbar-title">
              Notification Center
            </h2>

            <div className="filter-buttons">
              {['All', 'Unread', 'High Priority'].map((item) => (
                <button
                  key={item}
                  className={`filter-button ${
                    filter === item ? 'active' : ''
                  }`}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              Loading notifications...
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>

              <h3>
                {filter === 'All'
                  ? 'No Notifications'
                  : `No ${filter} Notifications`}
              </h3>

              <p>
                {filter === 'All'
                  ? 'New project alerts, verification updates and risk notifications will appear here.'
                  : 'There are currently no notifications matching this filter.'}
              </p>
            </div>
          ) : (
            <div className="notification-list">
              {filteredNotifications.map((notification, index) => {
                const priority = String(
                  getPriority(notification),
                ).toLowerCase()

                return (
                  <div
                    className={`notification-item ${
                      isUnread(notification) ? 'unread' : ''
                    }`}
                    key={notification.id || index}
                  >
                    <div className="notification-icon">
                      {getIcon(notification)}
                    </div>

                    <div className="notification-content">
                      <div className="notification-top">
                        <h3 className="notification-title">
                          {getTitle(notification)}

                          {isUnread(notification) && (
                            <span className="unread-dot" />
                          )}
                        </h3>

                        <span
                          className={`priority-badge ${
                            priority === 'high'
                              ? 'high'
                              : priority === 'medium'
                                ? 'medium'
                                : priority === 'low'
                                  ? 'low'
                                  : ''
                          }`}
                        >
                          {getPriority(notification)}
                        </span>
                      </div>

                      <p className="notification-message">
                        {getMessage(notification)}
                      </p>

                      <div className="notification-meta">
                        <span className="meta-item">
                          📁 {getProject(notification)}
                        </span>

                        <span className="meta-item">
                          •
                        </span>

                        <span className="meta-item">
                          {getDate(notification)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications