import { useState } from 'react'
import { generateAdminKey, extractApiMessage, isAuthError } from '../services/dscApi'

const plans = ['free', 'streamer', 'sniper', 'special', 'aimbot', 'premium', 'customised']

export function GenerateKeyPage({ session, onSessionInvalid }) {
  const [plan, setPlan] = useState('')
  const [validDays, setValidDays] = useState('')
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true); setError(''); setKey('')
    try {
      const result = await generateAdminKey(session.token, plan, Number(validDays))
      const issued = String(result?.key || '').trim()
      if (!issued) throw new Error('Server returned an invalid key.')
      setKey(issued)
    } catch (issue) {
      if (isAuthError(issue)) onSessionInvalid()
      else setError(extractApiMessage(issue.payload, issue.message || 'Failed to generate key.'))
    } finally { setLoading(false) }
  }

  async function copyKey() {
    await navigator.clipboard.writeText(key)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return <section className="auth-shell"><div className="auth-card">
    <h1>Generate Access Key</h1><p className="hero-copy">Create a new key for software access.</p>
    <form className="form-stack" onSubmit={submit}>
      <label className="field"><span>Select Plan</span><select required value={plan} onChange={(event) => setPlan(event.target.value)}><option value="">-- Choose a Plan --</option>{plans.map((item) => <option key={item} value={item}>{item.replace(/^./, (c) => c.toUpperCase())} Panel</option>)}</select></label>
      <label className="field"><span>Valid Days</span><input required min="1" type="number" placeholder="Example: 30" value={validDays} onChange={(event) => setValidDays(event.target.value)} /></label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="button button-primary" disabled={loading} type="submit">{loading ? 'Generating key...' : 'Generate Key'}</button>
    </form>
    {key ? <article className="panel-card"><p className="micro-label">Generated Key</p><strong className="generated-key">{key}</strong><button className="button button-secondary" onClick={copyKey} type="button">{copied ? 'Copied' : 'Copy Key'}</button></article> : null}
  </div></section>
}
