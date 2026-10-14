import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { contactChannels } from '../content/siteContent'

export function ContactPage() {
  usePageMeta({
    title: 'Contact Support & Developer Channels',
    description:
      'Get in touch with Dark Skull Corporation for software support, order verification, licensing assistance, or direct Discord community interaction.',
    canonical: 'https://dscweb.me/pages/contact',
  })

  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'order',
    subject: '',
    message: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [copiedText, setCopiedText] = useState(false)
  const [formError, setFormError] = useState('')

  const categoryLabels = {
    order: 'Order / Payment Verification',
    support: 'Technical & Software Support',
    freepanel: 'Free Panel Assistance',
    custom: 'Custom Build & Enterprise Inquiry',
    bug: 'Bug Report / Vulnerability',
    general: 'General Question',
  }

  function handleFormSubmit(e) {
    e.preventDefault()
    setFormError('')

    const name = form.name.trim()
    const email = form.email.trim()
    const subject = form.subject.trim()
    const message = form.message.trim()

    if (!name || !email || !subject || !message) {
      setFormError('Please fill in all required fields.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError('Please enter a valid email address.')
      return
    }

    if (message.length < 10) {
      setFormError('Please provide a descriptive message (at least 10 characters).')
      return
    }

    setFormSubmitted(true)
  }

  const formattedInquiry = `Category: ${categoryLabels[form.category] || form.category}
From: ${form.name} (${form.email})
Subject: ${form.subject}

Message:
${form.message}
`

  const mailtoUrl = `mailto:darkskullcorporation@gmail.com?subject=${encodeURIComponent(
    `[DSC Inquiry - ${categoryLabels[form.category] || 'Support'}] ${form.subject}`,
  )}&body=${encodeURIComponent(formattedInquiry)}`

  async function handleCopyInquiry() {
    try {
      await navigator.clipboard.writeText(formattedInquiry)
      setCopiedText(true)
      setTimeout(() => setCopiedText(false), 2000)
    } catch {
      // Ignore clipboard error
    }
  }

  return (
    <div className="center-wrap">
      {/* Header */}
      <section className="page-header-center">
        <span className="hero-eyebrow">Dark Skull Corporation</span>
        <h1>Contact &amp; Developer Support</h1>
        <p>
          Have questions about your order, need technical assistance with software panels, or want to discuss a custom build?
          Reach our team through our official Discord community, support email, or the inquiry form below.
        </p>
      </section>

      {/* Official Communication Channels Grid */}
      <div className="channels-grid" style={{ marginTop: '32px' }}>
        {contactChannels.map((c) => (
          <article key={c.label} className="channel-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge warning mb-10">{c.label}</span>
              <h2 className="channel-card-title">{c.title}</h2>
              <p className="channel-card-desc">{c.body}</p>
            </div>

            <div className="channel-card-action">
              <a
                className="button button-primary w-100"
                href={c.action.href}
                target={c.action.href.startsWith('mailto:') ? '_self' : '_blank'}
                rel="noreferrer"
              >
                {c.action.label} {c.action.href.startsWith('http') ? '↗' : ''}
              </a>
            </div>
          </article>
        ))}
      </div>

      {/* Working Contact Inquiry Form */}
      <section className="seo-section" style={{ marginTop: '48px' }}>
        <div className="seo-container">
          <span className="badge good mb-8">Direct Message</span>
          <h2 style={{ marginTop: '10px' }}>Send a Support Inquiry</h2>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>
            Fill in the details below. You can send it directly to our official support mailbox or copy the formatted text to paste into Discord support tickets.
          </p>

          {formSubmitted ? (
            <div className="card" style={{ padding: '24px', background: 'var(--surface-hover)', border: '1px solid var(--primary-border, var(--surface-border))' }}>
              <span className="badge good mb-8">INQUIRY PREPARED</span>
              <h3 style={{ margin: '8px 0 12px', color: 'var(--text)' }}>Ready to Send</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.5', margin: '0 0 16px' }}>
                Your inquiry has been compiled. Click below to launch your default email client, or copy the formatted message to send on Discord:
              </p>

              <pre
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--surface-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px',
                  fontSize: '0.84rem',
                  color: 'var(--text)',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '20px',
                }}
              >
                {formattedInquiry}
              </pre>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a href={mailtoUrl} className="button button-primary">
                  Open Email Client (darkskullcorporation@gmail.com) ↗
                </a>
                <button type="button" onClick={handleCopyInquiry} className="button button-secondary">
                  {copiedText ? 'Copied to Clipboard!' : 'Copy Formatted Text'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false)
                    setForm({ name: '', email: '', category: 'order', subject: '', message: '' })
                  }}
                  className="button button-ghost"
                >
                  Write Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} style={{ maxWidth: '640px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <label className="field" htmlFor="contactName">
                  <span className="micro-label">YOUR NAME *</span>
                  <input
                    id="contactName"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </label>

                <label className="field" htmlFor="contactEmail">
                  <span className="micro-label">YOUR EMAIL ADDRESS *</span>
                  <input
                    id="contactEmail"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </label>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <label className="field" htmlFor="contactCategory">
                  <span className="micro-label">INQUIRY CATEGORY *</span>
                  <select
                    id="contactCategory"
                    className="input-field"
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="order">Order / Payment Verification</option>
                    <option value="support">Technical &amp; Software Support</option>
                    <option value="freepanel">Free Panel Assistance</option>
                    <option value="custom">Custom Build &amp; Enterprise Inquiry</option>
                    <option value="bug">Bug Report / Vulnerability</option>
                    <option value="general">General Question</option>
                  </select>
                </label>

                <label className="field" htmlFor="contactSubject">
                  <span className="micro-label">SUBJECT *</span>
                  <input
                    id="contactSubject"
                    type="text"
                    required
                    placeholder="Brief summary of inquiry"
                    value={form.subject}
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                  />
                </label>
              </div>

              <label className="field" htmlFor="contactMessage" style={{ marginBottom: '20px' }}>
                <span className="micro-label">MESSAGE DETAILS *</span>
                <textarea
                  id="contactMessage"
                  required
                  rows={5}
                  placeholder="Include any relevant order IDs, hardware tokens, or detailed questions..."
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </label>

              {formError ? (
                <div className="form-error" style={{ marginBottom: '16px' }}>
                  {formError}
                </div>
              ) : null}

              <button type="submit" className="button button-primary button-lg">
                Submit Inquiry Details
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Order Verification Notice */}
      <section className="seo-section" style={{ marginTop: '32px', marginBottom: '40px' }}>
        <div className="seo-container">
          <span className="badge warning mb-8">Order Notice</span>
          <h2 style={{ marginTop: '10px' }}>Order &amp; Payment Verification Timeline</h2>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>
            Orders placed via the checkout system undergo manual verification of uploaded screenshot payment proofs. Once confirmed by an administrator, your license key is unlocked immediately on your <strong>Client Dashboard</strong>.
          </p>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6', marginTop: '10px' }}>
            Typical verification takes between 15 minutes and 2 hours during active operating windows (UTC+0 to UTC+12). If your order remains pending after 24 hours, post your registered username and order details in our Discord <code>#order-help</code> channel for priority review.
          </p>
        </div>
      </section>
    </div>
  )
}
