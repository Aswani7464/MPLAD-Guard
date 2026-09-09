function VerificationStatus({ status = 'Pending' }) {
  const normalizedStatus = status
    .toLowerCase()
    .replace(/\s+/g, '-')

  return (
    <span
      className={`verification-status verification-status-${normalizedStatus}`}
    >
      <span className="verification-status-dot"></span>
      {status}
    </span>
  )
}

export default VerificationStatus