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
      <div className="center-wrap">
        <section className="panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
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

      const link = document.createElement('a')
      link.href = payload.url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      link.remove()
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
    <div className="center-wrap">
      <section className="panel">
        <div className="dashboard-header-flex">
          <div>
            <span className="hero-eyebrow">Client Portal</span>
            <h1 className="auth-title mt-6">Welcome, {String(session.username || 'User').toUpperCase()}</h1>
          </div>
          <div className="flex gap-10">
            {!isFreePlan ? (
              <NavLink to="/pages/change" className="button button-secondary button-sm">
                Change Password
              </NavLink>
            ) : null}
            <NavLink to="/pages/products" className="button button-ghost button-sm">
              Upgrade / Renew
            </NavLink>
          </div>
        </div>

        {/* Status Alerts */}
        {isPending ? (
          <div className="form-error mb-24 alert-warning-box">
            <div>
              <strong>⚠️ Order Pending Review</strong>
              <p className="mt-4 text-sm text-main">
                Your order is currently awaiting admin verification. Access keys and downloads will be enabled once approved.
              </p>
            </div>
          </div>
        ) : null}

        {isExpired ? (
          <div className="form-error mb-24 flex items-center justify-between flex-wrap gap-12">
            <div>
              <strong>⛔ Subscription Expired</strong>
              <p className="mt-4 text-sm text-main">
                Your access has expired. Please renew your plan from the products catalog to restore access.
              </p>
            </div>
            <NavLink to="/pages/products" className="button button-primary button-sm">
              Renew Access
            </NavLink>
          </div>
        ) : null}

        {isRejected ? (
          <div className="form-error mb-24">
            <strong>❌ Order Not Approved</strong>
            <p className="mt-4 text-sm text-main">
              Your order could not be verified. Please contact support on Discord or submit a valid payment proof.
            </p>
          </div>
        ) : null}

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <p className="stat-label">Username</p>
            <div id="dashUsername" className="stat-value">
              {String(session.username || 'User').toUpperCase()}
            </div>
          </div>

          <div className="stat-card">
            <p className="stat-label">Active Plan</p>
            <div id="dashPlan" className="stat-value text-primary">
              {livePlan.toUpperCase()}
            </div>
          </div>

          <div className="stat-card">
            <p className="stat-label">
              <span id="expiryIcon">{isExpired ? '🔴' : '🟢'}</span> Expiry
            </p>
            <div
              id="dashExpiry"
              className={`stat-value text-base ${isExpired ? 'text-danger' : 'text-success'}`}
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
              className={`stat-value ${isApproved ? 'text-success' : isRejected ? 'text-danger' : 'text-warning'}`}
            >
              {liveStatus.toUpperCase()}
            </div>
          </div>
        </div>

        {/* License Key Card */}
        <div className="card mb-24" id="key-card">
          <div className="flex items-center justify-between mb-10">
            <span className="micro-label">LICENSE KEY</span>
            <span className={`badge ${isApproved ? (keyUsed ? 'warning' : 'good') : 'warning'}`}>
              {isApproved ? (keyUsed ? 'Used' : 'Active') : 'Pending'}
            </span>
          </div>

          <div
            id="dashOrderKey"
            className={`license-key-box ${orderKey ? '' : 'is-empty'}`}
          >
            {orderKey || 'Key will be issued upon admin approval'}
          </div>

          {orderKey ? (
            <div className="mt-14">
              <button
                id="copyDashKeyBtn"
                className="button button-secondary button-sm"
                onClick={handleCopyKey}
                type="button"
              >
                {copiedKey ? 'Copied!' : 'Copy License Key'}
              </button>
            </div>
          ) : null}
        </div>

        {/* Download Section */}
        {isApproved ? (
          <div className="card">
            <span className="micro-label">SOFTWARE DOWNLOAD</span>
            <h3 className="my-8 text-lg font-bold">Verified Panel Package</h3>
            <p className="text-muted text-sm mb-18">
              Your account is approved. Fetch your secure binary build for {livePlan.toUpperCase()} directly.
            </p>

            {downloadError ? (
              <div className="form-error mb-14">
                {downloadError}
              </div>
            ) : null}

            <button
              id="downloadPanelBtn"
              className={`button button-primary button-lg btn-download ${downloadLoading ? 'is-loading' : ''}`}
              disabled={downloadLoading}
              onClick={handleDownload}
              type="button"
            >
              {downloadLoading ? (
                <span className="button-loading-content">
                  <span className="spinner-inline" aria-hidden="true" />
                  <span>Retrieving Package...</span>
                </span>
              ) : (
                <>
                  <span aria-hidden="true">📥 </span>
                  <span>Download {livePlan.toUpperCase()} Panel</span>
                </>
              )}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
