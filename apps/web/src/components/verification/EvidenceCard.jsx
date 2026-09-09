function EvidenceCard({
  title = 'Project Evidence',
  type = 'Document',
  description = 'No evidence description available.',
  date = 'Not available',
}) {
  return (
    <div className="evidence-card">
      <div className="evidence-card-icon">
        📄
      </div>

      <div className="evidence-card-content">
        <div className="evidence-card-header">
          <h4>{title}</h4>
          <span>{type}</span>
        </div>

        <p>{description}</p>

        <small>
          Uploaded: {date}
        </small>
      </div>

      <button type="button" className="evidence-action">
        View Evidence
      </button>
    </div>
  )
}

export default EvidenceCard
