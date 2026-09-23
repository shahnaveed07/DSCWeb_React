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
      <section className="panel auth-card free-panel-card">
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
          <div id="freePanelLoader" className="skeleton-anim" style={{ padding: '30px 0' }}>
            <div className="skeleton-line" style={{ height: '40px', marginBottom: '12px', borderRadius: '8px' }} />
            <div className="skeleton-line" style={{ height: '40px', marginBottom: '12px', borderRadius: '8px' }} />
            <div className="skeleton-line" style={{ height: '14px', width: '60%', margin: '0 auto', borderRadius: '4px' }} />
          </div>
        ) : null}

        {!loading && (
          <div id="freePanelContent">
            {hasCredentials ? (
              <div id="freeAvailableBox">
                <div className="credentials-box">
                  <div className="credential-row mb-10">
                    <div>
                      <span className="micro-label">USERNAME</span>
                      <h3 id="displayFreeUser" className="free-panel-select-all free-panel-text-left">
                        {freeUser}
                      </h3>
                    </div>
                    <button
                      id="copyUserBtn"
                      className="btn btn-secondary btn-sm"
                      onClick={handleCopyUser}
                      type="button"
                    >
                      {copiedUser ? 'Copied!' : 'Copy'}
                    </button>
                  </div>

                  <div className="credential-row">
                    <div>
                      <span className="micro-label">PASSWORD</span>
                      <h3 id="displayFreePass" className="free-panel-select-all free-panel-text-left">
                        {freePass}
                      </h3>
                    </div>
                    <button
                      id="copyPassBtn"
                      className="btn btn-secondary btn-sm"
                      onClick={handleCopyPass}
                      type="button"
                    >
                      {copiedPass ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="progress-container">
                  <div className="progress-header">
                    <span>Slots Availability</span>
                    <span id="displayRemainingText">
                      {usedSlots} / {maxSlots} Slots Used
                    </span>
                  </div>
                  <div className="progress-track">
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

                <div className="mt-20">
                  <a
                    id="freePanelDownloadBtn"
                    className="btn btn-primary btn-large btn-download w-100"
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
              <div id="freeFullMsg" className="alert-box alert-warning mt-15">
                <h3 className="mb-5 text-warning">Slots Full</h3>
                <p className="mb-0">No Slot is Available . Existing users can still download.</p>
              </div>
            ) : null}

            {isOffline || error ? (
              <div id="freeFullMsg" className="alert-box alert-danger mt-15">
                <h3 className="mb-5 text-danger">Free Panel Not Available</h3>
                <p className="mb-0">The free panel is currently offline. Please check back later.</p>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  )
}
