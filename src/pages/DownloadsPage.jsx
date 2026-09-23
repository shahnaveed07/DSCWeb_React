import { PageSection } from '../components/ui/PageSection'
import { StateBlock } from '../components/ui/StateBlock'
import { useRemoteResource } from '../hooks/useRemoteResource'
import { getFreePanelStatus } from '../services/dscApi'

export function DownloadsPage({ systemStatus }) {
  const { data, error, loading } = useRemoteResource(getFreePanelStatus, [])
  const freeLink =
    data?.freeLink || data?.FreeLink || systemStatus?.freeLink || systemStatus?.FreeLink
  const usedSlots = Number(data?.usedSlots || data?.UsedSlots || 0)
  const maxSlots = Number(data?.maxSlots || data?.MaxSlots || 0)

  return (
    <div className="page-stack">
      <section className="hero-block hero-grid">
        <div>
          <span className="hero-eyebrow">Download Center</span>
          <h1>Secure software and utility downloads.</h1>
          <p className="hero-copy">
            The new download center keeps the free-panel archive, system-status
            metadata, and verified release messaging, while removing dead-end
            placeholder presentation from the starter implementation.
          </p>
        </div>

        <aside className="status-card">
          <span className="micro-label">Release Status</span>
          <strong>
            {systemStatus?.latestVersion || systemStatus?.LatestVersion
              ? `Version ${systemStatus?.latestVersion || systemStatus?.LatestVersion}`
              : 'Current release'}
          </strong>
          <p>
            {systemStatus?.showHomeDownloadBtn || systemStatus?.ShowHomeDownloadBtn
              ? 'Direct archive access is enabled by the live backend.'
              : 'Direct archive access is currently hidden by the live backend.'}
          </p>
        </aside>
      </section>

      <PageSection
        eyebrow="Direct Releases"
        title="Available downloads"
        description="This page preserves the live free-panel archive and makes unavailable downloads explicit instead of pretending they are active."
      >
        <div className="card-grid columns-2">
          <article className="feature-card">
            <span className="card-label">Free Tier</span>
            <h3>Free Panel Portal</h3>
            <p>
              {loading
                ? 'Checking slot availability...'
                : `Current usage: ${usedSlots}${maxSlots ? ` / ${maxSlots}` : ''} slots.`}
            </p>
            {freeLink ? (
              <a className="button button-primary" href={freeLink} target="_blank" rel="noreferrer">
                Open Build Archive
              </a>
            ) : (
              <span className="button button-disabled">Archive unavailable</span>
            )}
          </article>

          <article className="feature-card">
            <span className="card-label">Utility</span>
            <h3>Calculator</h3>
            <p>
              The legacy page advertises this utility but does not expose a live
              binary URL. Phase 1 makes that state explicit.
            </p>
            <a className="button button-secondary" href="/pages/contact">
              Request Release Access
            </a>
          </article>
        </div>

        {error ? (
          <StateBlock
            title="Live download metadata could not be loaded"
            message="The page remains usable, but free-panel slot data is temporarily unavailable."
            tone="warning"
          />
        ) : null}
      </PageSection>
    </div>
  )
}
