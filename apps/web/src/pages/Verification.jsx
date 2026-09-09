import { useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../services/api'
import VerificationPanel from '../components/verification/VerificationPanel'
import DocumentViewer from '../components/verification/DocumentViewer'
import BackToDashboard from '../components/common/BackToDashboard'

function Verification() {
  const [projects, setProjects] = useState([])
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [verification, setVerification] = useState(null)

  const [loading, setLoading] = useState(true)
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProjects()
  }, [])

  useEffect(() => {
    if (selectedProjectId) {
      loadVerification(selectedProjectId)
    }
  }, [selectedProjectId])

  async function loadProjects() {
    try {
      setLoading(true)
      setError('')

      const data = await apiRequest('/projects/')

      const projectList = Array.isArray(data)
        ? data
        : Array.isArray(data?.projects)
          ? data.projects
          : []

      setProjects(projectList)

      if (projectList.length > 0) {
        setSelectedProjectId(String(projectList[0].id))
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  async function loadVerification(projectId) {
    try {
      setVerificationLoading(true)
      setError('')

      const data = await apiRequest(`/verification/${projectId}`)

      /*
       * Backend may return the verification object directly
       * or inside a "verification" property.
       */
      const verificationData =
        data?.verification || data || null

      setVerification(verificationData)
    } catch (err) {
      /*
       * A project may not have a verification record yet.
       * In that case we show Pending instead of breaking the page.
       */
      console.warn('Verification record not available:', err)

      setVerification({
        id: null,
        project_id: Number(projectId),
        status: 'Pending',
        verifier: 'Not assigned',
        evidence: [],
      })
    } finally {
      setVerificationLoading(false)
    }
  }

  async function handleVerify(newStatus) {
    if (!selectedProjectId) {
      return
    }

    try {
      setVerificationLoading(true)
      setError('')

      const currentVerification = verification || {}

      let result

      /*
       * If a verification record already exists,
       * update it.
       */
      if (currentVerification.id) {
        result = await apiRequest(
          `/verification/${currentVerification.id}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              status: newStatus,
              verifier: 'Admin',
            }),
          }
        )
      } else {
        /*
         * If there is no verification record,
         * create one.
         */
        result = await apiRequest('/verification/', {
          method: 'POST',
          body: JSON.stringify({
            project_id: Number(selectedProjectId),
            status: newStatus,
            verifier: 'Admin',
            evidence: [],
          }),
        })
      }

      const updatedVerification =
        result?.verification ||
        result?.data ||
        result

      setVerification(updatedVerification)

      /*
       * Reload from backend so the displayed
       * status is always the real saved status.
       */
      await loadVerification(selectedProjectId)
    } catch (err) {
      console.error(err)
      setError(
        err.message ||
        'Unable to update project verification.'
      )
    } finally {
      setVerificationLoading(false)
    }
  }

  const selectedProject = useMemo(() => {
    return projects.find(
      (project) =>
        String(project.id) === String(selectedProjectId)
    )
  }, [projects, selectedProjectId])

  const completion = Number(
    selectedProject?.completion_percentage || 0
  )

  const projectStatus =
    selectedProject?.status || 'Unknown'

  const verificationStatus =
    verification?.status ||
    verification?.verification_status ||
    'Pending'

  const evidence = Array.isArray(verification?.evidence)
    ? verification.evidence
    : []

  const verifier =
    verification?.verifier ||
    verification?.verified_by ||
    'Not assigned'

  return (
    <div className="verification-dashboard-page">

      <style>{`
        .verification-dashboard-page {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          padding-bottom: 30px;
        }

        .verification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
        }

        .verification-title-area h1 {
          margin: 0;
          font-size: 30px;
          font-weight: 800;
          color: #172033;
          letter-spacing: -0.5px;
        }

        .verification-title-area p {
          margin: 7px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .verification-project-selector {
          min-width: 280px;
        }

        .verification-project-selector label {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          font-weight: 700;
          color: #475569;
        }

        .verification-project-selector select {
          width: 100%;
          padding: 11px 13px;
          border: 1px solid #dbe3ee;
          border-radius: 9px;
          background: #ffffff;
          color: #172033;
          font-size: 13px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .verification-project-selector select:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.08);
        }

        .verification-project-banner {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .verification-project-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
        }

        .verification-project-name {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: #172033;
        }

        .verification-project-location {
          margin: 6px 0 0;
          font-size: 13px;
          color: #64748b;
        }

        .verification-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status-pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .status-approved {
          background: #ecfdf5;
          color: #047857;
        }

        .status-rejected {
          background: #fef2f2;
          color: #b91c1c;
        }

        .status-default {
          background: #eff6ff;
          color: #2563eb;
        }

        .verification-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
        }

        .verification-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .verification-stat {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .verification-stat-label {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .verification-stat-value {
          color: #172033;
          font-size: 21px;
          font-weight: 800;
          word-break: break-word;
        }

        .verification-stat-subtitle {
          margin-top: 5px;
          color: #94a3b8;
          font-size: 11px;
        }

        .verification-section {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 22px;
          margin-bottom: 22px;
          box-shadow: 0 3px 14px rgba(15, 23, 42, 0.04);
        }

        .verification-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 18px;
        }

        .verification-section-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #172033;
        }

        .verification-section-header p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .verification-progress {
          margin-top: 17px;
        }

        .verification-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .verification-progress-label {
          font-size: 12px;
          font-weight: 700;
          color: #475569;
        }

        .verification-progress-value {
          font-size: 12px;
          font-weight: 800;
          color: #2563eb;
        }

        .verification-progress-track {
          height: 8px;
          border-radius: 999px;
          background: #e8eef7;
          overflow: hidden;
        }

        .verification-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: #2563eb;
          transition: width 0.3s ease;
        }

        .verification-empty {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 14px;
          padding: 45px 20px;
          text-align: center;
          color: #64748b;
        }

        .verification-empty-title {
          margin: 0 0 7px;
          color: #334155;
          font-size: 17px;
          font-weight: 800;
        }

        .verification-empty-text {
          margin: 0;
          font-size: 13px;
        }

        .verification-error {
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #c2410c;
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 20px;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 1000px) {
          .verification-summary-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .verification-header {
            flex-direction: column;
          }

          .verification-project-selector {
            width: 100%;
            min-width: 0;
          }
        }

        @media (max-width: 600px) {
          .verification-summary-grid {
            grid-template-columns: 1fr;
          }

          .verification-project-top {
            flex-direction: column;
            align-items: flex-start;
          }

          .verification-title-area h1 {
            font-size: 25px;
          }

          .verification-section {
            padding: 16px;
          }
        }
      `}</style>

      <BackToDashboard />

      <div className="verification-header">

        <div className="verification-title-area">
          <h1>Verification</h1>

          <p>
            Review project evidence, verify the project,
            and approve or reject the submission.
          </p>
        </div>

        <div className="verification-project-selector">

          <label htmlFor="verification-project">
            Select Project
          </label>

          <select
            id="verification-project"
            value={selectedProjectId}
            onChange={(event) => {
              setSelectedProjectId(event.target.value)
            }}
            disabled={loading || projects.length === 0}
          >
            {projects.length === 0 ? (
              <option value="">
                No projects available
              </option>
            ) : (
              projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))
            )}
          </select>

        </div>

      </div>

      {error && (
        <div className="verification-error">
          {error}
        </div>
      )}

      {loading ? (

        <div className="verification-empty">
          <h3 className="verification-empty-title">
            Loading verification data...
          </h3>

          <p className="verification-empty-text">
            Please wait while the projects are loaded.
          </p>
        </div>

      ) : projects.length === 0 ? (

        <div className="verification-empty">
          <h3 className="verification-empty-title">
            No projects available
          </h3>

          <p className="verification-empty-text">
            Create a project first to begin verification.
          </p>
        </div>

      ) : (

        <>

          <div className="verification-project-banner">

            <div className="verification-project-top">

              <div>
                <h2 className="verification-project-name">
                  {selectedProject?.name || 'Project'}
                </h2>

                <p className="verification-project-location">
                  {selectedProject?.location || 'Location not provided'}
                </p>
              </div>

              <div
                className={`verification-status ${
                  verificationStatus.toLowerCase() === 'approved'
                    ? 'status-approved'
                    : verificationStatus.toLowerCase() === 'rejected'
                      ? 'status-rejected'
                      : verificationStatus.toLowerCase() === 'pending'
                        ? 'status-pending'
                        : 'status-default'
                }`}
              >
                <span className="verification-status-dot"></span>

                {verificationStatus}
              </div>

            </div>

            <div className="verification-progress">

              <div className="verification-progress-top">

                <span className="verification-progress-label">
                  Project Completion
                </span>

                <span className="verification-progress-value">
                  {completion}%
                </span>

              </div>

              <div className="verification-progress-track">

                <div
                  className="verification-progress-fill"
                  style={{
                    width: `${Math.min(
                      Math.max(completion, 0),
                      100
                    )}%`
                  }}
                />

              </div>

            </div>

          </div>


          <div className="verification-summary-grid">

            <div className="verification-stat">
              <div className="verification-stat-label">
                Project Status
              </div>

              <div className="verification-stat-value">
                {projectStatus}
              </div>

              <div className="verification-stat-subtitle">
                Current project state
              </div>
            </div>


            <div className="verification-stat">
              <div className="verification-stat-label">
                Completion
              </div>

              <div className="verification-stat-value">
                {completion}%
              </div>

              <div className="verification-stat-subtitle">
                Reported progress
              </div>
            </div>


            <div className="verification-stat">
              <div className="verification-stat-label">
                Evidence
              </div>

              <div className="verification-stat-value">
                {evidence.length}
              </div>

              <div className="verification-stat-subtitle">
                Supporting items
              </div>
            </div>


            <div className="verification-stat">
              <div className="verification-stat-label">
                Verified By
              </div>

              <div className="verification-stat-value">
                {verifier}
              </div>

              <div className="verification-stat-subtitle">
                Verification reviewer
              </div>
            </div>

          </div>


          <div className="verification-section">

            <div className="verification-section-header">

              <div>
                <h2>
                  Project Verification
                </h2>

                <p>
                  Review the project and select the appropriate
                  verification decision.
                </p>
              </div>

            </div>

            <VerificationPanel
              status={verificationStatus}
              verifier={verifier}
              evidence={evidence}
              loading={verificationLoading}
              onVerify={handleVerify}
            />

          </div>


          <div className="verification-section">

            <div className="verification-section-header">

              <div>
                <h2>
                  Project Documents
                </h2>

                <p>
                  Review supporting documents and submitted evidence.
                </p>
              </div>

            </div>

            <DocumentViewer />

          </div>

        </>

      )}

    </div>
  )
}

export default Verification