import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useRemoteResource } from '../hooks/useRemoteResource'
import {
  extractApiMessage,
  getCurrentOrder,
  getSecureDownload,
  isAuthError,
} from '../services/dscApi'
import { formatDateTime } from '../utils/format'

export function UserDashboardPage({ session, onSessionInvalid }) {
  const [copiedKey, setCopiedKey] = useState(false)
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
      <div className="center-wrap" style={{ maxWidth: '960px', margin: '0 auto', padding: '20px' }}>
        <section className="panel" style={{ padding: '28px', borderRadius: '12px', textAlign: 'center' }}>
          <div className="skeleton-line" style={{ height: '24px', width: '200px', margin: '0 auto 16px', borderRadius: '4px' }} />
          <div className="skeleton-line" style={{ height: '40px', width: '320px', margin: '0 auto 20px', borderRadius: '8px' }} />
          <p style={{ color: 'var(--muted)' }}>Retrieving your order and subscription status...</p>
        </section>
      </div>
    )
  }

  const liveStatus = String(data?.status || 'Pending').trim()
  const isApproved = liveStatus.toLowerCase() === 'approved'
  const isRejected = liveStatus.toLowerCase() === 'rejected'
  const isPending = !isApproved && !isRejected

  const livePlan = String(data?.plan || session?.plan || 'Temp').trim()
  const isFreePlan = livePlan.toLowerCase() === 'free'
  const liveExpiry = data?.expiry || data?.expiryTime || session?.expiry
  const isExpired = Boolean(data?.isExpired || session?.isExpired)
  const orderKey = String(data?.key || '').trim()
  const keyUsed = Boolean(data?.isKeyUsed)

  async function handleCopyKey() {
    if (!orderKey) return
    await navigator.clipboard.writeText(orderKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 1500)
  }

  async function handleDownload() {
    setDownloadLoading(true)
    setDownloadError('')

    try {
      const payload = await getSecureDownload(
        session.token,
        livePlan.toLowerCase(),
      )

      if (!payload?.url) {
        throw new Error('Download URL could not be retrieved.')
      }

      window.open(payload.url, '_blank', 'noopener,noreferrer')
    } catch (downloadIssue) {
      setDownloadError(
        extractApiMessage(
          downloadIssue.payload,
          downloadIssue.message || 'Download failed. Please try again.',
        ),
      )
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    <div className="center-wrap" style={{ maxWidth: '960px', margin: '0 auto', padding: '20px' }}>
      <section className="panel" style={{ padding: '28px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '24px' }}>
          <div>
            <span className="hero-eyebrow">Client Portal</span>
            <h1 className="auth-title mt-6">Welcome, {String(session.username || 'User').toUpperCase()}</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!isFreePlan ? (
              <NavLink to="/pages/change" className="btn btn-secondary btn-sm">
                Change Password
              </NavLink>
            ) : null}
            <NavLink to="/pages/products" className="btn btn-outline btn-sm">
              Upgrade / Renew
            </NavLink>
          </div>
        </div>

        {/* Status Alerts */}
        {isPending ? (
          <div className="alert-box alert-warning mb-20" style={{ padding: '14px 18px', borderRadius: '8px' }}>
            <div className="alert-content">
              <div>
                <strong className="text-warning">⚠️ Order Pending Review</strong>
                <p className="mb-0 mt-4" style={{ fontSize: '0.92rem' }}>
                  Your order is currently awaiting admin verification. Access keys and downloads will be enabled once approved.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {isExpired ? (
          <div className="alert-box alert-danger mb-20" style={{ padding: '14px 18px', borderRadius: '8px' }}>
            <div className="alert-content">
              <div>
                <strong className="text-danger">⛔ Subscription Expired</strong>
                <p className="mb-0 mt-4" style={{ fontSize: '0.92rem' }}>
                  Your access has expired. Please renew your plan from the products catalog to restore access.
                </p>
              </div>
              <NavLink to="/pages/products" className="btn btn-primary btn-sm">
                Renew Access
              </NavLink>
            </div>
          </div>
        ) : null}

        {isRejected ? (
          <div className="alert-box alert-danger mb-20" style={{ padding: '14px 18px', borderRadius: '8px' }}>
            <strong className="text-danger">❌ Order Not Approved</strong>
            <p className="mb-0 mt-4" style={{ fontSize: '0.92rem' }}>
              Your order could not be verified. Please contact support on Discord or submit a valid payment proof.
            </p>
          </div>
        ) : null}

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: '24px' }}>
          <div className="stat-card">
            <p className="stat-label">Username</p>
            <div id="dashUsername" className="stat-value text-xl">
              {String(session.username || 'User').toUpperCase()}
            </div>
          </div>

          <div className="stat-card">
            <p className="stat-label">Active Plan</p>
            <div id="dashPlan" className="stat-value text-xl text-secondary">
              {livePlan.toUpperCase()}
            </div>
          </div>

          <div className="stat-card">
            <p className="stat-label">
              <span id="expiryIcon">{isExpired ? '🔴' : '🟢'}</span> Expiry
            </p>
            <div
              id="dashExpiry"
              className={`stat-value text-md ${isExpired ? 'text-danger' : 'text-success'}`}
              style={{ fontSize: '1.05rem', marginTop: '6px' }}
            >
              {liveExpiry ? formatDateTime(liveExpiry) : 'No active expiry'}
            </div>
          </div>

          <div className="stat-card" id="status-card">
            <p className="stat-label">
              <span id="statusIcon">{isApproved ? '✅' : isRejected ? '❌' : '⏳'}</span> Order Status
            </p>
            <div
              id="dashOrderStatus"
              className={`stat-value text-xl ${
                isApproved ? 'text-success' : isRejected ? 'text-danger' : 'text-warning'
              }`}
            >
              {liveStatus.toUpperCase()}
            </div>
          </div>
        </div>

        {/* License Key Card */}
        <div className="card mb-24" id="key-card" style={{ background: 'var(--surface-strong)', padding: '20px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="micro-label">LICENSE KEY</span>
            <span className={`badge ${isApproved ? (keyUsed ? 'warning' : 'good') : 'warning'}`}>
              {isApproved ? (keyUsed ? 'Used' : 'Active') : 'Pending'}
            </span>
          </div>

          <div
            id="dashOrderKey"
            className="key-display-box"
            style={{
              padding: '12px 16px',
              fontFamily: 'monospace',
              fontSize: '1.15rem',
              letterSpacing: '0.05em',
              wordBreak: 'break-all',
              color: orderKey ? 'var(--text)' : 'var(--muted)',
            }}
          >
            {orderKey || 'Key will be issued upon admin approval'}
          </div>

          {orderKey ? (
            <div className="mt-12">
              <button
                id="copyDashKeyBtn"
                className="btn btn-secondary btn-sm"
                onClick={handleCopyKey}
                type="button"
              >
                {copiedKey ? 'Key Copied!' : 'Copy License Key'}
              </button>
            </div>
          ) : null}
        </div>

        {/* Download Section */}
        {isApproved ? (
          <div className="card" style={{ background: 'var(--surface-strong)', padding: '20px', borderRadius: '10px' }}>
            <span className="micro-label">SOFTWARE DOWNLOAD</span>
            <h3 className="mt-4 mb-8">Verified Panel Package</h3>
            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', marginBottom: '16px' }}>
              Your account is approved. Fetch your secure binary build for {livePlan.toUpperCase()} directly.
            </p>

            {downloadError ? (
              <div className="alert-box alert-danger mb-12">
                <p className="mb-0 text-danger">{downloadError}</p>
              </div>
            ) : null}

            <button
              id="downloadPanelBtn"
              className="btn btn-primary btn-large btn-download"
              disabled={downloadLoading}
              onClick={handleDownload}
              type="button"
            >
              <span aria-hidden="true">📥 </span>
              {downloadLoading ? 'Retrieving Secure Package...' : `Download ${livePlan.toUpperCase()} Panel`}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
