import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api.js'

function generateCaptcha() {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''

  for (let i = 0; i < 6; i += 1) {
    result += characters.charAt(
      Math.floor(Math.random() * characters.length)
    )
  }

  return result
}

function Register() {
  const navigate = useNavigate()

  const [captcha, setCaptcha] = useState(generateCaptcha())

  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    state: '',
    constituency: '',
    password: '',
    confirmPassword: '',
    captcha: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha())
    setForm((previous) => ({
      ...previous,
      captcha: '',
    }))
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.state ||
      !form.constituency ||
      !form.password ||
      !form.confirmPassword ||
      !form.captcha
    ) {
      setError('Please fill in all fields.')
      return
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (form.captcha.trim().toUpperCase() !== captcha) {
      setError('Invalid CAPTCHA. Please try again.')
      refreshCaptcha()
      return
    }

    setLoading(true)

    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          state: form.state,
          constituency: form.constituency,
          password: form.password,
        }),
      })

      setMessage(
        response?.message || 'Registration successful. Please login.'
      )

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (requestError) {
      setError(requestError.message || 'Registration failed.')
      refreshCaptcha()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#f4f7fb',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* LEFT PANEL */}
      <div
        style={{
          width: '45%',
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, #063b78 0%, #0b5cab 55%, #0b6fc4 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            top: '-100px',
            right: '-100px',
          }}
        />

        <div
          style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            bottom: '-80px',
            left: '-80px',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              fontSize: '58px',
              marginBottom: '20px',
            }}
          >
            🇮🇳
          </div>

          <div
            style={{
              fontSize: '15px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              opacity: 0.85,
              marginBottom: '12px',
            }}
          >
            Government Project Monitoring
          </div>

          <h1
            style={{
              fontSize: '42px',
              lineHeight: 1.15,
              margin: '0 0 20px',
              fontWeight: 700,
            }}
          >
            MPLAD-Guard
          </h1>

          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.7,
              maxWidth: '500px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
            }}
          >
            Project Monitoring and Risk Analysis System for transparent,
            accountable and data-driven MPLADS project management.
          </p>

          <div
            style={{
              marginTop: '40px',
              padding: '20px',
              borderLeft: '4px solid rgba(255,255,255,0.8)',
              background: 'rgba(255,255,255,0.08)',
              borderRadius: '0 10px 10px 0',
              maxWidth: '500px',
            }}
          >
            <strong style={{ display: 'block', marginBottom: '8px' }}>
              MPLAD Head Registration
            </strong>

            <span
              style={{
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              Create an official account to monitor sanctioned projects,
              project progress, risks and verification information.
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        style={{
          width: '55%',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '620px',
            background: '#ffffff',
            borderRadius: '18px',
            padding: '38px',
            boxSizing: 'border-box',
            boxShadow: '0 15px 45px rgba(20, 55, 90, 0.12)',
            border: '1px solid #e6edf5',
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                fontSize: '13px',
                color: '#1769aa',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px',
              }}
            >
              Official Registration
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: '30px',
                color: '#17324d',
              }}
            >
              Create MPLAD Head Account
            </h2>

            <p
              style={{
                color: '#718096',
                marginTop: '8px',
                marginBottom: 0,
              }}
            >
              Register your official details to access MPLAD-Guard.
            </p>
          </div>

          {error && (
            <div
              style={{
                background: '#fff1f2',
                border: '1px solid #fecdd3',
                color: '#be123c',
                padding: '12px 14px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontSize: '14px',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {message && (
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                color: '#047857',
                padding: '12px 14px',
                borderRadius: '8px',
                marginBottom: '18px',
                fontSize: '14px',
              }}
            >
              ✓ {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* NAME */}
            <label style={labelStyle}>Full Name</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              style={inputStyle}
            />

            {/* EMAIL */}
            <label style={labelStyle}>Official Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter official email"
              style={inputStyle}
            />

            {/* MOBILE */}
            <label style={labelStyle}>Mobile Number</label>

            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter 10-digit mobile number"
              maxLength="10"
              style={inputStyle}
            />

            {/* STATE + CONSTITUENCY */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              <div>
                <label style={labelStyle}>State</label>

                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Constituency</label>

                <input
                  type="text"
                  name="constituency"
                  value={form.constituency}
                  onChange={handleChange}
                  placeholder="Enter constituency"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <label style={labelStyle}>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              style={inputStyle}
            />

            {/* CONFIRM PASSWORD */}
            <label style={labelStyle}>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              style={inputStyle}
            />

            {/* CAPTCHA */}
            <label style={labelStyle}>Security Verification</label>

            <div
              style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background:
                    'linear-gradient(135deg, #eef5ff, #dbeafe)',
                  border: '1px solid #c7d7eb',
                  borderRadius: '8px',
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '7px',
                  color: '#174a7c',
                  userSelect: 'none',
                }}
              >
                {captcha}
              </div>

              <button
                type="button"
                onClick={refreshCaptcha}
                style={{
                  height: '48px',
                  width: '48px',
                  border: '1px solid #c7d7eb',
                  borderRadius: '8px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
                title="Refresh CAPTCHA"
              >
                ↻
              </button>
            </div>

            <input
              type="text"
              name="captcha"
              value={form.captcha}
              onChange={handleChange}
              placeholder="Enter CAPTCHA"
              style={inputStyle}
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '10px',
                padding: '14px',
                border: 'none',
                borderRadius: '9px',
                background: loading ? '#8bb8dc' : '#1769aa',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 6px 18px rgba(23, 105, 170, 0.22)',
              }}
            >
              {loading ? 'Creating Account...' : 'Create MPLAD Head Account'}
            </button>
          </form>

          <div
            style={{
              textAlign: 'center',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #edf2f7',
              color: '#718096',
              fontSize: '14px',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#1769aa',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 700,
  color: '#334e68',
  marginBottom: '7px',
  marginTop: '15px',
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '12px 13px',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  color: '#243b53',
  background: '#ffffff',
}

export default Register