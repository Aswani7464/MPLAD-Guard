import { Link } from 'react-router-dom'

function BackToDashboard() {
  return (
    <>
      <style>{`
        .back-to-dashboard {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          padding: 9px 14px;
          border: 1px solid #dbe3ee;
          border-radius: 9px;
          background: #ffffff;
          color: #2563eb;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
        }

        .back-to-dashboard:hover {
          background: #f8fbff;
          border-color: #2563eb;
          transform: translateX(-2px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.10);
        }

        .back-to-dashboard-arrow {
          font-size: 17px;
          line-height: 1;
        }
      `}</style>

      <Link to="/dashboard" className="back-to-dashboard">
        <span className="back-to-dashboard-arrow">←</span>
        <span>Back to Dashboard</span>
      </Link>
    </>
  )
}

export default BackToDashboard