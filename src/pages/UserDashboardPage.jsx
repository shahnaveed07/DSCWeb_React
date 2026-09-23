import { useEffect, useState } from 'react'
import { useRemoteResource } from '../hooks/useRemoteResource'
import {
  ApiError,
  extractApiMessage,
  getCurrentOrder,
  getSecureDownload,
  isAuthError,
} from '../services/dscApi'
import { formatDateTime } from '../utils/format'

export function UserDashboardPage({ session, onSessionInvalid }) {
  const [copyLabel, setCopyLabel] = useState('Copy Key')
  const [downloadError, setDownloadError] = useState('')
  const [downloadLoading, setDownloadLoading] = useState(false)
  const { data, error, loading } = useRemoteResource(
    (signal) => getCurrentOrder(session.token, signal),
    [session?.token],
    { enabled: Boolean(session?.token) },
  )

  useEffect(() => {
    if (isAuthError(error)) onSessionInvalid()
  }, [error, onSessionInvalid])

  if (loading) {
    return (
      <section className="dashboard-shell">
        <div className="panel-card">
          <h1>Loading dashboard</h1>
          <p className="hero-copy">Fetching current order details from the live API.</p>
        </div>
      </section>
    )
  }

  if (error instanceof ApiError && error.status === 404) {
    return (
      <section className="dashboard-shell">
        <div className="panel-card">
          <h1>No active orders</h1>
          <p className="hero-copy">
            Your session is valid, but the backend did not return an active order yet.
          </p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="dashboard-shell">
        <div className="panel-card">
          <h1>Dashboard unavailable</h1>
          <p className="hero-copy">
            {extractApiMessage(error.payload, error.message || 'Unable to load your order.')}
          </p>
        </div>
      </section>
    )
  }

  const liveStatus = String(data?.status || 'Pending').toUpperCase()
  const livePlan = String(data?.plan || session.plan || 'Temp').toUpperCase()
  const liveExpiry = data?.expiry || data?.expiryTime || session.expiry
  const orderKey = String(data?.key || '')
  const isApproved = String(data?.status || '').trim().toLowerCase() === 'approved'
  const keyUsed = Boolean(data?.isKeyUsed)

  async function handleCopy() {
    await navigator.clipboard.writeText(orderKey)
    setCopyLabel('Copied')
    window.setTimeout(() => setCopyLabel('Copy Key'), 1400)
  }

  async function handleDownload() {
    setDownloadLoading(true)
    setDownloadError('')

    try {
      const payload = await getSecureDownload(
        session.token,
        String(data?.plan || session.plan || '').trim().toLowerCase(),
      )

      if (!payload?.url) {
        throw new Error('Download is unavailable for this account.')
      }

      window.open(payload.url, '_blank', 'noopener,noreferrer')
    } catch (downloadIssue) {
      setDownloadError(
        extractApiMessage(downloadIssue.payload, downloadIssue.message || 'Download failed.'),
      )
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <section className="dashboard-shell">
      <div className="dashboard-grid">
        <article className="panel-card">
          <span className="micro-label">Account</span>
          <h1>{String(session.username || 'user').toUpperCase()}</h1>
          <div className="detail-list">
            <div>
              <span>Plan</span>
              <strong>{livePlan}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{liveStatus}</strong>
            </div>
            <div>
              <span>Expiry</span>
              <strong>{formatDateTime(liveExpiry)}</strong>
            </div>
          </div>
        </article>

        <article className="panel-card">
          <span className="micro-label">Issued Key</span>
          <h2>{orderKey || 'Pending approval'}</h2>
          <p>
            {keyUsed
              ? 'The backend marks this key as used.'
              : 'The backend currently marks this key as unused or pending.'}
          </p>
          {orderKey ? (
            <button className="button button-secondary" onClick={handleCopy} type="button">
              {copyLabel}
            </button>
          ) : null}
        </article>
      </div>

      {isApproved ? (
        <div className="panel-card">
          <h3>Download access</h3>
          <p>Your order is approved. Request the secure download URL from the current API.</p>
          {downloadError ? <p className="form-error">{downloadError}</p> : null}
          <button className="button button-primary" disabled={downloadLoading} onClick={handleDownload} type="button">
            {downloadLoading ? 'Preparing download...' : 'Fetch Secure Download'}
          </button>
        </div>
      ) : (
        <div className="panel-card">
          <h3>Approval pending</h3>
          <p>
            The legacy business rule is preserved: downloads remain locked until the
            order status becomes approved.
          </p>
        </div>
      )}
    </section>
  )
}
