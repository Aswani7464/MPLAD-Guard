import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackToDashboard from '../components/common/BackToDashboard'

function Profile() {
  const navigate = useNavigate()

  const storedUser = localStorage.getItem('mplad_user')

  let user = {}

  try {
    const parsed = storedUser ? JSON.parse(storedUser) : {}
    user = parsed?.user || parsed || {}
  } catch {
    user = {}
  }

  const [emailNotifications, setEmailNotifications] = useState(true)
  const [projectNotifications, setProjectNotifications] = useState(true)

  const signOut = () => {
    localStorage.removeItem('mplad_user')
    navigate('/login', { replace: true })
  }

  const displayName = user.name || user.full_name || 'Administrator'
  const email = user.email || 'Not available'
  const mobile = user.mobile || user.phone || 'Not available'
  const state = user.state || 'Not available'
  const constituency = user.constituency || 'Not available'
  const role = user.role || 'MPLAD Head'

  return (
    <div style={styles.page}>
      <BackToDashboard />

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Settings</h1>
          <p style={styles.subtitle}>
            Manage your account, preferences and system settings.
          </p>
        </div>

        <div style={styles.roleBadge}>
          {role}
        </div>
      </div>

      <div style={styles.grid}>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>👤</div>
            <div>
              <h2 style={styles.cardTitle}>Account Information</h2>
              <p style={styles.cardDescription}>
                Your registered MPLAD-Guard account details.
              </p>
            </div>
          </div>

          <div style={styles.profileTop}>
            <div style={styles.avatar}>
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 style={styles.name}>{displayName}</h3>
              <p style={styles.muted}>{role}</p>
            </div>
          </div>

          <div style={styles.infoGrid}>
            <Info label="Full Name" value={displayName} />
            <Info label="Email Address" value={email} />
            <Info label="Mobile Number" value={mobile} />
            <Info label="State" value={state} />
            <Info label="Constituency" value={constituency} />
            <Info label="Account Role" value={role} />
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>🔐</div>
            <div>
              <h2 style={styles.cardTitle}>Security</h2>
              <p style={styles.cardDescription}>
                Manage your account security.
              </p>
            </div>
          </div>

          <div style={styles.settingRow}>
            <div>
              <strong style={styles.settingTitle}>Password</strong>
              <p style={styles.muted}>
                Your account password is protected.
              </p>
            </div>

            <button
              style={styles.secondaryButton}
              onClick={() => alert('Password change will be connected to the backend next.')}
            >
              Change Password
            </button>
          </div>

          <div style={styles.settingRow}>
            <div>
              <strong style={styles.settingTitle}>Account Status</strong>
              <p style={styles.muted}>
                Current status of your account.
              </p>
            </div>

            <span style={styles.activeBadge}>
              Active
            </span>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>🔔</div>
            <div>
              <h2 style={styles.cardTitle}>Notification Preferences</h2>
              <p style={styles.cardDescription}>
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <ToggleRow
            title="Project Notifications"
            description="Receive notifications about project creation and updates."
            checked={projectNotifications}
            onChange={setProjectNotifications}
          />

          <ToggleRow
            title="Email Notifications"
            description="Receive important system notifications by email."
            checked={emailNotifications}
            onChange={setEmailNotifications}
          />
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>⚙️</div>
            <div>
              <h2 style={styles.cardTitle}>System Information</h2>
              <p style={styles.cardDescription}>
                Information about the MPLAD-Guard system.
              </p>
            </div>
          </div>

          <div style={styles.systemRow}>
            <span>Application</span>
            <strong>MPLAD-Guard</strong>
          </div>

          <div style={styles.systemRow}>
            <span>Platform</span>
            <strong>Web Application</strong>
          </div>

          <div style={styles.systemRow}>
            <span>Backend</span>
            <strong>FastAPI</strong>
          </div>

          <div style={styles.systemRow}>
            <span>Database</span>
            <strong>Supabase</strong>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <div style={styles.icon}>🛡️</div>
            <div>
              <h2 style={styles.cardTitle}>Administration</h2>
              <p style={styles.cardDescription}>
                Access administrative project monitoring tools.
              </p>
            </div>
          </div>

          <button
            style={styles.primaryButton}
            onClick={() => navigate('/admin')}
          >
            Open Admin Panel →
          </button>
        </section>

        <section style={styles.signOutCard}>
          <div>
            <h2 style={styles.signOutTitle}>Sign Out</h2>
            <p style={styles.muted}>
              Sign out of your MPLAD-Guard account on this device.
            </p>
          </div>

          <button
            style={styles.dangerButton}
            onClick={signOut}
          >
            Sign Out
          </button>
        </section>

      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div style={styles.infoItem}>
      <span style={styles.infoLabel}>{label}</span>
      <strong style={styles.infoValue}>{value}</strong>
    </div>
  )
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div style={styles.toggleRow}>
      <div>
        <strong style={styles.settingTitle}>{title}</strong>
        <p style={styles.muted}>{description}</p>
      </div>

      <button
        onClick={() => onChange(!checked)}
        style={{
          ...styles.toggle,
          background: checked ? '#2563eb' : '#cbd5e1',
        }}
      >
        <span
          style={{
            ...styles.toggleCircle,
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
          }}
        />
      </button>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f6f8fc',
    padding: '28px',
    color: '#172033',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    gap: '20px',
    flexWrap: 'wrap',
  },

  title: {
    margin: 0,
    fontSize: '30px',
    fontWeight: 800,
  },

  subtitle: {
    margin: '7px 0 0',
    color: '#64748b',
    fontSize: '14px',
  },

  roleBadge: {
    background: '#eff6ff',
    color: '#2563eb',
    border: '1px solid #bfdbfe',
    padding: '9px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 700,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: '20px',
    maxWidth: '1200px',
  },

  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '22px',
    boxShadow: '0 4px 15px rgba(15, 23, 42, 0.04)',
  },

  signOutCard: {
    background: '#fff7f7',
    border: '1px solid #fecaca',
    borderRadius: '14px',
    padding: '22px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },

  icon: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },

  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 800,
  },

  cardDescription: {
    margin: '4px 0 0',
    color: '#64748b',
    fontSize: '12px',
  },

  profileTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '20px',
  },

  avatar: {
    width: '58px',
    height: '58px',
    borderRadius: '50%',
    background: '#2563eb',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 800,
  },

  name: {
    margin: 0,
    fontSize: '18px',
  },

  muted: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: '12px',
    lineHeight: 1.5,
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },

  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },

  infoLabel: {
    fontSize: '11px',
    color: '#64748b',
    fontWeight: 600,
  },

  infoValue: {
    fontSize: '13px',
    color: '#172033',
    wordBreak: 'break-word',
  },

  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    padding: '16px 0',
    borderBottom: '1px solid #edf2f7',
  },

  toggleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    padding: '15px 0',
    borderBottom: '1px solid #edf2f7',
  },

  settingTitle: {
    fontSize: '14px',
    color: '#172033',
  },

  secondaryButton: {
    border: '1px solid #cbd5e1',
    background: '#ffffff',
    color: '#2563eb',
    padding: '9px 13px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '12px',
  },

  primaryButton: {
    border: 'none',
    background: '#2563eb',
    color: '#ffffff',
    padding: '12px 18px',
    borderRadius: '9px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
  },

  dangerButton: {
    border: 'none',
    background: '#dc2626',
    color: '#ffffff',
    padding: '11px 18px',
    borderRadius: '9px',
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: '13px',
  },

  activeBadge: {
    background: '#dcfce7',
    color: '#15803d',
    padding: '6px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 700,
  },

  systemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #edf2f7',
    fontSize: '13px',
    color: '#64748b',
  },

  toggle: {
    width: '44px',
    height: '24px',
    border: 'none',
    borderRadius: '20px',
    padding: '2px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },

  toggleCircle: {
    display: 'block',
    width: '20px',
    height: '20px',
    background: '#ffffff',
    borderRadius: '50%',
    transition: 'transform 0.2s',
  },

  signOutTitle: {
    margin: 0,
    fontSize: '17px',
    color: '#991b1b',
  },
}

export default Profile