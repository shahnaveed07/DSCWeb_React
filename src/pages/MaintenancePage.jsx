export function MaintenancePage({ systemStatus }) {
  const reason =
    systemStatus?.maintenanceReason ||
    systemStatus?.MaintenanceReason ||
    'DSCWeb is temporarily offline while maintenance or critical system updates are performed. We will be back shortly.'

  return (
    <div className="maintenance-container">
      <div className="maintenance-icon">
        <svg
          width="42"
          height="42"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="maintenance-title">UNDER MAINTENANCE</h1>

      <p className="maintenance-text">{reason}</p>

      <div className="maintenance-buttons">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
        <a
          className="btn btn-secondary"
          href="https://discord.gg/XB2Zjmsb7K"
          target="_blank"
          rel="noreferrer"
        >
          Discord Support
        </a>
      </div>
    </div>
  )
}
