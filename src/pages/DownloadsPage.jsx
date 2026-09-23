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
    <div className="center-wrap">
      <section className="page-header-center">
        <span className="hero-eyebrow">Download Center</span>
        <h1>Official Software & Utility Downloads</h1>
        <p>
          Download verified binaries, public releases, and free packages provided by Dark Skull Corporation.
          All builds are scanned for security and maintained for compatibility.
        </p>
      </section>

      {/* Downloads Grid */}
      <div className="downloads-grid">
        {/* Free Panel Package */}
        <article className="download-card">
          <div>
            <div className="download-card-meta">
              <span className="badge warning">FREE UTILITY</span>
              <span className="text-muted text-sm">
                {loading ? 'Checking slots...' : `${usedSlots} / ${maxSlots} Slots Used`}
              </span>
            </div>

            <h2 className="download-card-title">Free Panel Build</h2>
            <p className="download-card-desc">
              The public version of our panel software. Test core functionality, view live credentials, and access the verified package archive.
            </p>
          </div>

          <div className="download-card-actions">
            {freeLink ? (
              <>
                <a
                  className="button button-primary w-100"
                  href={freeLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span aria-hidden="true">📥 </span>Download Free Panel
                </a>
                <NavLink to="/pages/freepanel" className="button button-secondary w-100">
                  View Credentials
                </NavLink>
              </>
            ) : (
              <NavLink to="/pages/freepanel" className="button button-primary w-100">
                Check Availability & Credentials
              </NavLink>
            )}
          </div>
        </article>

        {/* Calculator Desktop */}
        <article className="download-card">
          <div>
            <div className="download-card-meta">
              <span className="badge good">DESKTOP APP</span>
              <span className="text-success text-sm">Stable Release</span>
            </div>

            <h2 className="download-card-title">Calculator for Windows</h2>
            <p className="download-card-desc">
              Fast, distraction-free desktop calculator for Windows. Designed for daily calculations with continuous expression parsing and zero overhead.
            </p>
          </div>

          <div className="download-card-actions">
            <NavLink to="/pages/apps" className="button button-secondary w-100">
              App Details
            </NavLink>
          </div>
        </article>

        {/* QR Scanner Mobile */}
        <article className="download-card">
          <div>
            <div className="download-card-meta">
              <span className="badge warning">ANDROID</span>
              <span className="text-muted text-sm">Google Play</span>
            </div>

            <h2 className="download-card-title">QR Scanner | Generator</h2>
            <p className="download-card-desc">
              Fast barcode and QR code detection for Android. Scan physical codes or generate customized QR formats offline.
            </p>
          </div>

          <div className="download-card-actions">
            <a
              className="button button-secondary w-100"
              href="https://play.google.com/store/apps/details?id=com.dsc.qrscanner"
              target="_blank"
              rel="noreferrer"
            >
              Google Play ↗
            </a>
          </div>
        </article>

        {/* Mind Matrix */}
        <article className="download-card">
          <div>
            <div className="download-card-meta">
              <span className="badge warning">MOBILE GAME</span>
              <span className="text-muted text-sm">Google Play</span>
            </div>

            <h2 className="download-card-title">Mind Matrix</h2>
            <p className="download-card-desc">
              Train your reflexes and mental focus with hundreds of progressive puzzle and memory challenges.
            </p>
          </div>

          <div className="download-card-actions">
            <a
              className="button button-secondary w-100"
              href="https://play.google.com/store/apps/details?id=com.dsc.mindmatrix"
              target="_blank"
              rel="noreferrer"
            >
              Google Play ↗
            </a>
          </div>
        </article>
      </div>
    </div>
  )
}
