import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { evaluateRouteAccess, getRoute } from './routeMap'
import { sendAssistantMessage } from '../../services/assistantService'

const WELCOME_MESSAGE = {
  id: 'welcome',
  sender: 'assistant',
  text: "Hey! Welcome to DSC. I'm your AI Assistant. I can help you explore our website, find products and downloads, understand available services, and answer questions about DSC. What would you like to do?",
  links: [
    { label: 'Explore Products', routeKey: 'products' },
    { label: 'Open Downloads', routeKey: 'downloads' },
    { label: 'Free Panel', routeKey: 'freepanel' },
    { label: 'How to Purchase', routeKey: 'checkout' },
    { label: 'User Login', routeKey: 'ulogin' },
    { label: 'Contact Support', routeKey: 'contact' },
  ],
  timestamp: new Date(),
}

const QUICK_SUGGESTIONS = [
  'Explore Products',
  'Open Downloads',
  'Free Panel',
  'How to Purchase',
  'User Login',
  'Contact Support',
]

let messageSeq = 0

function makeMessage(sender, text, extra = {}) {
  messageSeq += 1
  return {
    id: `${sender}-${messageSeq}`,
    sender,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ...extra,
  }
}

export function DSCAssistant({ session }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorState, setErrorState] = useState(null)
  const [hasUnread, setHasUnread] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatPanelRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Scroll to bottom when messages update or panel opens
  useEffect(() => {
    if (isOpen && typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  // Focus input when panel is opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle escape key to close widget
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  function handleToggleOpen() {
    setIsOpen((prev) => {
      const next = !prev
      if (next) {
        setHasUnread(false)
      }
      return next
    })
  }

  function handleReset() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setMessages([
      makeMessage('assistant', WELCOME_MESSAGE.text, {
        links: WELCOME_MESSAGE.links,
      }),
    ])
    setErrorState(null)
    setIsLoading(false)
    setInputValue('')
  }

  function executeNavigation(routeKey) {
    const route = getRoute(routeKey)
    if (!route) return

    const access = evaluateRouteAccess(routeKey, session)
    if (access.targetPath) {
      navigate(access.targetPath)
    }
  }

  async function handleSendQuery(queryText) {
    const query = String(queryText || inputValue || '').trim()
    if (!query || isLoading) return

    setInputValue('')
    setErrorState(null)

    // Add user message
    const userMessage = makeMessage('user', query)

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Setup abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await sendAssistantMessage({
        message: query,
        conversationHistory: messages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        })),
        currentRoute: location.pathname,
        session,
        signal: controller.signal,
      })

      // Add assistant message
      const assistantMessage = makeMessage('assistant', response.message, {
        links: response.links || [],
        routeKey: response.routeKey || null,
      })

      setMessages((prev) => [...prev, assistantMessage])

      // If response has direct navigation intent, automatically navigate
      if (response.type === 'navigate' && response.routeKey) {
        executeNavigation(response.routeKey)
      }

      if (!isOpen) {
        setHasUnread(true)
      }
    } catch (err) {
      if (err?.name === 'AbortError') return

      const errorMsg = 'Sorry, I ran into an issue connecting. Please try again.'
      setErrorState({
        message: errorMsg,
        retryQuery: query,
      })

      setMessages((prev) => [
        ...prev,
        makeMessage('assistant', errorMsg, { isError: true }),
      ])
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendQuery()
    }
  }

  function handleRetry() {
    if (errorState?.retryQuery) {
      handleSendQuery(errorState.retryQuery)
    }
  }

  return (
    <div className="dsc-assistant-wrapper" aria-label="DSC AI Assistant widget">
      {/* Floating launcher trigger */}
      <button
        type="button"
        className={`dsc-assistant-launcher ${isOpen ? 'is-active' : ''}`}
        onClick={handleToggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={isOpen ? 'Close DSC AI Assistant' : 'Open DSC AI Assistant'}
        title={isOpen ? 'Close DSC AI Assistant' : 'Open DSC AI Assistant'}
      >
        <span className="dsc-assistant-launcher-icon">
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
              <path d="M9.5 13.5c.8.6 1.7.8 2.5.8s1.7-.2 2.5-.8" />
            </svg>
          )}
        </span>
        <span className="dsc-assistant-launcher-label">DSC Assistant</span>
        {hasUnread && !isOpen && <span className="dsc-assistant-badge" aria-label="Unread message" />}
      </button>

      {/* Slide-in / Popup Chat Panel */}
      {isOpen && (
        <section
          ref={chatPanelRef}
          className="dsc-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="dsc-assistant-title"
        >
          {/* Header */}
          <header className="dsc-assistant-header">
            <div className="dsc-assistant-header-identity">
              <div className="dsc-assistant-avatar" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div>
                <h2 id="dsc-assistant-title" className="dsc-assistant-title">
                  DSC AI Assistant
                </h2>
                <div className="dsc-assistant-status">
                  <span className="dsc-assistant-status-dot" aria-hidden="true" />
                  <span>AI Powered • Website Guide</span>
                </div>
              </div>
            </div>

            <div className="dsc-assistant-header-actions">
              <button
                type="button"
                className="dsc-assistant-btn-icon"
                onClick={handleReset}
                title="Reset conversation"
                aria-label="Reset conversation"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>
              <button
                type="button"
                className="dsc-assistant-btn-icon"
                onClick={handleToggleOpen}
                title="Close assistant"
                aria-label="Close assistant"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          {/* Quick Suggestion Pills */}
          <div className="dsc-assistant-quick-prompts" aria-label="Suggested questions">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="dsc-assistant-quick-btn"
                onClick={() => handleSendQuery(suggestion)}
                disabled={isLoading}
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="dsc-assistant-body" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`dsc-assistant-msg dsc-assistant-msg-${msg.sender} ${msg.isError ? 'is-error' : ''}`}
              >
                <div className="dsc-assistant-bubble">
                  <div className="dsc-assistant-text">{msg.text}</div>

                  {/* Clickable links if provided */}
                  {Array.isArray(msg.links) && msg.links.length > 0 && (
                    <div className="dsc-assistant-links">
                      {msg.links.map((link) => (
                        <button
                          key={link.routeKey}
                          type="button"
                          className="dsc-assistant-link-btn"
                          onClick={() => executeNavigation(link.routeKey)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          <span>{link.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="dsc-assistant-msg dsc-assistant-msg-assistant">
                <div className="dsc-assistant-bubble dsc-assistant-typing">
                  <span className="dsc-typing-dot" />
                  <span className="dsc-typing-dot" />
                  <span className="dsc-typing-dot" />
                </div>
              </div>
            )}

            {/* Retry button on error */}
            {errorState && (
              <div className="dsc-assistant-error-banner">
                <span>{errorState.message}</span>
                <button
                  type="button"
                  className="dsc-assistant-retry-btn"
                  onClick={handleRetry}
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <form
            className="dsc-assistant-footer"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendQuery()
            }}
          >
            <textarea
              ref={inputRef}
              rows="1"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about DSC or say 'Take me to products'..."
              className="dsc-assistant-input"
              aria-label="Your question or navigation request"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="dsc-assistant-send-btn"
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send query"
              title="Send (Enter)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </section>
      )}
    </div>
  )
}
