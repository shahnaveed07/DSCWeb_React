import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { extractApiMessage, submitCheckout } from '../services/dscApi'
import { formatMoney, toBase64DataUrl } from '../utils/format'

const PANEL_PRICES = {
  free: 0,
  sniper: 1,
  aimbot: 1,
  aimassist: 1,
  streamer: 2,
  special: 3,
  premium: 5,
  customised: 10,
}

const DAY_MULTIPLIERS = {
  3: 1,
  7: 2,
  15: 3,
  30: 4,
  60: 6,
  365: 8,
}

const INR_RATE = 90

export function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const panel = String(searchParams.get('panel') || '').trim().toLowerCase()
  const [days, setDays] = useState(30)
  const [proof, setProof] = useState(null)
  const [preview, setPreview] = useState('')
  const [form, setForm] = useState({
    username: '',
    password: '',
    discordId: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const basePrice = PANEL_PRICES[panel]
  const multiplier = DAY_MULTIPLIERS[days] || 1
  const totalUsd = (basePrice || 0) * multiplier
  const totalInr = totalUsd * INR_RATE
  const requiresProof = panel !== 'free'
  const upiUrl = useMemo(() => {
    return `upi://pay?pa=naveedmushtaq@ptyes&pn=${encodeURIComponent('Dark Skull Corp')}&am=${totalInr}&cu=INR&tn=DSC-${panel}`
  }, [panel, totalInr])

  if (!panel || basePrice === undefined) {
    return (
      <section className="auth-shell">
        <div className="auth-card">
          <h1>Invalid panel selection</h1>
          <p className="hero-copy">
            The checkout route requires a valid `panel` query. Use the product
            catalog to start a purchase flow.
          </p>
          <a className="button button-primary" href="/pages/products">
            Back to products
          </a>
        </div>
      </section>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      let proofPayload = ''

      if (requiresProof) {
        if (!proof) throw new Error('Screenshot proof is required.')
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(String(proof.type).toLowerCase())) {
          throw new Error('Please upload a valid image file.')
        }
        if (proof.size > 5 * 1024 * 1024) {
          throw new Error('Image is too large. Max allowed is 5MB.')
        }
        proofPayload = await toBase64DataUrl(proof)
      }

      await submitCheckout({
        Username: form.username.trim().toLowerCase(),
        PasswordHash: form.password,
        DiscordId: form.discordId.trim() || 'None',
        Plan: panel,
        Days: Number(days),
        Amount: `USD ${totalUsd} (${totalInr} INR)`,
        TxnId: 'SS_PROOF_ONLY',
        PaymentProofBase64: proofPayload,
      })

      navigate('/pages/ulogin')
    } catch (submitError) {
      setError(extractApiMessage(submitError.payload, submitError.message || 'Order submission failed.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card wide-card">
        <span className="hero-eyebrow">Checkout</span>
        <h1>Complete your purchase.</h1>
        <p className="hero-copy">
          The form preserves the current approval-based order submission contract,
          including the payment-proof image upload path.
        </p>

        <div className="checkout-grid">
          <aside className="panel-card">
            <span className="micro-label">Selected Panel</span>
            <strong>{panel.toUpperCase()} PANEL</strong>

            <label className="field">
              <span>Duration</span>
              <select onChange={(event) => setDays(Number(event.target.value))} value={days}>
                <option value={3}>3 Days - Starter</option>
                <option value={7}>7 Days - Weekly</option>
                <option value={15}>15 Days - Standard</option>
                <option value={30}>30 Days - Monthly</option>
                <option value={60}>60 Days - Bi-Monthly</option>
                <option value={365}>365 Days - Yearly</option>
              </select>
            </label>

            <div className="price-block">
              <span className="micro-label">Total Amount</span>
              <strong>
                {formatMoney(totalUsd)} / {totalInr} INR
              </strong>
            </div>

            {requiresProof ? (
              <div className="qr-card">
                <img
                  alt="UPI QR code"
                  className="qr-image"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`}
                />
                <a className="button button-secondary" href={upiUrl}>
                  Pay with UPI App
                </a>
              </div>
            ) : null}
          </aside>

          <form className="form-stack" onSubmit={handleSubmit}>
            <label className="field">
              <span>Username</span>
              <input
                onChange={(event) =>
                  setForm((current) => ({ ...current, username: event.target.value }))
                }
                placeholder="Must match game username"
                required
                type="text"
                value={form.username}
              />
            </label>

            <label className="field">
              <span>Password</span>
              <input
                minLength={3}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="Create a secure password"
                required
                type="password"
                value={form.password}
              />
            </label>

            <label className="field">
              <span>Discord ID</span>
              <input
                onChange={(event) =>
                  setForm((current) => ({ ...current, discordId: event.target.value }))
                }
                placeholder="Optional"
                type="text"
                value={form.discordId}
              />
            </label>

            {requiresProof ? (
              <label className="field">
                <span>Payment Proof</span>
                <input
                  accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                  onChange={(event) => {
                    const file = event.target.files?.[0] || null
                    setProof(file)
                    setPreview(file ? URL.createObjectURL(file) : '')
                  }}
                  type="file"
                />
                {preview ? (
                  <img alt="Payment proof preview" className="preview-image" src={preview} />
                ) : null}
              </label>
            ) : null}

            {error ? <p className="form-error">{error}</p> : null}

            <button className="button button-primary" disabled={loading} type="submit">
              {loading ? 'Submitting order...' : 'Submit Order for Approval'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
