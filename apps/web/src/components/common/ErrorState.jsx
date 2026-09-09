function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again later.',
  onRetry,
}) {
  return (
    <div className="error-state">
      <h3>{title}</h3>
      <p>{message}</p>

      {onRetry && (
        <button onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorState
