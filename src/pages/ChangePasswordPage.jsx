import { useEffect, useState } from 'react'
import { changePassword, extractApiMessage, isAuthError } from '../services/dscApi'

export function ChangePasswordPage({ session, onSessionInvalid }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (String(session?.plan || '').trim().toLowerCase() === 'free') {
      setError('Free users cannot change password.')
    }
  }, [session?.plan])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (String(session?.plan || '').trim().toLowerCase() === 'free') {
      setError('Free users cannot change password.')
      return
    }

    if (form.newPassword.length < 3) {
      setError('New password must be at least 3 characters long.')
      return
    }

    if (form.newPassword === form.currentPassword) {
      setError('New password must be different from the current password.')
      return
    }

    setLoading(true)

    try {
      await changePassword(session.token, form.currentPassword, form.newPassword)
      setSuccess('Password updated successfully.')
      setForm({ currentPassword: '', newPassword: '' })
    } catch (submitError) {
      if (isAuthError(submitError)) {
        onSessionInvalid()
        return
      }
      setError(extractApiMessage(submitError.payload, submitError.message || 'Password update failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="hero-eyebrow">Password</span>
        <h1>Change account password.</h1>
        <p className="hero-copy">
          This form preserves the current authenticated password-change contract
          exposed by the live backend.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Current password</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, currentPassword: event.target.value }))
              }
              required
              type="password"
              value={form.currentPassword}
            />
          </label>

          <label className="field">
            <span>New password</span>
            <input
              minLength={3}
              onChange={(event) =>
                setForm((current) => ({ ...current, newPassword: event.target.value }))
              }
              required
              type="password"
              value={form.newPassword}
            />
          </label>

          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}

          <button className="button button-primary" disabled={loading} type="submit">
            {loading ? 'Saving...' : 'Update Password'}
          </button>
        </form>
      </div>
    </section>
  )
}
