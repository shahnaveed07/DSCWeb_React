import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { extractApiMessage, loginAdmin } from '../services/dscApi'
import { clearStoredSession, persistSessionFromResponse } from '../utils/auth'
import { FullScreenLoader } from '../components/ui/FullScreenLoader'

export function AdminLoginPage({ session, onSessionChange }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaderMessage, setLoaderMessage] = useState('Checking admin credentials...')

  if (session) {
    return <Navigate replace to={session.role === 'Admin' ? '/pages/adash' : '/pages/udash'} />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    setLoaderMessage('Checking admin credentials...')

    const wakeTimeout = setTimeout(() => {
      setLoaderMessage('Waking up server (this can take a few seconds)...')
    }, 4000)

    try {
      const payload = await loginAdmin(form)
      clearTimeout(wakeTimeout)
      const nextSession = persistSessionFromResponse(payload, {
        isOwner:
          payload?.isOwner === true ||
          String(payload?.role || '').trim().toLowerCase() === 'owner',
        username: form.username,
      })

      if (!nextSession || nextSession.role !== 'Admin') {
        clearStoredSession()
        throw new Error('This account is not authorized for admin access.')
      }

      setLoaderMessage('Admin authentication verified. Redirecting...')
      onSessionChange(nextSession)
      navigate('/pages/adash')
    } catch (submitError) {
      clearTimeout(wakeTimeout)
      setError(extractApiMessage(submitError?.payload, submitError.message || 'Login failed.'))
    } finally {
      clearTimeout(wakeTimeout)
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <FullScreenLoader active={loading} message={loaderMessage} />
      <div className="auth-card">
        <span className="hero-eyebrow">Admin Login</span>
        <h1>WELCOME BACK ADMIN</h1>
        
        <form className={`form-stack ${loading ? 'is-processing' : ''}`} onSubmit={handleSubmit}>
          <label className="field">
            <span>Admin Username</span>
            <input
              autoComplete="username"
              onChange={(event) =>
                !loading && setForm((current) => ({ ...current, username: event.target.value }))
              }
              placeholder="Enter username"
              readOnly={loading}
              required
              type="text"
              value={form.username}
            />
          </label>

          <label className="field">
            <span>Admin Password</span>
            <input
              autoComplete="current-password"
              onChange={(event) =>
                !loading && setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Enter password"
              readOnly={loading}
              required
              type="password"
              value={form.password}
            />
          </label>

          {error ? <p className="form-error" role="alert">{error}</p> : null}

          <button
            className={`button button-primary button-full ${loading ? 'is-loading' : ''}`}
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <span className="button-loading-content">
                <span className="spinner-inline" aria-hidden="true" />
                <span>Checking credentials...</span>
              </span>
            ) : (
              <span>Authenticate</span>
            )}
          </button>
        </form>

        <div className="link-row">
          <Link to="/pages/ulogin">User Login</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </section>
  )
}
