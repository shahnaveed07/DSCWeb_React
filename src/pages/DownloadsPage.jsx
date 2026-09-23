import { NavLink } from 'react-router-dom'
import { useRemoteResource } from '../hooks/useRemoteResource'
import { getFreePanelStatus } from '../services/dscApi'

export function DownloadsPage({ systemStatus }) {
  const { data, loading } = useRemoteResource(getFreePanelStatus, [])
  const freeLink =
    data?.freeLink || data?.FreeLink || systemStatus?.freeLink || systemStatus?.FreeLink
  const usedSlots = Number(data?.usedSlots || data?.UsedSlots || 0)
  const maxSlots = Number(data?.maxSlots || data?.MaxSlots || 20)

  return (
    <div className="center-wrap" style={{ maxWidth: '1060px', margin: '0 auto', padding: '24px 20px' }}>
      <section className="mb-32" style={{ textAlign: 'center' }}>
        <span className="hero-eyebrow">Download Center</span>
        <h1 className="mt-10" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 800 }}>
          Official Software & Utility Downloads
        </h1>
        <p style={{ maxWidth: '640px', margin: '12px auto 0', color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Download verified binaries, public releases, and free packages provided by Dark Skull Corporation.
          All builds are scanned for security and maintained for compatibility.
        </p>
      </section>

      {/* Downloads Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Free Panel Package */}
        <article
          className="card"
          style={{
            background: 'var(--surface-strong)',
            border: '1px solid var(--surface-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge warning">FREE UTILITY</span>
              <span style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>
                {loading ? 'Checking slots...' : `${usedSlots} / ${maxSlots} Slots Used`}
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', margin: '6px 0 10px', fontWeight: 700 }}>
              Free Panel Build
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              The public version of our panel software. Test core functionality, view live credentials, and access the verified package archive.
            </p>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {freeLink ? (
              <a
                className="btn btn-primary btn-download w-100"
                href={freeLink}
                target="_blank"
                rel="noreferrer"
              >
                <span aria-hidden="true">📥 </span>Download Free Panel
              </a>
            ) : (
              <NavLink to="/pages/freepanel" className="btn btn-primary w-100">
                Check Availability & Credentials
              </NavLink>
            )}
            <NavLink to="/pages/freepanel" className="btn btn-secondary w-100">
              View Free Credentials
            </NavLink>
          </div>
        </article>

        {/* Calculator Desktop */}
        <article
          className="card"
          style={{
            background: 'var(--surface-strong)',
            border: '1px solid var(--surface-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge good">DESKTOP APP</span>
              <span style={{ fontSize: '0.84rem', color: 'var(--success)' }}>Stable Release</span>
            </div>

            <h2 style={{ fontSize: '1.35rem', margin: '6px 0 10px', fontWeight: 700 }}>
              Calculator for Windows
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Fast, distraction-free desktop calculator for Windows. Designed for daily calculations with continuous expression parsing and zero overhead.
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <NavLink to="/pages/apps" className="btn btn-secondary w-100">
              Application Details & Overview
            </NavLink>
          </div>
        </article>

        {/* QR Scanner Mobile */}
        <article
          className="card"
          style={{
            background: 'var(--surface-strong)',
            border: '1px solid var(--surface-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge warning">ANDROID</span>
              <span style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>Google Play</span>
            </div>

            <h2 style={{ fontSize: '1.35rem', margin: '6px 0 10px', fontWeight: 700 }}>
              QR Scanner | Generator
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Fast barcode and QR code detection for Android. Scan physical codes or generate customized QR formats offline.
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <a
              className="btn btn-secondary w-100"
              href="https://play.google.com/store/apps/details?id=com.dsc.qrscanner"
              target="_blank"
              rel="noreferrer"
            >
              Google Play Store ↗
            </a>
          </div>
        </article>

        {/* Mind Matrix */}
        <article
          className="card"
          style={{
            background: 'var(--surface-strong)',
            border: '1px solid var(--surface-border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="badge warning">MOBILE GAME</span>
              <span style={{ fontSize: '0.84rem', color: 'var(--muted)' }}>Google Play</span>
            </div>

            <h2 style={{ fontSize: '1.35rem', margin: '6px 0 10px', fontWeight: 700 }}>
              Mind Matrix
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.94rem', lineHeight: 1.6 }}>
              Train your reflexes and mental focus with hundreds of progressive puzzle and memory challenges.
            </p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <a
              className="btn btn-secondary w-100"
              href="https://play.google.com/store/apps/details?id=com.dsc.mindmatrix"
              target="_blank"
              rel="noreferrer"
            >
              Google Play Store ↗
            </a>
          </div>
        </article>
      </div>

      {/* Security & Verification Notice */}
      <section className="seo-section mt-30">
        <div className="seo-container">
          <h2>Package Integrity & Security</h2>
          <p>
            Every software distribution package provided by Dark Skull Corporation is compiled directly from our source repository and checked for integrity. For safety, always ensure you are downloading packages directly from official DSCWeb pages or our verified Google Play store links.
          </p>

          <h2>Need Help with an Installation?</h2>
          <p>
            If you encounter any difficulty running or installing any DSC application, please visit our Discord community server or contact our team for assistance.
          </p>
        </div>
      </section>
    </div>
  )
}
