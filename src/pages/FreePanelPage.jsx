import { useState } from 'react'
import { StateBlock } from '../components/ui/StateBlock'
import { useRemoteResource } from '../hooks/useRemoteResource'
import { extractApiMessage, getFreePanelStatus } from '../services/dscApi'

export function FreePanelPage() {
  const [copiedField, setCopiedField] = useState('')
  const { data, error, loading } = useRemoteResource(getFreePanelStatus, [])

  const usedSlots = Number(data?.usedSlots || data?.UsedSlots || 0)
  const maxSlots = Number(data?.maxSlots || data?.MaxSlots || 10)
  const freeUser =
    data?.freeUser || data?.FreeUser || data?.freeUsername || data?.FreeUsername
  const freePass =
    data?.freePass || data?.FreePass || data?.freePassword || data?.FreePassword
  const freeLink = data?.freeLink || data?.FreeLink
  const slotUsage = maxSlots > 0 ? Math.min((usedSlots / maxSlots) * 100, 100) : 0

  async function copyValue(label, value) {
    await navigator.clipboard.writeText(value)
    setCopiedField(label)
    window.setTimeout(() => setCopiedField(''), 1400)
  }

  return (
    <section className="auth-shell">
      <div className="auth-card wide-card">
        <span className="hero-eyebrow">Free Panel Access</span>
        <h1>Live availability from the existing public API.</h1>
        <p className="hero-copy">
          This screen preserves the current `/api/public/free-panel` flow and
          makes slot usage, credentials, and archive access explicit.
        </p>

        {loading ? (
          <StateBlock
            title="Loading free-panel status"
            message="Checking live slot availability and archive access."
          />
        ) : null}

        {error ? (
          <StateBlock
            title="Free-panel status could not be loaded"
            message={extractApiMessage(error.payload, 'Please try again in a moment.')}
            tone="warning"
          />
        ) : null}

        {!loading && !error ? (
          <div className="stack-block">
            {freeUser && freePass ? (
              <div className="panel-card">
                <div className="copy-row">
                  <div>
                    <span className="micro-label">Available Username</span>
                    <strong>{freeUser}</strong>
                  </div>
                  <button
                    className="button button-secondary"
                    onClick={() => copyValue('user', freeUser)}
                    type="button"
                  >
                    {copiedField === 'user' ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="copy-row">
                  <div>
                    <span className="micro-label">Available Password</span>
                    <strong>{freePass}</strong>
                  </div>
                  <button
                    className="button button-secondary"
                    onClick={() => copyValue('pass', freePass)}
                    type="button"
                  >
                    {copiedField === 'pass' ? 'Copied' : 'Copy'}
                  </button>
                </div>

                <div className="progress-panel">
                  <div className="progress-head">
                    <span>Slot usage</span>
                    <strong>
                      {usedSlots} / {maxSlots}
                    </strong>
                  </div>
                  <div className="progress-track">
                    <span className="progress-fill" style={{ width: `${slotUsage}%` }} />
                  </div>
                </div>

                {freeLink ? (
                  <a className="button button-primary" href={freeLink} target="_blank" rel="noreferrer">
                    Download Panel
                  </a>
                ) : null}
              </div>
            ) : (
              <StateBlock
                title="Free panel is currently offline"
                message="No active free credentials are exposed by the live backend right now."
                tone="warning"
              />
            )}
          </div>
        ) : null}
      </div>
    </section>
  )
}
