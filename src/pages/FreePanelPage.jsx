import { useState } from 'react'
import { useRemoteResource } from '../hooks/useRemoteResource'
import { usePageMeta } from '../hooks/usePageMeta'
import { getFreePanelStatus } from '../services/dscApi'

function normalizeCredential(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function FreePanelUnavailableState() {
  return (
    <div id="freeOfflineMsg" className="form-error" style={{ marginTop: '16px' }} role="status">
      <strong style={{ display: 'block', marginBottom: '4px' }}>Free Panel Not Available</strong>
      <span style={{ fontSize: '0.92rem' }}>
        The free panel is currently offline. Please check back later.
      </span>
    </div>
  )
}

function FreePanelAvailableSection({
  freeUser,
  freePass,
  freeLink,
  usedSlots,
  maxSlots,
  percentage,
  progressColor,
  isFull,
  copiedUser,
  copiedPass,
  onCopyUser,
  onCopyPass,
}) {
  return (
    <div id="freeAvailableBox">
      <div
        className="card"
        style={{
          padding: '18px',
          marginBottom: '20px',
          background: 'var(--surface-hover)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '14px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 0, flex: '1 1 180px' }}>
            <span className="micro-label">USERNAME</span>
            <h3
              id="displayFreeUser"
              style={{
                margin: '4px 0 0',
                fontFamily: 'monospace',
                fontSize: '1.15rem',
                wordBreak: 'break-all',
                overflowWrap: 'anywhere',
              }}
            >
              {freeUser}
            </h3>
          </div>
          <button
            id="copyUserBtn"
            className="button button-secondary button-sm"
            onClick={onCopyUser}
            type="button"
            style={{ flexShrink: 0 }}
          >
            {copiedUser ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            paddingTop: '14px',
            borderTop: '1px solid var(--surface-border)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ minWidth: 0, flex: '1 1 180px' }}>
            <span className="micro-label">PASSWORD</span>
            <h3
              id="displayFreePass"
              style={{
                margin: '4px 0 0',
                fontFamily: 'monospace',
                fontSize: '1.15rem',
                wordBreak: 'break-all',
                overflowWrap: 'anywhere',
              }}
            >
              {freePass}
            </h3>
          </div>
          <button
            id="copyPassBtn"
            className="button button-secondary button-sm"
            onClick={onCopyPass}
            type="button"
            style={{ flexShrink: 0 }}
          >
            {copiedPass ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="progress-container">
        <div
          className="progress-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '8px',
            fontSize: '0.86rem',
            color: 'var(--muted)',
          }}
        >
          <span>Slots Availability</span>
          <span
            id="displayRemainingText"
            style={{
              fontWeight: 600,
              color: 'var(--text)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {usedSlots} / {maxSlots} Slots Used
          </span>
        </div>
        <div
          className="progress-track"
          style={{
            height: '8px',
            background: 'var(--surface-border)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
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

      {isFull ? (
        <div
          id="freeFullMsg"
          className="form-error"
          style={{
            background: 'var(--warning-soft)',
            borderColor: 'var(--warning-border)',
            color: 'var(--warning)',
            marginTop: '16px',
          }}
        >
          <strong style={{ display: 'block', marginBottom: '4px' }}>Slots Full</strong>
          <span style={{ color: 'var(--text)', fontSize: '0.92rem' }}>
            No Slot is Available. Existing users can still download.
          </span>
        </div>
      ) : null}

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
  )
}

export function FreePanelPage() {
  usePageMeta({
    title: 'Free Panel Access & Live Credentials',
    description:
      'Access public evaluation credentials, real-time slot telemetry, and official package archive downloads for the Dark Skull Corporation Free Panel.',
    canonical: 'https://dscweb.me/pages/freepanel',
  })

  const [copiedUser, setCopiedUser] = useState(false)
  const [copiedPass, setCopiedPass] = useState(false)
  const { data, error, loading } = useRemoteResource(getFreePanelStatus, [])

  const isObjectPayload = Boolean(data && typeof data === 'object' && !Array.isArray(data))
  const rawUsed = isObjectPayload ? (data.usedSlots ?? data.UsedSlots ?? 0) : 0
  const rawMax = isObjectPayload ? (data.maxSlots ?? data.MaxSlots ?? 20) : 20
  const usedSlots = Number.isFinite(Number(rawUsed)) ? Math.max(0, Number(rawUsed)) : 0
  const maxSlots = Number.isFinite(Number(rawMax)) && Number(rawMax) > 0 ? Number(rawMax) : 20

  const freeUser = isObjectPayload
    ? normalizeCredential(
        data.freeUser ?? data.FreeUser ?? data.freeUsername ?? data.FreeUsername,
      )
    : ''
  const freePass = isObjectPayload
    ? normalizeCredential(
        data.freePass ?? data.FreePass ?? data.freePassword ?? data.FreePassword,
      )
    : ''
  const freeLink = isObjectPayload
    ? normalizeCredential(data.freeLink ?? data.FreeLink)
    : ''

  const hasValidCredentials = Boolean(!error && isObjectPayload && freeUser && freePass)
  const remaining = maxSlots - usedSlots
  const percentage = maxSlots > 0 ? Math.min(Math.max((usedSlots / maxSlots) * 100, 0), 100) : 0
  const isFull = remaining <= 0

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
          <picture>
            <source srcSet="/images/dsclogo.webp" type="image/webp" />
            <img
              src="/images/dsclogo.png"
              alt="Dark Skull Corporation"
              className="header-logo-img"
              width="60"
              height="60"
            />
          </picture>
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

        {!loading ? (
          <div id="freePanelContent">
            {hasValidCredentials ? (
              <FreePanelAvailableSection
                copiedPass={copiedPass}
                copiedUser={copiedUser}
                freeLink={freeLink}
                freePass={freePass}
                freeUser={freeUser}
                isFull={isFull}
                maxSlots={maxSlots}
                onCopyPass={handleCopyPass}
                onCopyUser={handleCopyUser}
                percentage={percentage}
                progressColor={progressColor}
                usedSlots={usedSlots}
              />
            ) : (
              <FreePanelUnavailableState />
            )}
          </div>
        ) : null}
      </section>
    </main>
  )
}
