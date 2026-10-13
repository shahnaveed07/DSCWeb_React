import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { extractApiMessage, loginUser } from '../services/dscApi'
import { clearStoredSession, persistSessionFromResponse } from '../utils/auth'
import { FullScreenLoader } from '../components/ui/FullScreenLoader'

export function UserLoginPage({ session, onSessionChange }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loaderMessage, setLoaderMessage] = useState('Checking credentials...')

  if (session) {
    return <Navigate replace to={session.role === 'Admin' ? '/pages/adash' : '/pages/udash'} />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    setLoaderMessage('Checking credentials...')

    const wakeTimeout = setTimeout(() => {
      setLoaderMessage('Waking up server (this can take a few seconds)...')
    }, 4000)

    try {
      const payload = await loginUser(form)
      clearTimeout(wakeTimeout)
      const nextSession = persistSessionFromResponse(payload, {
        expiry: payload?.expiry,
        plan: payload?.plan,
        username: form.username,
      })

      if (!nextSession || nextSession.role !== 'User') {
        clearStoredSession()
        throw new Error('This account is not allowed on the user login page.')
      }

      setLoaderMessage('Login successful. Redirecting...')
      onSessionChange(nextSession)
      navigate('/pages/udash')
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
        <h1>User Login</h1>

        <form className={`form-stack ${loading ? 'is-processing' : ''}`} onSubmit={handleSubmit}>
          <label className="field">
            <span>Username</span>
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
            <span>Password</span>
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
                <span>Logging in...</span>
              </span>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        <div className="link-row">
          <Link to="/pages/alogin">Admin Portal</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </section>
  )
}
