import { useState } from 'react'
import { useRemoteResource } from '../hooks/useRemoteResource'
import { getFreePanelStatus } from '../services/dscApi'

export function FreePanelPage() {
  const [copiedUser, setCopiedUser] = useState(false)
  const [copiedPass, setCopiedPass] = useState(false)
  const { data, error, loading } = useRemoteResource(getFreePanelStatus, [])

  const usedSlots = Number(data?.usedSlots || data?.UsedSlots || 0)
  const maxSlots = Number(data?.maxSlots || data?.MaxSlots || 20)
  const freeUser =
    data?.freeUser || data?.FreeUser || data?.freeUsername || data?.FreeUsername
  const freePass =
    data?.freePass || data?.FreePass || data?.freePassword || data?.FreePassword
  const freeLink = data?.freeLink || data?.FreeLink

  const remaining = maxSlots - usedSlots
  const percentage = maxSlots > 0 ? Math.min((usedSlots / maxSlots) * 100, 100) : 0
  const isFull = remaining <= 0
  const hasCredentials = Boolean(freeUser && freePass)
  const isOffline = !loading && !error && !hasCredentials

  let progressColor = 'var(--success)'
  if (percentage > 85) {
    progressColor = 'var(--danger)'
  } else if (percentage > 60) {
    progressColor = 'var(--warning)'
  }

  async function handleCopyUser() {
    if (!freeUser) return
    await navigator.clipboard.writeText(freeUser)
    setCopiedUser(true)
    setTimeout(() => setCopiedUser(false), 1500)
  }

  async function handleCopyPass() {
    if (!freePass) return
    await navigator.clipboard.writeText(freePass)
    setCopiedPass(true)
    setTimeout(() => setCopiedPass(false), 1500)
  }

  return (
    <main className="center-wrap">
      <section className="panel auth-card free-panel-card" style={{ maxWidth: '540px', margin: '0 auto' }}>
        <div className="logo-mark free-panel-icon-60 mb-15">
          <img
            src="/images/dsclogo.png"
            alt="Dark Skull Corporation"
            className="header-logo-img"
          />
        </div>
        <h1 className="auth-title">Free Panel Access</h1>
        <p className="auth-subtitle">Public test credentials and direct download access.</p>

        {loading ? (
          <div id="freePanelLoader" style={{ padding: '30px 0' }}>
            <div className="skeleton-line" style={{ height: '40px', marginBottom: '12px', borderRadius: '8px' }} />
            <div className="skeleton-line" style={{ height: '40px', marginBottom: '12px', borderRadius: '8px' }} />
            <div className="skeleton-line" style={{ height: '14px', width: '60%', margin: '0 auto', borderRadius: '4px' }} />
          </div>
        ) : null}

        {!loading && (
          <div id="freePanelContent">
            {hasCredentials ? (
              <div id="freeAvailableBox">
                <div className="card" style={{ padding: '18px', marginBottom: '20px', background: 'var(--surface-hover)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div>
                      <span className="micro-label">USERNAME</span>
                      <h3 id="displayFreeUser" style={{ margin: '4px 0 0', fontFamily: 'monospace', fontSize: '1.15rem' }}>
                        {freeUser}
                      </h3>
                    </div>
                    <button
                      id="copyUserBtn"
                      className="button button-secondary button-sm"
                      onClick={handleCopyUser}
                      type="button"
                    >
                      {copiedUser ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--surface-border)' }}>
                    <div>
                      <span className="micro-label">PASSWORD</span>
                      <h3 id="displayFreePass" style={{ margin: '4px 0 0', fontFamily: 'monospace', fontSize: '1.15rem' }}>
                        {freePass}
                      </h3>
                    </div>
                    <button
                      id="copyPassBtn"
                      className="button button-secondary button-sm"
                      onClick={handleCopyPass}
                      type="button"
                    >
                      {copiedPass ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="progress-container">
                  <div className="progress-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.86rem', color: 'var(--muted)' }}>
                    <span>Slots Availability</span>
                    <span id="displayRemainingText" style={{ fontWeight: 600, color: 'var(--text)' }}>
                      {usedSlots} / {maxSlots} Slots Used
                    </span>
                  </div>
                  <div className="progress-track" style={{ height: '8px', background: 'var(--surface-border)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div
                      id="slotProgressBar"
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: progressColor,
                        height: '100%',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease, background-color 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <a
                    id="freePanelDownloadBtn"
                    className="button button-primary button-lg w-100"
                    href={freeLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span aria-hidden="true">📥 </span>Download Free Panel
                  </a>
                </div>
              </div>
            ) : null}

            {isFull ? (
              <div id="freeFullMsg" className="form-error" style={{ background: 'var(--warning-soft)', borderColor: 'var(--warning-border)', color: 'var(--warning)', marginTop: '16px' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Slots Full</strong>
                <span style={{ color: 'var(--text)', fontSize: '0.92rem' }}>No Slot is Available. Existing users can still download.</span>
              </div>
            ) : null}

            {isOffline || error ? (
              <div id="freeFullMsg" className="form-error" style={{ marginTop: '16px' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>Free Panel Not Available</strong>
                <span style={{ fontSize: '0.92rem' }}>The free panel is currently offline. Please check back later.</span>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  )
}
