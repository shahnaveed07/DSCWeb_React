import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useRemoteResource } from '../hooks/useRemoteResource'
import {
  changeAdminPassword,
  createAdminAccount,
  deleteAdminUser,
  extractApiMessage,
  getAdminSnapshot,
  isAuthError,
  mapAdminUsers,
  mapPendingOrders,
  mapSettingsRecord,
  processAdminOrder,
  toggleMaintenance,
  updateAdminUser,
} from '../services/dscApi'
import { formatDateTime } from '../utils/format'

function getValue(source, keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) return source[key]
  }
  return '—'
}

export function AdminDashboardPage({ session, systemStatus, onSessionInvalid }) {
  const [revision, setRevision] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('success')
  const [busy, setBusy] = useState(false)

  // Modals state
  const [orderModal, setOrderModal] = useState(null) // { mode: 'approve' | 'reject', orderId: number, username: string }
  const [deleteModal, setDeleteModal] = useState(null) // { label: string, action: () => Promise<void> }
  const [editUser, setEditUser] = useState(null)
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)

  // Form states
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' })

  const { data, error, loading } = useRemoteResource(
    () => getAdminSnapshot(session.token),
    [session?.token, revision],
    { enabled: Boolean(session?.token) },
  )

  useEffect(() => {
    if (isAuthError(error)) onSessionInvalid()
  }, [error, onSessionInvalid])

  const users = data?.users?.status === 'fulfilled' ? mapAdminUsers(data.users.value) : []
  const orders = data?.orders?.status === 'fulfilled' ? mapPendingOrders(data.orders.value) : []
  const settings =
    data?.settings?.status === 'fulfilled' ? mapSettingsRecord(data.settings.value) : {}
  const ownerAccess = data?.ownerAccess?.status === 'fulfilled'

  const isMaintenance = Boolean(
    systemStatus?.isMaintenanceMode ||
    systemStatus?.IsMaintenanceMode ||
    settings?.isMaintenanceMode ||
    settings?.IsMaintenanceMode
  )

  function flashMessage(msg, type = 'success') {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4000)
  }

  async function runAction(action, successMsg) {
    setBusy(true)
    try {
      await action()
      if (successMsg) flashMessage(successMsg, 'success')
      setRevision((v) => v + 1)
    } catch (issue) {
      if (isAuthError(issue)) {
        onSessionInvalid()
      } else {
        flashMessage(extractApiMessage(issue.payload, issue.message || 'Action failed.'), 'error')
      }
    } finally {
      setBusy(false)
    }
  }

  async function handleOrderConfirm() {
    if (!orderModal) return
    const { mode, orderId } = orderModal
    setOrderModal(null)
    await runAction(
      () => processAdminOrder(session.token, orderId, mode),
      `Order #${orderId} ${mode === 'approve' ? 'approved & key issued' : 'rejected'}.`,
    )
  }

  async function handleDeleteConfirm() {
    if (!deleteModal) return
    const action = deleteModal.action
    setDeleteModal(null)
    await runAction(action, 'Deleted successfully.')
  }

  async function handleSaveUser(e) {
    e.preventDefault()
    if (!editUser) return
    const id = editUser?.id ?? editUser?.Id ?? editUser?.userId ?? editUser?.UserId
    await runAction(async () => {
      await updateAdminUser(session.token, {
        userId: Number(id),
        plan: editUser.plan ?? editUser.Plan,
        expiryTime: editUser.expiryTime ?? editUser.ExpiryTime ?? null,
        isBanned: Boolean(editUser.isBanned ?? editUser.IsBanned),
      })
      setEditUser(null)
    }, 'User updated successfully.')
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    await runAction(async () => {
      await changeAdminPassword(session.token, passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ currentPassword: '', newPassword: '' })
      setShowPassModal(false)
    }, 'Admin password updated successfully.')
  }

  async function handleCreateAdmin(e) {
    e.preventDefault()
    await runAction(async () => {
      await createAdminAccount(session.token, newAdmin.username.trim().toLowerCase(), newAdmin.password)
      setNewAdmin({ username: '', password: '' })
      setShowCreateAdmin(false)
    }, 'New admin created successfully.')
  }

  return (
    <div className="center-wrap">
      <section className="panel">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <span className="hero-eyebrow">Control Center</span>
            <h1 className="auth-title mt-6">Admin Dashboard</h1>
            <p className="auth-subtitle mb-0">
              Active admin: <strong style={{ color: 'var(--primary)' }}>{String(session.username || 'admin').toUpperCase()}</strong>
              {ownerAccess ? ' • (Owner Access Verified)' : ''}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <NavLink to="/pages/generatekey" className="button button-primary button-sm">
              Generate Key
            </NavLink>
            {ownerAccess ? (
              <NavLink to="/pages/ownerdb" className="button button-secondary button-sm">
                Owner DB
              </NavLink>
            ) : null}
            {ownerAccess ? (
              <button
                type="button"
                className="button button-secondary button-sm"
                onClick={() => setShowCreateAdmin(true)}
              >
                + Create Admin
              </button>
            ) : null}
            <button
              type="button"
              className="button button-ghost button-sm"
              onClick={() => setShowPassModal(true)}
            >
              Password
            </button>
            <button
              type="button"
              className={`button button-sm ${isMaintenance ? 'button-danger' : 'button-secondary'}`}
              disabled={busy}
              onClick={() =>
                runAction(
                  () => toggleMaintenance(session.token, !isMaintenance),
                  `Maintenance mode ${!isMaintenance ? 'activated' : 'deactivated'}.`,
                )
              }
            >
              Maintenance: {isMaintenance ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              className="button button-secondary button-sm"
              disabled={busy || loading}
              onClick={() => setRevision((v) => v + 1)}
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {message ? (
          <div className={`alert-box mb-20 ${messageType === 'error' ? 'alert-danger' : 'alert-success'}`}>
            <p className={`mb-0 ${messageType === 'error' ? 'text-danger' : 'text-success'}`}>{message}</p>
          </div>
        ) : null}

        {/* Stats Grid */}
        <div className="stats-grid mb-24">
          <div className="stat-card">
            <p className="stat-label">Total Users</p>
            <div className="stat-value text-xl">{users.length}</div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Pending Orders</p>
            <div className={`stat-value text-xl ${orders.length > 0 ? 'text-warning' : 'text-secondary'}`}>
              {orders.length}
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Maintenance</p>
            <div className={`stat-value text-xl ${isMaintenance ? 'text-danger' : 'text-success'}`}>
              {isMaintenance ? 'ACTIVE' : 'NORMAL'}
            </div>
          </div>
          <div className="stat-card">
            <p className="stat-label">Permissions</p>
            <div className="stat-value text-md text-secondary" style={{ fontSize: '1rem', marginTop: '6px' }}>
              {ownerAccess ? 'Full Owner' : 'Standard Admin'}
            </div>
          </div>
        </div>

        {/* Pending Orders Table */}
        <div className="card mb-24" style={{ background: 'var(--surface-strong)', padding: '20px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <span className="micro-label">APPROVAL QUEUE</span>
              <h3 className="mt-4 mb-0">Pending Orders ({orders.length})</h3>
            </div>
          </div>

          <div className="table-wrap">
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
                {orders.map((order, idx) => {
                  const id = order.id ?? order.Id ?? idx + 1
                  const username = getValue(order, ['username', 'Username'])
                  return (
                    <tr key={`order-${id}`}>
                      <td>{id}</td>
                      <td><strong>{username}</strong></td>
                      <td>{getValue(order, ['discordId', 'DiscordId'])}</td>
                      <td><span className="badge warning">{getValue(order, ['plan', 'Plan']).toUpperCase()}</span></td>
                      <td>{getValue(order, ['days', 'Days'])}</td>
                      <td>{getValue(order, ['amount', 'Amount'])}</td>
                      <td><code>{getValue(order, ['txnId', 'TxnId', 'utr', 'UTR'])}</code></td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="button button-primary button-sm"
                            disabled={busy}
                            onClick={() =>
                              setOrderModal({
                                mode: 'approve',
                                orderId: id,
                                username,
                              })
                            }
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="button button-danger button-sm"
                            disabled={busy}
                            onClick={() =>
                              setOrderModal({
                                mode: 'reject',
                                orderId: id,
                                username,
                              })
                            }
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      No pending orders to review.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users Table */}
        <div className="card" style={{ background: 'var(--surface-strong)', padding: '20px', borderRadius: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <span className="micro-label">DATABASE SNAPSHOT</span>
              <h3 className="mt-4 mb-0">Registered Users ({users.length})</h3>
            </div>
          </div>

          <div className="table-wrap">
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
                {users.slice(0, 15).map((user, idx) => {
                  const username = getValue(user, ['username', 'Username'])
                  const id = user.id ?? user.Id ?? user.userId ?? user.UserId ?? idx
                  const isBanned = Boolean(user.isBanned ?? user.IsBanned)
                  const expiry = getValue(user, ['expiry', 'Expiry', 'expiryTime', 'ExpiryTime'])
                  return (
                    <tr key={`user-${id}`}>
                      <td><strong>{username}</strong></td>
                      <td><span className="badge good">{getValue(user, ['plan', 'Plan']).toUpperCase()}</span></td>
                      <td>
                        <span className={`badge ${isBanned ? 'bad' : 'good'}`}>
                          {isBanned ? 'BANNED' : 'ACTIVE'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.9rem' }}>
                        {expiry && expiry !== '—' ? formatDateTime(expiry) : '—'}
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="button button-secondary button-sm"
                            onClick={() => setEditUser({ ...user })}
                          >
                            Edit
                          </button>
                          {ownerAccess ? (
                            <button
                              type="button"
                              className="button button-danger button-sm"
                              disabled={busy}
                              onClick={() =>
                                setDeleteModal({
                                  label: `user "${username}"`,
                                  action: () => deleteAdminUser(session.token, id),
                                })
                              }
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
                      {loading ? 'Loading user data...' : 'No users found.'}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Order Confirmation Modal */}
      {orderModal ? (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <div className={`modal-card modal-card-center ${orderModal.mode === 'approve' ? 'modal-approve-state' : 'modal-reject-state'}`}>
            <div className={`modal-icon-box ${orderModal.mode === 'approve' ? 'icon-approve-state' : 'icon-reject-state'}`}>
              {orderModal.mode === 'approve' ? (
                <svg width="28" height="28" fill="none" stroke="var(--success)" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg width="28" height="28" fill="none" stroke="var(--danger)" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <h2 className={`modal-title modal-title-large ${orderModal.mode === 'approve' ? 'text-approve-state' : 'text-reject-state'}`}>
              {orderModal.mode === 'approve' ? 'Approve Order?' : 'Reject Order?'}
            </h2>

            <p style={{ color: 'var(--muted)', margin: '14px 0 22px' }}>
              Are you sure you want to{' '}
              <strong className={orderModal.mode === 'approve' ? 'text-approve-state' : 'text-reject-state'}>
                {orderModal.mode.toUpperCase()}
              </strong>{' '}
              order #{orderModal.orderId} for user <strong>{orderModal.username}</strong>?
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className={orderModal.mode === 'approve' ? 'button button-success' : 'button button-danger'}
                onClick={handleOrderConfirm}
                disabled={busy}
              >
                {orderModal.mode === 'approve' ? 'Yes, Approve!' : 'Yes, Reject!'}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setOrderModal(null)}
                disabled={busy}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {deleteModal ? (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <div className="modal-card modal-card-center modal-reject-state">
            <div className="modal-icon-box icon-reject-state">
              <svg width="28" height="28" fill="none" stroke="var(--danger)" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="modal-title modal-title-large text-reject-state">Confirm Deletion</h2>
            <p style={{ color: 'var(--muted)', margin: '14px 0 22px' }}>
              Permanently delete {deleteModal.label}? This action cannot be reversed.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="button button-danger"
                onClick={handleDeleteConfirm}
                disabled={busy}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setDeleteModal(null)}
                disabled={busy}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit User Modal */}
      {editUser ? (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <form className="modal-card form-stack" onSubmit={handleSaveUser}>
            <h2>Edit User Account</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Update access parameters for {getValue(editUser, ['username', 'Username'])}.
            </p>

            <label className="field">
              <span>Plan</span>
              <input
                required
                value={editUser.plan ?? editUser.Plan ?? ''}
                onChange={(e) => setEditUser({ ...editUser, plan: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Expiry Date / Time</span>
              <input
                type="datetime-local"
                value={String(editUser.expiryTime ?? editUser.ExpiryTime ?? '').slice(0, 16)}
                onChange={(e) =>
                  setEditUser({
                    ...editUser,
                    expiryTime: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </label>

            <label className="field">
              <span>Account Status</span>
              <select
                value={String(Boolean(editUser.isBanned ?? editUser.IsBanned))}
                onChange={(e) =>
                  setEditUser({ ...editUser, isBanned: e.target.value === 'true' })
                }
              >
                <option value="false">Active</option>
                <option value="true">Banned</option>
              </select>
            </label>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="button button-primary" disabled={busy} type="submit">
                Save Changes
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setEditUser(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Create Admin Modal */}
      {showCreateAdmin ? (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <form className="modal-card form-stack" onSubmit={handleCreateAdmin}>
            <h2>Create New Admin Account</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Authorize a new administrator with control panel privileges.
            </p>

            <label className="field">
              <span>Username</span>
              <input
                required
                autoComplete="username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Password (minimum 6 characters)</span>
              <input
                required
                minLength={6}
                type="password"
                autoComplete="new-password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              />
            </label>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="button button-primary" disabled={busy} type="submit">
                Create Admin
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setShowCreateAdmin(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {/* Change Password Modal */}
      {showPassModal ? (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <form className="modal-card form-stack" onSubmit={handleChangePassword}>
            <h2>Change Admin Password</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
              Update your administrative account credentials.
            </p>

            <label className="field">
              <span>Current Password</span>
              <input
                required
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </label>

            <label className="field">
              <span>New Password (minimum 6 characters)</span>
              <input
                required
                minLength={6}
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </label>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="button button-primary" disabled={busy} type="submit">
                Update Password
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => setShowPassModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
