import { NavLink } from 'react-router-dom'
import { useRemoteResource } from '../hooks/useRemoteResource'
import { usePageMeta } from '../hooks/usePageMeta'
import { getFreePanelStatus } from '../services/dscApi'

export function DownloadsPage({ systemStatus }) {
  usePageMeta({
    title: 'Download Center & Official Software Releases',
    description:
      'Download verified software binaries, community evaluation panel packages, and Android tools from Dark Skull Corporation with complete system requirements and setup guidance.',
    canonical: 'https://dscweb.me/pages/downloads',
  })

  const { data, loading } = useRemoteResource(getFreePanelStatus, [])
  const freeLink =
    data?.freeLink || data?.FreeLink || systemStatus?.freeLink || systemStatus?.FreeLink
  const usedSlots = Number(data?.usedSlots || data?.UsedSlots || 0)
  const maxSlots = Number(data?.maxSlots || data?.MaxSlots || 20)
  const slotsAvailable = maxSlots - usedSlots > 0

  return (
    <div className="center-wrap">
      {/* Header */}
      <section className="page-header-center">
        <span className="hero-eyebrow">Dark Skull Corporation</span>
        <h1>Official Software &amp; Utility Downloads</h1>
        <p>
          Download verified builds, public releases, and community packages.
          All binaries are checked for integrity, compiled for low memory usage, and supported on Windows and Android.
        </p>
      </section>

      {/* Downloads Grid */}
      <div className="downloads-grid" style={{ marginTop: '32px' }}>
        {/* Free Panel Package */}
        <article className="download-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="download-card-meta">
              <span className="badge warning">COMMUNITY EVALUATION</span>
              <span className="text-muted text-sm">
                {loading ? 'Checking slots...' : `${usedSlots} / ${maxSlots} Slots Used`}
              </span>
            </div>

            <h2 className="download-card-title">Free Panel Build</h2>
            <p className="download-card-desc">
              Public test release of our desktop utility panel. Evaluate server connectivity, examine real-time slot telemetry, and test core interface responsiveness.
            </p>

            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--muted)',
                background: 'var(--surface-hover)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                lineHeight: '1.4',
              }}
            >
              <strong>Status:</strong> {slotsAvailable ? 'Slots currently open for evaluation.' : 'Public pool is currently at capacity.'}
            </div>
          </div>

          <div className="download-card-actions">
            {freeLink ? (
              <>
                <a
                  className="button button-primary w-100"
                  href={freeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">📥 </span>Download Free Panel Package
                </a>
                <NavLink to="/pages/freepanel" className="button button-secondary w-100">
                  View Shared Credentials
                </NavLink>
              </>
            ) : (
              <NavLink to="/pages/freepanel" className="button button-primary w-100">
                Check Availability &amp; Credentials
              </NavLink>
            )}
          </div>
        </article>

        {/* Calculator Desktop & Web */}
        <article className="download-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="download-card-meta">
              <span className="badge good">PRODUCTIVITY TOOL</span>
              <span className="text-success text-sm">Live Web &amp; Desktop</span>
            </div>

            <h2 className="download-card-title">Calculator Tool</h2>
            <p className="download-card-desc">
              Distraction-free mathematics utility with continuous calculation history, one-click clipboard copy, and instantaneous evaluation.
            </p>

            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--muted)',
                background: 'var(--surface-hover)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                lineHeight: '1.4',
              }}
            >
              <strong>Availability:</strong> Run instantly in your browser on our Apps page, or request the portable Windows executable via Discord.
            </div>
          </div>

          <div className="download-card-actions">
            <NavLink to="/pages/apps" className="button button-primary w-100">
              Launch Web Calculator
            </NavLink>
          </div>
        </article>

        {/* QR Scanner Mobile */}
        <article className="download-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="download-card-meta">
              <span className="badge warning">ANDROID RELEASE</span>
              <span className="text-muted text-sm">Google Play Verified</span>
            </div>

            <h2 className="download-card-title">QR Scanner | Generator</h2>
            <p className="download-card-desc">
              Instant autofocus barcode detection and offline custom QR code creator for Android devices. Supports Wi-Fi networks, URLs, and contact vCards.
            </p>

            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--muted)',
                background: 'var(--surface-hover)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                lineHeight: '1.4',
              }}
            >
              <strong>Requirements:</strong> Android 7.0 (Nougat) or newer. Zero external telemetry.
            </div>
          </div>

          <div className="download-card-actions">
            <a
              className="button button-secondary w-100"
              href="https://play.google.com/store/apps/details?id=com.dsc.qrscanner"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get on Google Play ↗
            </a>
          </div>
        </article>

        {/* Mind Matrix */}
        <article className="download-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="download-card-meta">
              <span className="badge warning">MOBILE GAME</span>
              <span className="text-muted text-sm">Google Play Verified</span>
            </div>

            <h2 className="download-card-title">Mind Matrix</h2>
            <p className="download-card-desc">
              Progressive cognitive training puzzle game with pattern recognition drills, memory sequences, and reflex challenges.
            </p>

            <div
              style={{
                fontSize: '0.8rem',
                color: 'var(--muted)',
                background: 'var(--surface-hover)',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px',
                lineHeight: '1.4',
              }}
            >
              <strong>Requirements:</strong> Android 6.0+ compatible. Fully playable offline.
            </div>
          </div>

          <div className="download-card-actions">
            <a
              className="button button-secondary w-100"
              href="https://play.google.com/store/apps/details?id=com.dsc.mindmatrix"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get on Google Play ↗
            </a>
          </div>
        </article>
      </div>

      {/* Authenticated Client Downloads Information */}
      <section className="seo-section" style={{ marginTop: '48px' }}>
        <div className="seo-container">
          <span className="badge good mb-8">Client Portal</span>
          <h2 style={{ marginTop: '10px' }}>Private &amp; Dedicated Software Downloads</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '16px' }}>
            Looking for your licensed software panel (Streamer, Special, Sniper, Aim Assist)?
          </p>
          <div className="card" style={{ padding: '20px', background: 'var(--surface-hover)', border: '1px solid var(--surface-border)' }}>
            <p style={{ margin: '0 0 12px', fontSize: '0.92rem', lineHeight: '1.5' }}>
              Paid software panel builds are individually compiled and tied to your unique hardware token. Once your order payment is verified by our team, your personalized download link and authorization key are automatically made available inside your private <strong>Client Dashboard</strong>.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <NavLink to="/pages/ulogin" className="button button-primary button-sm">
                Sign In to Client Portal
              </NavLink>
              <NavLink to="/pages/products" className="button button-secondary button-sm">
                View Software Products
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* System Requirements & Verification Instructions */}
      <section className="seo-section" style={{ marginTop: '32px', marginBottom: '40px' }}>
        <div className="seo-container">
          <span className="badge warning mb-8">Technical Requirements</span>
          <h2 style={{ marginTop: '10px' }}>System Compatibility &amp; Installation Guide</h2>

          <div className="card-grid columns-2" style={{ gap: '20px', marginTop: '20px' }}>
            <article className="info-card">
              <span className="card-badge">WINDOWS REQUIREMENTS</span>
              <h3 style={{ marginTop: '8px' }}>Hardware &amp; Runtimes</h3>
              <ul className="feature-list" style={{ marginTop: '10px' }}>
                <li>Operating System: Windows 10 or Windows 11 (64-bit architecture)</li>
                <li>Runtime: Microsoft .NET Framework 4.8 or later installed</li>
                <li>Dependencies: Visual C++ 2015–2022 Redistributable (x64)</li>
                <li>Permissions: Run as Administrator for hardware token reading</li>
              </ul>
            </article>

            <article className="info-card">
              <span className="card-badge">SMARTSCREEN NOTICE</span>
              <h3 style={{ marginTop: '8px' }}>Indie Binary Verification</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.5', marginTop: '10px' }}>
                Because Dark Skull Corporation distributes custom compiled binaries directly to users rather than through enterprise certificate stores, Windows Defender SmartScreen may display an &ldquo;Unrecognized app&rdquo; prompt.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: '1.5', margin: '8px 0 0' }}>
                Click <strong>More info</strong> and select <strong>Run anyway</strong>. You can verify SHA-256 hashes on our Discord server before executing.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
