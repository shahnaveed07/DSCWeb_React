import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { extractApiMessage, loginAdmin } from '../services/dscApi'
import { clearStoredSession, persistSessionFromResponse } from '../utils/auth'

export function AdminLoginPage({ session, onSessionChange }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (session) {
    return <Navigate replace to={session.role === 'Admin' ? '/pages/adash' : '/pages/udash'} />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = await loginAdmin(form)
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

      onSessionChange(nextSession)
      navigate('/pages/adash')
    } catch (submitError) {
      setError(extractApiMessage(submitError?.payload, submitError.message || 'Login failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="hero-eyebrow">Admin Login</span>
        <h1>Restricted control panel access.</h1>
        <p className="hero-copy">
          The admin surface is intentionally conservative in Phase 1: role-based
          authentication is preserved, and deeper CRUD workflows remain a separate
          follow-up once authenticated response contracts are fully captured.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
            <input
              autoComplete="username"
              onChange={(event) =>
                setForm((current) => ({ ...current, username: event.target.value }))
              }
              placeholder="Admin username"
              required
              type="text"
              value={form.username}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              autoComplete="current-password"
              onChange={(event) =>
                setForm((current) => ({ ...current, password: event.target.value }))
              }
              placeholder="Admin password"
              required
              type="password"
              value={form.password}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}

          <button className="button button-primary" disabled={loading} type="submit">
            {loading ? 'Signing in...' : 'Admin Login'}
          </button>
        </form>

        <div className="link-row">
          <a href="/pages/ulogin">User Login</a>
          <a href="/">Back to home</a>
        </div>
      </div>
    </section>
  )
}
