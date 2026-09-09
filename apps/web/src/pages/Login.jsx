import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'

function generateCaptcha() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    )
  }

  return result
}

function Login() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    captcha: '',
  })

  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())

    setForm({
      ...form,
      captcha: '',
    })
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')

    if (!form.email || !form.password || !form.captcha) {
      setError('Please fill in all required fields.')
      return
    }

    if (
      form.captcha.trim().toUpperCase() !== captcha
    ) {
      setError('Invalid CAPTCHA. Please try again.')

      setCaptcha(generateCaptcha())

      setForm({
        ...form,
        captcha: '',
      })

      return
    }

    try {
      setLoading(true)

      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      if (response) {
        localStorage.setItem(
          'mplad_user',
          JSON.stringify(response)
        )
      }

      navigate('/dashboard')
    } catch (err) {
      setError(
        err.message || 'Login failed. Please try again.'
      )

      setCaptcha(generateCaptcha())

      setForm({
        ...form,
        captcha: '',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* LEFT SIDE */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.flag}>🇮🇳</div>

          <h1 style={styles.brand}>
            MPLAD-Guard
          </h1>

          <p style={styles.tagline}>
            Project Monitoring & Risk Analysis System
          </p>

          <div style={styles.divider}></div>

          <h2 style={styles.heading}>
            Transparent Development.
            <br />
            Smarter Monitoring.
          </h2>

          <p style={styles.description}>
            A secure platform for monitoring MPLAD
            projects, identifying risks, tracking
            progress and ensuring transparency.
          </p>

          <div style={styles.features}>
            <div style={styles.feature}>
              <span>✓</span>
              <p>Project Monitoring</p>
            </div>

            <div style={styles.feature}>
              <span>✓</span>
              <p>Risk Analysis</p>
            </div>

            <div style={styles.feature}>
              <span>✓</span>
              <p>Verification & Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.rightPanel}>
        <div style={styles.loginCard}>
          <div style={styles.mobileFlag}>
            🇮🇳
          </div>

          <h2 style={styles.loginTitle}>
            Welcome Back
          </h2>

          <p style={styles.loginSubtitle}>
            Sign in to your MPLAD-Guard dashboard
          </p>

          {error && (
            <div style={styles.errorBox}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <label style={styles.label}>
              Official Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your official email"
              value={form.email}
              onChange={handleChange}
              style={styles.input}
            />

            {/* PASSWORD */}
            <label style={styles.label}>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
            />

            {/* CAPTCHA */}
            <label style={styles.label}>
              CAPTCHA
            </label>

            <div style={styles.captchaRow}>
              <div style={styles.captchaBox}>
                {captcha}
              </div>

              <button
                type="button"
                onClick={refreshCaptcha}
                style={styles.refreshButton}
                title="Refresh CAPTCHA"
              >
                ↻
              </button>
            </div>

            <input
              type="text"
              name="captcha"
              placeholder="Enter CAPTCHA"
              value={form.captcha}
              onChange={handleChange}
              autoComplete="off"
              style={styles.input}
            />

            {/* REMEMBER / FORGOT */}
            <div style={styles.options}>
              <label style={styles.remember}>
                <input
                  type="checkbox"
                />
                Remember me
              </label>

              <button
                type="button"
                style={styles.forgotButton}
                onClick={() =>
                  setError(
                    'Password recovery will be available soon.'
                  )
                }
              >
                Forgot password?
              </button>
            </div>

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div style={styles.registerText}>
            Don't have an account?{' '}

            <Link
              to="/register"
              style={styles.registerLink}
            >
              Register as MPLAD Head
            </Link>
          </div>

          <div style={styles.footer}>
            🇮🇳 Government Project Monitoring System
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily:
      'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background: '#f5f7fa',
  },

  leftPanel: {
    width: '46%',
    minHeight: '100vh',
    background:
      'linear-gradient(145deg, #0b3d91 0%, #123f7a 55%, #092b57 100%)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
  },

  leftContent: {
    padding: '60px',
    maxWidth: '570px',
  },

  flag: {
    fontSize: '58px',
    marginBottom: '20px',
  },

  brand: {
    fontSize: '40px',
    margin: '0 0 10px',
    fontWeight: '800',
    letterSpacing: '-1px',
  },

  tagline: {
    fontSize: '17px',
    lineHeight: '1.6',
    margin: 0,
    opacity: 0.9,
  },

  divider: {
    width: '70px',
    height: '4px',
    background: '#f2b632',
    margin: '30px 0',
    borderRadius: '5px',
  },

  heading: {
    fontSize: '30px',
    lineHeight: '1.35',
    margin: '0 0 18px',
  },

  description: {
    fontSize: '16px',
    lineHeight: '1.8',
    opacity: 0.88,
    margin: 0,
  },

  features: {
    marginTop: '30px',
  },

  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '13px',
    fontSize: '15px',
  },

  rightPanel: {
    flex: 1,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '35px',
    boxSizing: 'border-box',
  },

  loginCard: {
    width: '100%',
    maxWidth: '470px',
    background: '#ffffff',
    padding: '40px',
    borderRadius: '18px',
    boxShadow:
      '0 15px 45px rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
  },

  mobileFlag: {
    fontSize: '34px',
    marginBottom: '10px',
  },

  loginTitle: {
    margin: '0 0 7px',
    fontSize: '30px',
    color: '#172033',
  },

  loginSubtitle: {
    margin: '0 0 25px',
    color: '#697386',
    fontSize: '15px',
  },

  errorBox: {
    background: '#fff1f0',
    border: '1px solid #ffc7c3',
    color: '#b42318',
    padding: '12px 14px',
    borderRadius: '9px',
    marginBottom: '18px',
    fontSize: '14px',
  },

  label: {
    display: 'block',
    marginTop: '16px',
    marginBottom: '7px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#344054',
  },

  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 14px',
    border: '1px solid #d0d5dd',
    borderRadius: '9px',
    fontSize: '14px',
    outline: 'none',
    background: '#ffffff',
  },

  captchaRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'stretch',
  },

  captchaBox: {
    flex: 1,
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'repeating-linear-gradient(135deg, #eef2f7 0px, #eef2f7 5px, #e1e7ef 5px, #e1e7ef 10px)',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '7px',
    color: '#172033',
    userSelect: 'none',
    textDecoration: 'line-through',
  },

  refreshButton: {
    width: '50px',
    border: '1px solid #d0d5dd',
    borderRadius: '9px',
    background: '#ffffff',
    fontSize: '25px',
    color: '#0b3d91',
    cursor: 'pointer',
  },

  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '18px',
    fontSize: '13px',
  },

  remember: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    color: '#667085',
  },

  forgotButton: {
    border: 'none',
    background: 'transparent',
    color: '#0b3d91',
    cursor: 'pointer',
    fontSize: '13px',
    padding: 0,
  },

  loginButton: {
    width: '100%',
    marginTop: '25px',
    padding: '14px',
    border: 'none',
    borderRadius: '9px',
    background: '#0b3d91',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  registerText: {
    textAlign: 'center',
    marginTop: '22px',
    color: '#667085',
    fontSize: '14px',
  },

  registerLink: {
    color: '#0b3d91',
    fontWeight: '700',
    textDecoration: 'none',
  },

  footer: {
    textAlign: 'center',
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid #eaecf0',
    color: '#98a2b3',
    fontSize: '12px',
  },
}

export default Login