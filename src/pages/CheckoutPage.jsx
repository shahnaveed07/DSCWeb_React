import { useMemo, useState } from 'react'
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { extractApiMessage, submitCheckout } from '../services/dscApi'

const BASE_PRICES = {
  free: 0,
  sniper: 1,
  aimbot: 1,
  aimassist: 1,
  streamer: 2,
  special: 3,
  premium: 5,
  customised: 10,
}

const DURATION_MULTIPLIERS = {
  1: { multiplier: 0.5, label: '1 Day - Trial' },
  3: { multiplier: 1, label: '3 Days - Starter' },
  7: { multiplier: 2, label: '7 Days - Weekly' },
  15: { multiplier: 3, label: '15 Days - Standard' },
  30: { multiplier: 4, label: '30 Days - Monthly' },
  60: { multiplier: 6, label: '60 Days - Bi-Monthly' },
  365: { multiplier: 8, label: '365 Days - Yearly' },
}

const USD_TO_INR = 90
const ALLOWED_PROOF_TYPES = ['image/png', 'image/jpeg', 'image/jpg']

export function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const panel = String(searchParams.get('panel') || '').trim().toLowerCase()
  const [days, setDays] = useState(30)
  const [proofFile, setProofFile] = useState(null)
  const [previewSrc, setPreviewSrc] = useState('')
  const [qrLoading, setQrLoading] = useState(true)
  const [form, setForm] = useState({
    username: '',
    password: '',
    discordId: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidPanel = panel && BASE_PRICES[panel] !== undefined
  const basePriceUSD = isValidPanel ? BASE_PRICES[panel] : 0
  const durationConfig = DURATION_MULTIPLIERS[days] || { multiplier: 1, label: `${days} Days` }
  const totalUsd = basePriceUSD * durationConfig.multiplier
  const totalInr = totalUsd * USD_TO_INR
  const requiresProof = panel !== 'free' && totalInr > 0

  const priceDisplayText = `USD ${totalUsd} (${totalInr} INR)`

  const upiUrl = useMemo(() => {
    return `upi://pay?pa=naveedmushtaq@ptyes&pn=${encodeURIComponent('Dark Skull Corp')}&am=${totalInr}&cu=INR&tn=DSC-${panel}`
  }, [panel, totalInr])

  const qrCodeUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`
  }, [upiUrl])

  function handleFileChange(event) {
    const file = event.target.files?.[0] || null
    if (file) {
      if (!ALLOWED_PROOF_TYPES.includes(file.type.toLowerCase())) {
        setError('Please upload a valid image file (PNG, JPG, JPEG).')
        setProofFile(null)
        setPreviewSrc('')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image is too large! Max allowed size is 5MB.')
        setProofFile(null)
        setPreviewSrc('')
        return
      }
      setError('')
      setProofFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreviewSrc(e.target?.result || '')
      reader.readAsDataURL(file)
    } else {
      setProofFile(null)
      setPreviewSrc('')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    const username = form.username.trim().toLowerCase()
    const password = form.password
    const discordId = form.discordId.trim() || 'None'

    if (!username || !password) {
      setError('Username and password are required.')
      return
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters long.')
      return
    }

    let base64String = ''
    if (requiresProof) {
      if (!proofFile) {
        setError('Screenshot proof is required.')
        return
      }
      base64String = previewSrc
    }

    setLoading(true)

    try {
      const orderData = {
        Username: username,
        PasswordHash: password,
        DiscordId: discordId,
        Plan: panel,
        Days: days,
        Amount: priceDisplayText,
        TxnId: 'SS_PROOF_ONLY',
        PaymentProofBase64: base64String,
      }

      await submitCheckout(orderData)
      setSuccess('Order placed successfully. Track it from the login dashboard.')
      setTimeout(() => {
        navigate('/pages/ulogin')
      }, 1500)
    } catch (submitError) {
      setError(
        extractApiMessage(
          submitError.payload,
          submitError.message || 'Order submission failed.',
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  if (!isValidPanel) {
    return (
      <main className="center-wrap">
        <section className="panel auth-card">
          <h1 className="auth-title">Invalid Selection</h1>
          <p className="auth-subtitle">No valid panel was selected for checkout.</p>
          <div className="mt-20">
            <NavLink className="button button-primary" to="/pages/products">
              View Products
            </NavLink>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="center-wrap">
      <section className="panel auth-card checkout-card" style={{ maxWidth: '880px', margin: '0 auto' }}>
        <div className="logo-mark free-panel-icon-60 mb-15">
          <img
            src="/images/dsclogo.png"
            alt="Dark Skull Corporation"
            className="header-logo-img"
          />
        </div>
        <h1 className="auth-title">Complete Order</h1>
        <p className="auth-subtitle">
          Selected: <strong id="displayPanelName" style={{ color: 'var(--primary)' }}>{panel.toUpperCase()} PANEL</strong>
        </p>

        <form id="checkoutForm" onSubmit={handleSubmit}>
          <div className="checkout-grid" style={{ marginTop: '24px' }}>
            {/* Left Column: Plan, Duration, Pricing & Payment Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <label className="field" htmlFor="selectDays">
                  <span className="micro-label">DURATION & PLAN</span>
                  <select
                    id="selectDays"
                    className="input-field"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                  >
                    {Object.entries(DURATION_MULTIPLIERS).map(([dayVal, cfg]) => (
                      <option key={dayVal} value={dayVal}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div style={{ marginTop: '16px' }}>
                  <span className="micro-label">TOTAL AMOUNT</span>
                  <div
                    id="displayPrice"
                    style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', marginTop: '4px' }}
                  >
                    {priceDisplayText}
                  </div>
                </div>
              </div>

              {requiresProof ? (
                <div className="card" style={{ padding: '20px' }}>
                  <span className="micro-label">UPI PAYMENT</span>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '4px', marginBottom: '14px' }}>
                    Pay via any UPI application or scan the QR code below.
                  </p>

                  <a
                    id="upiPayBtn"
                    className="button button-primary w-100"
                    href={upiUrl}
                  >
                    Pay with UPI App ({totalInr} INR)
                  </a>

                  <div className="payment-qr-container" style={{ margin: '16px auto 0', display: 'block' }}>
                    {qrLoading ? (
                      <div id="qrLoading" className="qr-placeholder">
                        <span style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Generating QR...</span>
                      </div>
                    ) : null}
                    <img
                      id="qrImage"
                      alt="UPI QR Code"
                      src={qrCodeUrl}
                      onLoad={() => setQrLoading(false)}
                      style={{
                        display: qrLoading ? 'none' : 'block',
                        margin: '0 auto',
                        borderRadius: '8px',
                      }}
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Right Column: Account Details & Screenshot Proof */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <label className="field" htmlFor="regUsername">
                  <span className="micro-label">DESIRED USERNAME</span>
                  <input
                    id="regUsername"
                    type="text"
                    placeholder="Must match game username"
                    value={form.username}
                    onChange={(e) => setForm((c) => ({ ...c, username: e.target.value }))}
                    required
                    autoComplete="username"
                  />
                </label>

                <label className="field" htmlFor="regPassword">
                  <span className="micro-label">ACCOUNT PASSWORD</span>
                  <input
                    id="regPassword"
                    type="password"
                    placeholder="Minimum 3 characters"
                    minLength={3}
                    value={form.password}
                    onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
                    required
                    autoComplete="new-password"
                  />
                </label>

                <label className="field" htmlFor="regDiscord">
                  <span className="micro-label">DISCORD USERNAME / ID (OPTIONAL)</span>
                  <input
                    id="regDiscord"
                    type="text"
                    placeholder="e.g. username#1234"
                    value={form.discordId}
                    onChange={(e) => setForm((c) => ({ ...c, discordId: e.target.value }))}
                  />
                </label>

                {requiresProof ? (
                  <div id="paymentProofGroup" style={{ marginTop: '16px' }}>
                    <label className="field" htmlFor="paymentProofImg">
                      <span className="micro-label">UPLOAD PAYMENT PROOF SCREENSHOT</span>
                      <input
                        id="paymentProofImg"
                        type="file"
                        className="custom-file-input"
                        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                        onChange={handleFileChange}
                      />
                    </label>

                    {previewSrc ? (
                      <div id="imagePreviewBox" className="image-preview-container">
                        <img
                          id="imagePreview"
                          alt="Screenshot Preview"
                          src={previewSrc}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {error ? (
                <div className="form-error">
                  {error}
                </div>
              ) : null}

              {success ? (
                <div className="form-success">
                  {success}
                </div>
              ) : null}

              <button
                type="submit"
                className="button button-primary button-lg w-100"
                disabled={loading}
              >
                {loading
                  ? requiresProof
                    ? 'Submitting Order...'
                    : 'Processing...'
                  : 'Submit Order'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}
