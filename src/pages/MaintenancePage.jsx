export function MaintenancePage({ systemStatus }) {
  return (
    <section className="auth-shell">
      <div className="auth-card">
        <span className="hero-eyebrow">Maintenance</span>
        <h1>System maintenance is active.</h1>
        <p className="hero-copy">
          {systemStatus?.maintenanceReason ||
            systemStatus?.MaintenanceReason ||
            'The platform is currently being updated. Please check back later.'}
        </p>
      </div>
    </section>
  )
}
