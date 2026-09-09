function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icon">{icon}</div>

      <div className="stat-card-content">
        <p className="stat-card-title">{title}</p>
        <h3 className="stat-card-value">{value}</h3>
        {subtitle && <span className="stat-card-subtitle">{subtitle}</span>}
      </div>
    </div>
  )
}

export default StatCard
