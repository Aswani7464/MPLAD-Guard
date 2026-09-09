import VerificationStatus from './VerificationStatus'
import EvidenceCard from './EvidenceCard'

function VerificationPanel({
  status = 'Pending',
  verifier = 'Not assigned',
  evidence = [],
  loading = false,
  onVerify,
}) {

  function handleDecision(newStatus) {
    if (loading || !onVerify) {
      return
    }

    const messages = {
      Approved:
        'Are you sure you want to approve this project?',
      Rejected:
        'Are you sure you want to reject this project?',
      Pending:
        'Move this project back to pending verification?',
    }

    const confirmed = window.confirm(
      messages[newStatus]
    )

    if (confirmed) {
      onVerify(newStatus)
    }
  }

  return (
    <div className="verification-panel">

      <style>{`
        .verification-panel {
          width: 100%;
        }

        .verification-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e2e8f0;
        }

        .verification-panel-header h3 {
          margin: 0;
          color: #172033;
          font-size: 18px;
          font-weight: 800;
        }

        .verification-panel-header p {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .verification-details {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
          margin-top: 20px;
        }

        .verification-detail-box {
          padding: 15px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }

        .verification-detail-box span {
          display: block;
          margin-bottom: 5px;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
        }

        .verification-detail-box strong {
          color: #172033;
          font-size: 14px;
          font-weight: 800;
        }

        .verification-actions {
          margin-top: 24px;
          padding: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .verification-actions-title {
          margin: 0 0 6px;
          color: #172033;
          font-size: 15px;
          font-weight: 800;
        }

        .verification-actions-text {
          margin: 0 0 16px;
          color: #64748b;
          font-size: 12px;
        }

        .verification-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .verification-button {
          border: none;
          border-radius: 9px;
          padding: 11px 18px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .verification-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .verification-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .verification-button-approved {
          background: #059669;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.18);
        }

        .verification-button-approved:hover:not(:disabled) {
          background: #047857;
        }

        .verification-button-rejected {
          background: #dc2626;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.18);
        }

        .verification-button-rejected:hover:not(:disabled) {
          background: #b91c1c;
        }

        .verification-button-pending {
          background: #f59e0b;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.18);
        }

        .verification-button-pending:hover:not(:disabled) {
          background: #d97706;
        }

        .verification-current-status {
          margin-top: 15px;
          padding: 11px 13px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #475569;
          font-size: 12px;
        }

        .verification-current-status strong {
          color: #172033;
        }

        .verification-evidence {
          margin-top: 25px;
        }

        .verification-evidence h4 {
          margin: 0 0 12px;
          color: #172033;
          font-size: 14px;
          font-weight: 800;
        }

        .verification-no-evidence {
          padding: 20px;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          background: #f8fafc;
          color: #64748b;
          font-size: 12px;
          text-align: center;
        }

        .verification-loading {
          margin-top: 15px;
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
        }

        @media (max-width: 600px) {
          .verification-panel-header {
            flex-direction: column;
          }

          .verification-details {
            grid-template-columns: 1fr;
          }

          .verification-buttons {
            flex-direction: column;
          }

          .verification-button {
            width: 100%;
          }
        }
      `}</style>


      {/* HEADER */}

      <div className="verification-panel-header">

        <div>
          <h3>
            Verify Project
          </h3>

          <p>
            Review the submitted project before making
            a verification decision.
          </p>
        </div>

        <VerificationStatus status={status} />

      </div>


      {/* DETAILS */}

      <div className="verification-details">

        <div className="verification-detail-box">

          <span>
            Verified By
          </span>

          <strong>
            {verifier}
          </strong>

        </div>


        <div className="verification-detail-box">

          <span>
            Evidence
          </span>

          <strong>
            {evidence.length} Items
          </strong>

        </div>

      </div>


      {/* VERIFY ACTIONS */}

      <div className="verification-actions">

        <h4 className="verification-actions-title">
          Verification Decision
        </h4>

        <p className="verification-actions-text">
          If the project has been properly reviewed and
          meets the required conditions, approve it.
          If there are issues, reject it. You can also
          keep the project pending for further review.
        </p>


        <div className="verification-buttons">

          <button
            type="button"
            className="verification-button verification-button-approved"
            onClick={() => handleDecision('Approved')}
            disabled={loading}
          >
            ✓ Approve Project
          </button>


          <button
            type="button"
            className="verification-button verification-button-rejected"
            onClick={() => handleDecision('Rejected')}
            disabled={loading}
          >
            ✕ Reject Project
          </button>


          <button
            type="button"
            className="verification-button verification-button-pending"
            onClick={() => handleDecision('Pending')}
            disabled={loading}
          >
            ⏳ Set Pending
          </button>

        </div>


        <div className="verification-current-status">

          Current verification status:

          {' '}

          <strong>
            {status}
          </strong>

        </div>


        {loading && (
          <div className="verification-loading">
            Saving verification decision...
          </div>
        )}

      </div>


      {/* EVIDENCE */}

      <div className="verification-evidence">

        <h4>
          Supporting Evidence
        </h4>


        {evidence.length === 0 ? (

          <div className="verification-no-evidence">
            No evidence has been submitted for this project yet.
          </div>

        ) : (

          evidence.map((item, index) => (

            <EvidenceCard
              key={item.id || index}
              title={item.title}
              type={item.type}
              description={item.description}
              date={item.date}
            />

          ))

        )}

      </div>

    </div>
  )
}

export default VerificationPanel