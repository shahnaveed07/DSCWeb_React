import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageSection } from '../components/ui/PageSection'
import { StateBlock } from '../components/ui/StateBlock'
import { useRemoteResource } from '../hooks/useRemoteResource'
import {
  getAdminSnapshot,
  isAuthError,
  mapAdminUsers,
  mapPendingOrders,
  mapSettingsRecord,
  updateAdminUser,
  processAdminOrder,
  changeAdminPassword,
  createAdminAccount,
  deleteAdminUser,
  toggleMaintenance,
  extractApiMessage,
} from '../services/dscApi'

function getValue(source, keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key]
  }
  return '—'
}

export function AdminDashboardPage({ session, systemStatus, onSessionInvalid }) {
  const [revision, setRevision] = useState(0)
  const [editUser, setEditUser] = useState(null)
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' })
  const [busy, setBusy] = useState(false)
  const { data, error, loading } = useRemoteResource(
    () => getAdminSnapshot(session.token),
    [session?.token, revision],
    { enabled: Boolean(session?.token) },
  )

  useEffect(() => {
    if (isAuthError(error)) onSessionInvalid()
  }, [error, onSessionInvalid])

  if (loading) {
    return (
      <section className="dashboard-shell">
        <div className="panel-card">
          <h1>Loading admin workspace</h1>
          <p className="hero-copy">Gathering overview data from the current API.</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="dashboard-shell">
        <StateBlock
          title="Admin overview could not be loaded"
          message={error.message || 'Please try again in a moment.'}
          tone="warning"
        />
      </section>
    )
  }

  const users = data?.users?.status === 'fulfilled' ? mapAdminUsers(data.users.value) : []
  const orders = data?.orders?.status === 'fulfilled' ? mapPendingOrders(data.orders.value) : []
  const settings =
    data?.settings?.status === 'fulfilled' ? mapSettingsRecord(data.settings.value) : {}
  const ownerAccess = data?.ownerAccess?.status === 'fulfilled'

  async function runAction(action) {
    setBusy(true); setMessage('')
    try { await action(); setRevision((value) => value + 1) }
    catch (issue) {
      if (isAuthError(issue)) onSessionInvalid()
      else setMessage(extractApiMessage(issue.payload, issue.message || 'Action failed.'))
    } finally { setBusy(false) }
  }

  async function saveUser(event) {
    event.preventDefault()
    const id = editUser?.id ?? editUser?.Id
    await runAction(async () => {
      await updateAdminUser(session.token, {
        userId: Number(id), plan: editUser.plan ?? editUser.Plan,
        expiryTime: editUser.expiryTime ?? editUser.ExpiryTime ?? null,
        isBanned: Boolean(editUser.isBanned ?? editUser.IsBanned),
      })
      setEditUser(null)
      setMessage('User updated successfully.')
    })
  }

  async function changePassword(event) {
    event.preventDefault()
    await runAction(async () => {
      await changeAdminPassword(session.token, passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ currentPassword: '', newPassword: '' })
      setMessage('Admin password updated successfully.')
    })
  }

  async function createAdmin(event) {
    event.preventDefault()
    await runAction(async () => {
      await createAdminAccount(session.token, newAdmin.username.trim().toLowerCase(), newAdmin.password)
      setNewAdmin({ username: '', password: '' })
      setShowCreateAdmin(false)
      setMessage('Admin account created successfully.')
    })
  }

  return (
    <section className="dashboard-shell">
      <div className="dashboard-grid">
        <article className="panel-card">
          <span className="micro-label">Admin Session</span>
          <h1>{String(session.username || 'admin').toUpperCase()}</h1>
          <p>{ownerAccess ? 'Owner-level access confirmed.' : 'Standard admin access or unknown owner status.'}</p>
        </article>

        <article className="panel-card">
          <span className="micro-label">Users</span>
          <h2>{users.length}</h2>
          <p>Count derived from `/api/admin/users`.</p>
        </article>

        <article className="panel-card">
          <span className="micro-label">Pending Orders</span>
          <h2>{orders.length}</h2>
          <p>Count derived from `/api/admin/orders/pending`.</p>
        </article>

        <article className="panel-card">
          <span className="micro-label">Maintenance</span>
          <h2>
            {systemStatus?.isMaintenanceMode || systemStatus?.IsMaintenanceMode ? 'Active' : 'Off'}
          </h2>
          <p>{settings?.maintenanceReason || settings?.MaintenanceReason || 'No maintenance message provided.'}</p>
        </article>
      </div>

      <PageSection
        description="Manage user access and process pending store orders using the existing admin API."
        eyebrow="Admin Data"
        title="Operational preview"
      >
        <div className="hero-actions">
          <Link className="button button-secondary" to="/pages/generatekey">Generate Key</Link>
          {ownerAccess ? <Link className="button button-secondary" to="/pages/ownerdb">DB Manager</Link> : null}
          {ownerAccess ? <button className="button button-secondary" disabled={busy} onClick={() => setShowCreateAdmin((value) => !value)} type="button">Create Admin</button> : null}
          <button className="button button-secondary" disabled={busy} onClick={() => runAction(() => toggleMaintenance(session.token, !(systemStatus?.isMaintenanceMode || systemStatus?.IsMaintenanceMode)))} type="button">Toggle Maintenance</button>
          <button className="button button-secondary" disabled={busy} onClick={() => setRevision((value) => value + 1)} type="button">Refresh</button>
        </div>
        {message ? <p role="status">{message}</p> : null}
        <div className="table-card">
          <h3>Recent users</h3>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 6).map((user, index) => (
                <tr key={getValue(user, ['id', 'Id', 'username', 'Username']) + index}>
                  <td>{getValue(user, ['username', 'Username'])}</td>
                  <td>{getValue(user, ['plan', 'Plan'])}</td>
                  <td>{getValue(user, ['status', 'Status'])}</td>
                  <td>{getValue(user, ['expiry', 'Expiry', 'expiryTime', 'ExpiryTime'])}</td>
                  <td className="row-actions"><button className="button button-secondary" type="button" onClick={() => setEditUser({ ...user })}>Edit</button>{ownerAccess ? <button className="button button-secondary" disabled={busy} type="button" onClick={() => window.confirm(`Permanently delete ${getValue(user, ['username', 'Username'])}?`) && runAction(() => deleteAdminUser(session.token, user.id ?? user.Id))}>Delete</button> : null}</td>
                </tr>
              ))}
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">No user data returned.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <h3>Pending orders</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Discord</th>
                <th>Plan</th>
                <th>Days</th>
                <th>Amount</th>
                <th>Txn / UTR</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((order, index) => (
                <tr key={getValue(order, ['id', 'Id', 'username', 'Username']) + index}>
                  <td>{getValue(order, ['id', 'Id'])}</td>
                  <td>{getValue(order, ['username', 'Username'])}</td>
                  <td>{getValue(order, ['discordId', 'DiscordId'])}</td>
                  <td>{getValue(order, ['plan', 'Plan'])}</td>
                  <td>{getValue(order, ['days', 'Days'])}</td>
                  <td>{getValue(order, ['amount', 'Amount'])}</td>
                  <td>{getValue(order, ['txnId', 'TxnId', 'utr', 'UTR'])}</td>
                  <td className="row-actions"><button className="button button-primary" disabled={busy} type="button" onClick={() => window.confirm('Approve this order and issue its key?') && runAction(() => processAdminOrder(session.token, order.id ?? order.Id, 'approve'))}>Approve</button><button className="button button-secondary" disabled={busy} type="button" onClick={() => window.confirm('Reject this order?') && runAction(() => processAdminOrder(session.token, order.id ?? order.Id, 'reject'))}>Reject</button></td>
                </tr>
              ))}
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8">No pending order data returned.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </PageSection>

      {showCreateAdmin ? <PageSection eyebrow="Owner Control" title="Create New Admin">
        <form className="form-stack" onSubmit={createAdmin}>
          <label className="field"><span>Username</span><input autoComplete="username" required value={newAdmin.username} onChange={(event) => setNewAdmin({ ...newAdmin, username: event.target.value })} /></label>
          <label className="field"><span>Password (minimum 6 characters)</span><input autoComplete="new-password" minLength={6} required type="password" value={newAdmin.password} onChange={(event) => setNewAdmin({ ...newAdmin, password: event.target.value })} /></label>
          <div className="hero-actions"><button className="button button-primary" disabled={busy} type="submit">Create Admin</button><button className="button button-secondary" type="button" onClick={() => setShowCreateAdmin(false)}>Cancel</button></div>
        </form>
      </PageSection> : null}

      {editUser ? <div className="modal-overlay open" role="dialog" aria-modal="true"><form className="modal-card form-stack" onSubmit={saveUser}>
        <h2>Edit User</h2>
        <label className="field"><span>Plan</span><input required value={editUser.plan ?? editUser.Plan ?? ''} onChange={(event) => setEditUser({ ...editUser, plan: event.target.value })} /></label>
        <label className="field"><span>Expiry</span><input type="datetime-local" value={String(editUser.expiryTime ?? editUser.ExpiryTime ?? '').slice(0, 16)} onChange={(event) => setEditUser({ ...editUser, expiryTime: event.target.value ? new Date(event.target.value).toISOString() : null })} /></label>
        <label className="field"><span>Ban Status</span><select value={String(Boolean(editUser.isBanned ?? editUser.IsBanned))} onChange={(event) => setEditUser({ ...editUser, isBanned: event.target.value === 'true' })}><option value="false">Active</option><option value="true">Banned</option></select></label>
        <div className="hero-actions"><button className="button button-primary" disabled={busy} type="submit">Save Changes</button><button className="button button-secondary" type="button" onClick={() => setEditUser(null)}>Cancel</button></div>
      </form></div> : null}
      <PageSection eyebrow="Account" title="Change admin password">
        <form className="form-stack" onSubmit={changePassword}>
          <label className="field"><span>Current password</span><input required type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} /></label>
          <label className="field"><span>New password (minimum 6 characters)</span><input required minLength={6} type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} /></label>
          <button className="button button-primary" disabled={busy} type="submit">Update Password</button>
        </form>
      </PageSection>
    </section>
  )
}
