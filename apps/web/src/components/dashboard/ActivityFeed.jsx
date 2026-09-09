function ActivityFeed({ activities = [] }) {
  return (
    <div className="activity-feed">
      <div className="activity-header">
        <div>
          <h3>Recent Activity</h3>
          <p>Latest project updates</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <p className="activity-empty">No recent activity.</p>
      ) : (
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div className="activity-item" key={activity.id || index}>
              <div className="activity-dot"></div>

              <div className="activity-content">
                <strong>{activity.title}</strong>

                {activity.description && (
                  <p>{activity.description}</p>
                )}

                {activity.time && (
                  <span>{activity.time}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityFeed
