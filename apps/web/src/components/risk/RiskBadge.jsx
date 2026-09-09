function RiskBadge({ level = 'Low' }) {
  const normalizedLevel = level.toLowerCase()

  return (
    <span className={`risk-badge risk-badge-${normalizedLevel}`}>
      <span className="risk-badge-dot"></span>
      {level}
    </span>
  )
}

export default RiskBadge

