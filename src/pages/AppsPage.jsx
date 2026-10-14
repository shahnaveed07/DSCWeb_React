import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export function AppsPage() {
  usePageMeta({
    title: 'Applications & Mobile Software Portfolio',
    description:
      'Explore official mobile applications and software utilities developed by Dark Skull Corporation, including QR Scanner, Mind Matrix, and interactive productivity tools.',
    canonical: 'https://dscweb.me/pages/apps',
  })

  // Interactive Web Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcHistory, setCalcHistory] = useState([])
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false)
  const [calcPrevValue, setCalcPrevValue] = useState(null)
  const [calcOperation, setCalcOperation] = useState(null)
  const [copiedResult, setCopiedResult] = useState(false)

  function handleCalcDigit(digit) {
    if (calcWaitingForOperand) {
      setCalcDisplay(String(digit))
      setCalcWaitingForOperand(false)
    } else {
      setCalcDisplay(calcDisplay === '0' ? String(digit) : calcDisplay + digit)
    }
  }

  function handleCalcDecimal() {
    if (calcWaitingForOperand) {
      setCalcDisplay('0.')
      setCalcWaitingForOperand(false)
      return
    }
    if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.')
    }
  }

  function handleCalcClear() {
    setCalcDisplay('0')
    setCalcPrevValue(null)
    setCalcOperation(null)
    setCalcWaitingForOperand(false)
  }

  function handleCalcBackspace() {
    if (calcWaitingForOperand) return
    if (calcDisplay.length > 1) {
      setCalcDisplay(calcDisplay.slice(0, -1))
    } else {
      setCalcDisplay('0')
    }
  }

  function handleCalcOperator(nextOp) {
    const inputValue = parseFloat(calcDisplay)

    if (calcPrevValue === null) {
      setCalcPrevValue(inputValue)
    } else if (calcOperation) {
      const currentValue = calcPrevValue || 0
      let computed = currentValue

      if (calcOperation === '+') computed = currentValue + inputValue
      if (calcOperation === '-') computed = currentValue - inputValue
      if (calcOperation === '×' || calcOperation === '*') computed = currentValue * inputValue
      if (calcOperation === '÷' || calcOperation === '/') {
        computed = inputValue === 0 ? 'Error' : currentValue / inputValue
      }

      setCalcDisplay(String(computed))
      setCalcPrevValue(computed)

      if (computed !== 'Error') {
        setCalcHistory((prev) => [
          `${currentValue} ${calcOperation} ${inputValue} = ${computed}`,
          ...prev.slice(0, 4),
        ])
      }
    }

    setCalcWaitingForOperand(true)
    setCalcOperation(nextOp)
  }

  function handleCalcEqual() {
    if (!calcOperation || calcPrevValue === null) return
    const inputValue = parseFloat(calcDisplay)
    let computed = calcPrevValue

    if (calcOperation === '+') computed = calcPrevValue + inputValue
    if (calcOperation === '-') computed = calcPrevValue - inputValue
    if (calcOperation === '×' || calcOperation === '*') computed = calcPrevValue * inputValue
    if (calcOperation === '÷' || calcOperation === '/') {
      computed = inputValue === 0 ? 'Error' : calcPrevValue / inputValue
    }

    setCalcDisplay(String(computed))
    if (computed !== 'Error') {
      setCalcHistory((prev) => [
        `${calcPrevValue} ${calcOperation} ${inputValue} = ${computed}`,
        ...prev.slice(0, 4),
      ])
    }
    setCalcPrevValue(null)
    setCalcOperation(null)
    setCalcWaitingForOperand(true)
  }

  async function handleCopyCalc() {
    try {
      await navigator.clipboard.writeText(calcDisplay)
      setCopiedResult(true)
      setTimeout(() => setCopiedResult(false), 1500)
    } catch {
      // Ignore clipboard write errors
    }
  }

  return (
    <div className="center-wrap">
      {/* Header */}
      <section className="page-header-center">
        <span className="hero-eyebrow">Dark Skull Corporation</span>
        <h1>Applications &amp; Interactive Software</h1>
        <p>
          Explore mobile applications, interactive tools, and lightweight desktop utilities
          engineered for speed, minimal memory usage, and zero advertising bloat.
        </p>
      </section>

      {/* Applications Showcase */}
      <div className="apps-list" style={{ marginTop: '32px' }}>
        {/* App 1: Interactive Calculator Tool */}
        <article className="app-card" id="calculator-tool">
          <div className="app-card-header">
            <div>
              <span className="badge good">INTERACTIVE UTILITY &amp; DESKTOP APP</span>
              <h2 className="app-card-title">Calculator</h2>
            </div>
            <div>
              <NavLink to="/pages/downloads" className="button button-secondary">
                View in Downloads
              </NavLink>
            </div>
          </div>

          <p className="app-card-tagline">
            Ultra-fast mathematics utility for browser and desktop with instant expression parsing.
          </p>
          <p className="app-card-desc">
            Designed for distraction-free calculations with zero telemetry or background data mining.
            Use the working web version below directly in your browser, or request our portable Windows desktop executable.
          </p>

          <div className="app-feature-grid" style={{ marginBottom: '24px' }}>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>Zero-latency browser calculation</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>Calculation history log</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>One-click clipboard copy</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>No intrusive ads or telemetry</span>
            </div>
          </div>

          {/* Embedded Working Web Calculator */}
          <div
            className="card"
            style={{
              maxWidth: '380px',
              margin: '0 auto',
              padding: '20px',
              background: 'var(--surface-hover)',
              border: '1px solid var(--surface-border)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="micro-label" style={{ color: 'var(--muted)' }}>DSC WEB CALCULATOR</span>
              <button
                type="button"
                onClick={handleCopyCalc}
                className="button button-ghost button-sm"
                style={{ fontSize: '0.76rem', padding: '2px 8px' }}
              >
                {copiedResult ? 'Copied!' : 'Copy Result'}
              </button>
            </div>

            {/* Display screen */}
            <div
              style={{
                background: 'var(--bg)',
                border: '1px solid var(--surface-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                textAlign: 'right',
                fontSize: '1.8rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: 'var(--primary)',
                minHeight: '60px',
                overflowX: 'auto',
                marginBottom: '16px',
              }}
            >
              {calcDisplay}
            </div>

            {/* Keypad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              <button type="button" className="button button-secondary" onClick={handleCalcClear} style={{ fontWeight: 700, color: 'var(--danger)' }}>C</button>
              <button type="button" className="button button-secondary" onClick={handleCalcBackspace}>⌫</button>
              <button type="button" className="button button-secondary" onClick={() => handleCalcOperator('÷')}>÷</button>
              <button type="button" className="button button-secondary" onClick={() => handleCalcOperator('×')}>×</button>

              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(7)}>7</button>
              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(8)}>8</button>
              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(9)}>9</button>
              <button type="button" className="button button-secondary" onClick={() => handleCalcOperator('-')}>−</button>

              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(4)}>4</button>
              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(5)}>5</button>
              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(6)}>6</button>
              <button type="button" className="button button-secondary" onClick={() => handleCalcOperator('+')}>+</button>

              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(1)}>1</button>
              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(2)}>2</button>
              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(3)}>3</button>
              <button type="button" className="button button-primary" onClick={handleCalcEqual} style={{ gridRow: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>=</button>

              <button type="button" className="button button-ghost" onClick={() => handleCalcDigit(0)} style={{ gridColumn: 'span 2' }}>0</button>
              <button type="button" className="button button-ghost" onClick={handleCalcDecimal}>.</button>
            </div>

            {/* History reel */}
            {calcHistory.length > 0 ? (
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--surface-border)' }}>
                <span className="micro-label" style={{ display: 'block', marginBottom: '4px' }}>RECENT CALCULATIONS</span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'monospace' }}>
                  {calcHistory.map((h, i) => (
                    <li key={i} style={{ padding: '2px 0' }}>{h}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </article>

        {/* App 2: QR Scanner | Generator */}
        <article className="app-card">
          <div className="app-card-header">
            <div>
              <span className="badge warning">ANDROID UTILITY</span>
              <h2 className="app-card-title">QR Scanner | Generator</h2>
            </div>
            <div>
              <a
                className="button button-primary"
                href="https://play.google.com/store/apps/details?id=com.dsc.qrscanner"
                target="_blank"
                rel="noreferrer"
              >
                Google Play ↗
              </a>
            </div>
          </div>

          <p className="app-card-tagline">
            High-speed camera scanner &amp; customizable barcode/QR generator for Android.
          </p>
          <p className="app-card-desc">
            Instantly scan barcodes and QR codes with autofocus detection. Generate custom, styled QR codes from website links, Wi-Fi network credentials, contact cards (vCard), phone numbers, and plain text without needing an active internet connection.
          </p>

          <div className="app-feature-grid">
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>Autofocus real-time camera viewfinder</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>100% offline generation engine</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>Wi-Fi, URL, Text, and vCard formats</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>Direct share, copy &amp; save to device</span>
            </div>
          </div>

          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'var(--surface-hover)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              color: 'var(--muted)',
            }}
          >
            <strong>Permissions Transparency:</strong> Camera access is requested strictly when the scanner viewfinder is active. Storage permission is requested only when exporting a generated QR image file to your gallery. No location data or contacts are ever uploaded.
          </div>
        </article>

        {/* App 3: Mind Matrix */}
        <article className="app-card">
          <div className="app-card-header">
            <div>
              <span className="badge warning">MOBILE LOGIC GAME</span>
              <h2 className="app-card-title">Mind Matrix</h2>
            </div>
            <div>
              <a
                className="button button-primary"
                href="https://play.google.com/store/apps/details?id=com.dsc.mindmatrix"
                target="_blank"
                rel="noreferrer"
              >
                Google Play ↗
              </a>
            </div>
          </div>

          <p className="app-card-tagline">
            Cognitive puzzle game with logic, memory, pattern recognition, and reaction drills.
          </p>
          <p className="app-card-desc">
            Mind Matrix is a handcrafted logic game engineered for players who enjoy mental exercises. Features progressive difficulty scaling across multiple challenge modes designed to train short-term memory, pattern recognition, and cognitive reflexes.
          </p>

          <div className="app-feature-grid">
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>Progressive cognitive difficulty scaling</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>100% offline playable without internet</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>Smooth 60 FPS animations &amp; tactile touch</span>
            </div>
            <div className="app-feature-item">
              <span className="app-feature-check">✓</span>
              <span>Zero pay-to-win mechanics or paywalls</span>
            </div>
          </div>
        </article>
      </div>

      {/* Engineering Constitution & Quality Standards */}
      <section className="seo-section" style={{ marginTop: '48px', marginBottom: '40px' }}>
        <div className="seo-container">
          <span className="badge good mb-8">Engineering Standards</span>
          <h2 style={{ marginTop: '10px' }}>Our App Quality &amp; Privacy Constitution</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            We design software around user respect and long-term reliability:
          </p>

          <div className="card-grid columns-3" style={{ gap: '20px' }}>
            <article className="info-card">
              <span className="card-badge">PRIVACY FIRST</span>
              <h3 style={{ marginTop: '8px' }}>Zero Background Mining</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                Our applications never run background tracking processes, silently upload user contacts, or log device telemetry without explicit consent.
              </p>
            </article>

            <article className="info-card">
              <span className="card-badge">EFFICIENCY</span>
              <h3 style={{ marginTop: '8px' }}>Low Resource Footprint</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                We engineer our binaries in native languages (C#, Kotlin, React) to ensure fast startup times, low battery consumption, and small APK/binary sizes.
              </p>
            </article>

            <article className="info-card">
              <span className="card-badge">TRANSPARENCY</span>
              <h3 style={{ marginTop: '8px' }}>Open Verification</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                We communicate release notes honestly on GitHub and Discord, and maintain transparent permissions for all published Android packages.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  )
}
