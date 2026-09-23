import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
            <a className="btn btn-primary" href="/pages/products">
              View Available Products
            </a>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="center-wrap">
      <section className="panel auth-card checkout-card" style={{ maxWidth: '800px', width: '100%' }}>
        <div className="logo-mark free-panel-icon-60 mb-15">
          <img
            src="/images/dsclogo.png"
            alt="Dark Skull Corporation"
            className="header-logo-img"
          />
        </div>
        <h1 className="auth-title">Complete Order</h1>
        <p className="auth-subtitle">
          Selected: <strong id="displayPanelName" className="text-secondary">{panel.toUpperCase()} PANEL</strong>
        </p>

        <form id="checkoutForm" onSubmit={handleSubmit}>
          <div className="checkout-container">
            {/* Left Column: Plan, Duration, Pricing & Payment Info */}
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '16px', background: 'var(--surface-strong)', borderRadius: '10px' }}>
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

                <div className="mt-15">
                  <span className="micro-label">TOTAL AMOUNT</span>
                  <div
                    id="displayPrice"
                    className="text-secondary"
                    style={{ fontSize: '1.4rem', fontWeight: '700', marginTop: '4px' }}
                  >
                    {priceDisplayText}
                  </div>
                </div>
              </div>

              {requiresProof ? (
                <div className="instruction-box" style={{ background: 'var(--surface-strong)', padding: '16px', borderRadius: '10px' }}>
                  <span className="micro-label">UPI PAYMENT</span>
                  <p style={{ fontSize: '0.88rem', color: 'var(--muted)', marginTop: '4px', marginBottom: '12px' }}>
                    Pay via any UPI application or scan the QR code below.
                  </p>

                  <a
                    id="upiPayBtn"
                    className="btn btn-primary pay-now-btn"
                    href={upiUrl}
                  >
                    Pay with UPI App ({totalInr} INR)
                  </a>

                  <div className="payment-qr-container" style={{ margin: '14px auto', display: 'block' }}>
                    {qrLoading ? (
                      <div id="qrLoading" className="qr-placeholder">
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Generating QR...</span>
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
            <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="card" style={{ padding: '16px', background: 'var(--surface-strong)', borderRadius: '10px' }}>
                <label className="field" htmlFor="regUsername">
                  <span className="micro-label">DESIRED USERNAME</span>
                  <input
                    id="regUsername"
                    className="input-field"
                    type="text"
                    placeholder="Must match game username"
                    value={form.username}
                    onChange={(e) => setForm((c) => ({ ...c, username: e.target.value }))}
                    required
                    autoComplete="username"
                  />
                </label>

                <label className="field mt-12" htmlFor="regPassword">
                  <span className="micro-label">ACCOUNT PASSWORD</span>
                  <input
                    id="regPassword"
                    className="input-field"
                    type="password"
                    placeholder="Minimum 3 characters"
                    minLength={3}
                    value={form.password}
                    onChange={(e) => setForm((c) => ({ ...c, password: e.target.value }))}
                    required
                    autoComplete="new-password"
                  />
                </label>

                <label className="field mt-12" htmlFor="regDiscord">
                  <span className="micro-label">DISCORD USERNAME / ID (OPTIONAL)</span>
                  <input
                    id="regDiscord"
                    className="input-field"
                    type="text"
                    placeholder="e.g. username#1234"
                    value={form.discordId}
                    onChange={(e) => setForm((c) => ({ ...c, discordId: e.target.value }))}
                  />
                </label>

                {requiresProof ? (
                  <div id="paymentProofGroup" className="mt-15">
                    <label className="field" htmlFor="paymentProofImg">
                      <span className="micro-label">UPLOAD PAYMENT PROOF SCREENSHOT</span>
                      <input
                        id="paymentProofImg"
                        type="file"
                        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                        onChange={handleFileChange}
                        style={{ marginTop: '6px' }}
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
                <div className="alert-box alert-danger">
                  <p className="mb-0 text-danger">{error}</p>
                </div>
              ) : null}

              {success ? (
                <div className="alert-box alert-success">
                  <p className="mb-0 text-success">{success}</p>
                </div>
              ) : null}

              <button
                type="submit"
                className="btn btn-primary btn-large w-100"
                disabled={loading}
              >
                {loading
                  ? requiresProof
                    ? 'Uploading Proof & Processing...'
                    : 'Processing...'
                  : 'Submit Order for Approval'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  )
}
