import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  deleteOwnerRecord,
  extractApiMessage,
  getOwnerTable,
  isAuthError,
  mapSettingsRecord,
  toggleMaintenance,
  updateOwnerRecord,
} from '../services/dscApi'
import {
  normalizeCollection,
  toDatetimeLocal,
  toIsoOrNullFromDatetimeLocal,
} from '../utils/format'

const TABLES = [
  ['users', 'Users'],
  ['settings', 'System Settings'],
  ['freeSettings', 'Free Panel Settings'],
  ['freeusers', 'Free Users'],
  ['panelUpdates', 'Updates'],
  ['keys', 'Register Keys'],
  ['orders', 'Orders'],
  ['admins', 'Admin Accounts'],
]

const USER_COLUMN_ORDER = [
  'id',
  'username',
  'plan',
  'keyValue',
  'hwid',
  'isBanned',
  'failedLoginAttempts',
  'lockoutEnd',
  'expiryTime',
  'registrationTime',
  'lastLoginTime',
]

const FREE_USER_COLUMN_ORDER = [
  'id',
  'username',
  'hwid',
  'CaptchaToken',
  'isBanned',
  'failedLoginAttempts',
  'lockoutEnd',
  'firstLoginTime',
  'lastLoginTime',
]

function listFor(table, payload) {
  if (table === 'settings' || table === 'freeSettings' || table === 'panelUpdates') {
    if (table === 'settings' || table === 'freeSettings') return [mapSettingsRecord(payload)]
    const record = payload?.data && !Array.isArray(payload.data) ? payload.data : payload
    return Array.isArray(record) ? record : record && typeof record === 'object' ? [record] : []
  }
  return normalizeCollection(payload, [table, table[0].toUpperCase() + table.slice(1), 'data', 'records', 'Records'])
}

function recordId(row, index) {
  return (
    row?.id ??
    row?.Id ??
    row?.userId ??
    row?.UserId ??
    row?.keyId ??
    row?.KeyId ??
    row?.orderId ??
    row?.OrderId ??
    row?.username ??
    row?.Username ??
    index
  )
}

function sortKeysForTable(table, keys) {
  if (table === 'users') {
    return [...keys].sort((a, b) => {
      const idxA = USER_COLUMN_ORDER.findIndex((k) => k.toLowerCase() === a.toLowerCase())
      const idxB = USER_COLUMN_ORDER.findIndex((k) => k.toLowerCase() === b.toLowerCase())
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB)
    })
  }
  if (table === 'freeusers') {
    return [...keys].sort((a, b) => {
      const idxA = FREE_USER_COLUMN_ORDER.findIndex((k) => k.toLowerCase() === a.toLowerCase())
      const idxB = FREE_USER_COLUMN_ORDER.findIndex((k) => k.toLowerCase() === b.toLowerCase())
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB)
    })
  }
  return keys
}

function renderCellValue(key, val) {
  if (val === true) {
    return <span className="badge good">True</span>
  }
  if (val === false) {
    return <span className="badge bad">False</span>
  }
  const strKey = String(key).toLowerCase()
  if (strKey === 'status') {
    const status = String(val).toLowerCase()
    if (status === 'approved') return <span className="badge good">Approved</span>
    if (status === 'pending') return <span className="badge warning">Pending</span>
    if (status === 'rejected') return <span className="badge bad">Rejected</span>
  }
  if (strKey.includes('time') || strKey.includes('expiry')) {
    if (val && !Number.isNaN(new Date(val).getTime())) {
      return new Date(val).toLocaleString()
    }
  }
  if (val === null || val === undefined || val === '') {
    return '—'
  }
  if (typeof val === 'object') {
    return JSON.stringify(val)
  }
  return String(val)
}

function buildSettingsPayload(current, overrides = {}) {
  return {
    id: current?.id ?? current?.Id ?? 0,
    isMaintenanceMode:
      overrides.isMaintenanceMode ??
      current?.isMaintenanceMode ??
      current?.IsMaintenanceMode ??
      false,
    maintenanceReason:
      overrides.maintenanceReason ??
      current?.maintenanceReason ??
      current?.MaintenanceReason ??
      '',
    maxFreeSlots: Number(
      overrides.maxFreeSlots ?? current?.maxFreeSlots ?? current?.MaxFreeSlots ?? 20,
    ),
    latestVersion:
      overrides.latestVersion ??
      current?.latestVersion ??
      current?.LatestVersion ??
      '1.0',
    updateUrl:
      overrides.updateUrl ?? current?.updateUrl ?? current?.UpdateUrl ?? '',
    showHomeDownloadBtn: Boolean(
      overrides.showHomeDownloadBtn ??
        current?.showHomeDownloadBtn ??
        current?.ShowHomeDownloadBtn ??
        false,
    ),
    freeValidDays: Number(
      overrides.freeValidDays ??
        current?.freeValidDays ??
        current?.FreeValidDays ??
        30,
    ),
    freeUsername:
      overrides.freeUsername ?? current?.freeUsername ?? current?.FreeUsername ?? '',
    freePassword:
      overrides.freePassword ?? current?.freePassword ?? current?.FreePassword ?? '',
    freeLink: overrides.freeLink ?? current?.freeLink ?? current?.FreeLink ?? '',
    streamerLink:
      overrides.streamerLink ?? current?.streamerLink ?? current?.StreamerLink ?? '',
    sniperLink:
      overrides.sniperLink ?? current?.sniperLink ?? current?.SniperLink ?? '',
    specialLink:
      overrides.specialLink ?? current?.specialLink ?? current?.SpecialLink ?? '',
    aimbotLink:
      overrides.aimbotLink ?? current?.aimbotLink ?? current?.AimbotLink ?? '',
    premiumLink:
      overrides.premiumLink ?? current?.premiumLink ?? current?.PremiumLink ?? '',
    customisedLink:
      overrides.customisedLink ??
      current?.customisedLink ??
      current?.CustomisedLink ??
      '',
  }
}

export function AdminWorkspacePage({ session, onSessionInvalid }) {
  const [table, setTable] = useState('users')
  const [records, setRecords] = useState([])
  const [cachedSettings, setCachedSettings] = useState({})
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [editRecord, setEditRecord] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteModal, setDeleteModal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const token = session?.token

  const load = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let ignore = false
    async function fetchData() {
      if (!token) return
      setLoading(true)
      setError('')
      setSelectedIds(new Set())
      try {
        const payload = await getOwnerTable(token, table)
        if (!ignore) {
          const rows = listFor(table, payload)
          setRecords(rows)
          if (table === 'settings' || table === 'freeSettings') {
            setCachedSettings(rows[0] || {})
          }
          setPage(1)
        }
      } catch (issue) {
        if (!ignore) {
          if (isAuthError(issue)) onSessionInvalid()
          else setError(extractApiMessage(issue?.payload, issue?.message || 'Could not load owner records.'))
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => {
      ignore = true
    }
  }, [token, table, reloadKey, onSessionInvalid])

  const filtered = useMemo(() => {
    if (!search.trim()) return records
    const q = search.trim().toLowerCase()
    return records.filter((row) =>
      Object.values(row).some((val) => String(val ?? '').toLowerCase().includes(q)),
    )
  }, [records, search])

  const pageSize = 15
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  const isDeletableTable = ['users', 'keys', 'admins', 'orders', 'freeusers'].includes(table)

  async function run(operation, successMsg) {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await operation()
      if (successMsg) setMessage(successMsg)
      load()
    } catch (issue) {
      if (isAuthError(issue)) onSessionInvalid()
      else setError(extractApiMessage(issue?.payload, issue?.message || 'The request failed.'))
    } finally {
      setBusy(false)
    }
  }

  function handleTableChange(nextTable) {
    setTable(nextTable)
    setSearch('')
    setPage(1)
    setSelectedIds(new Set())
    setEditRecord(null)
    setError('')
    setMessage('')
  }

  function handleSelectAll(e) {
    if (e.target.checked) {
      const next = new Set()
      visible.forEach((row, i) => next.add(recordId(row, i)))
      setSelectedIds(next)
    } else {
      setSelectedIds(new Set())
    }
  }

  function toggleSelectOne(id) {
    const next = new Set(selectedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedIds(next)
  }

  function handleBulkDelete() {
    if (selectedIds.size === 0) return
    const ids = Array.from(selectedIds)
    setDeleteModal({
      label: `${ids.length} selected record(s) from ${table.toUpperCase()}`,
      action: async () => {
        const results = await Promise.allSettled(
          ids.map((id) => deleteOwnerRecord(token, table, id)),
        )
        const failed = results.filter((r) => r.status === 'rejected').length
        setSelectedIds(new Set())
        if (failed > 0) {
          throw new Error(`${failed} record(s) failed to delete.`)
        }
      },
    })
  }

  function confirmDelete(id) {
    setDeleteModal({
      label: `record #${id} from ${table.toUpperCase()}`,
      action: () => deleteOwnerRecord(token, table, id),
    })
  }

  function openEdit(row) {
    setEditRecord(row)
    if (table === 'users') {
      setEditForm({
        plan: row.plan ?? row.Plan ?? '',
        expiryTime: toDatetimeLocal(row.expiryTime ?? row.ExpiryTime ?? ''),
        isBanned: Boolean(row.isBanned ?? row.IsBanned ?? false),
      })
    } else if (table === 'keys') {
      setEditForm({
        plan: row.plan ?? row.Plan ?? '',
        validDays: row.validDays ?? row.ValidDays ?? 0,
        isUsed: Boolean(row.isUsed ?? row.IsUsed ?? false),
      })
    } else if (table === 'admins') {
      setEditForm({
        role: row.role ?? row.Role ?? '',
        isActive: Boolean(row.isActive ?? row.IsActive ?? true),
      })
    } else if (table === 'orders') {
      setEditForm({
        status: row.status ?? row.Status ?? 'Pending',
      })
    } else if (table === 'settings') {
      setEditForm({
        latestVersion: row.latestVersion ?? row.LatestVersion ?? '1.0',
        updateUrl: row.updateUrl ?? row.UpdateUrl ?? '',
        maintenanceReason: row.maintenanceReason ?? row.MaintenanceReason ?? '',
        freeLink: row.freeLink ?? row.FreeLink ?? '',
        streamerLink: row.streamerLink ?? row.StreamerLink ?? '',
        sniperLink: row.sniperLink ?? row.SniperLink ?? '',
        specialLink: row.specialLink ?? row.SpecialLink ?? '',
        aimbotLink: row.aimbotLink ?? row.AimbotLink ?? '',
        premiumLink: row.premiumLink ?? row.PremiumLink ?? '',
        customisedLink: row.customisedLink ?? row.CustomisedLink ?? '',
      })
    } else if (table === 'freeSettings') {
      setEditForm({
        freeUsername: row.freeUsername ?? row.FreeUsername ?? '',
        freePassword: row.freePassword ?? row.FreePassword ?? '',
        freeValidDays: row.freeValidDays ?? row.FreeValidDays ?? 30,
        maxFreeSlots: row.maxFreeSlots ?? row.MaxFreeSlots ?? 20,
        showHomeDownloadBtn: Boolean(
          row.showHomeDownloadBtn ?? row.ShowHomeDownloadBtn ?? false,
        ),
      })
    } else if (table === 'freeusers') {
      setEditForm({
        username: row.username ?? row.Username ?? '',
        hwid: row.hwid ?? row.HWID ?? '',
        captchaToken: row.CaptchaToken ?? row.captchaToken ?? '',
        isBanned: Boolean(row.isBanned ?? row.IsBanned ?? false),
        failedLoginAttempts:
          row.failedLoginAttempts ?? row.FailedLoginAttempts ?? 0,
      })
    } else if (table === 'panelUpdates') {
      setEditForm({
        update1: row.update1 ?? row.Update1 ?? '',
        update2: row.update2 ?? row.Update2 ?? '',
        update3: row.update3 ?? row.Update3 ?? '',
        update4: row.update4 ?? row.Update4 ?? '',
      })
    }
  }

  async function handleSaveEdit(e) {
    e.preventDefault()
    if (!editRecord) return

    const editId =
      editRecord.id ??
      editRecord.Id ??
      editRecord.userId ??
      editRecord.UserId ??
      editRecord.keyId ??
      editRecord.KeyId ??
      editRecord.orderId ??
      editRecord.OrderId ??
      0

    let payload = {}

    if (table === 'users') {
      payload = {
        id: editId,
        userId: editId,
        plan: editForm.plan,
        expiryTime: toIsoOrNullFromDatetimeLocal(editForm.expiryTime),
        isBanned: Boolean(editForm.isBanned),
      }
    } else if (table === 'keys') {
      payload = {
        id: editId,
        userId: editId,
        plan: editForm.plan,
        validDays: Number(editForm.validDays) || 0,
        isUsed: Boolean(editForm.isUsed),
      }
    } else if (table === 'admins') {
      payload = {
        id: editId,
        userId: editId,
        role: editForm.role,
        isActive: Boolean(editForm.isActive),
      }
    } else if (table === 'orders') {
      payload = {
        id: editId,
        userId: editId,
        status: editForm.status || 'Pending',
      }
    } else if (table === 'settings') {
      payload = buildSettingsPayload(cachedSettings, editForm)
    } else if (table === 'freeSettings') {
      payload = buildSettingsPayload(cachedSettings, editForm)
    } else if (table === 'freeusers') {
      payload = {
        id: editId,
        userId: editId,
        Username: editForm.username,
        HWID: editForm.hwid,
        CaptchaToken: editForm.captchaToken,
        IsBanned: Boolean(editForm.isBanned),
        FailedLoginAttempts: Number(editForm.failedLoginAttempts) || 0,
      }
    } else if (table === 'panelUpdates') {
      payload = {
        update1: editForm.update1 || '',
        update2: editForm.update2 || '',
        update3: editForm.update3 || '',
        update4: editForm.update4 || '',
      }
    }

    await run(async () => {
      await updateOwnerRecord(token, table, payload)
      if (table === 'settings' || table === 'freeSettings') {
        setCachedSettings((prev) => ({ ...prev, ...payload }))
      }
      setEditRecord(null)
    }, 'Record updated successfully.')
  }

  async function toggleMaint() {
    const isM = Boolean(cachedSettings?.isMaintenanceMode ?? cachedSettings?.IsMaintenanceMode)
    await run(async () => {
      const res = await toggleMaintenance(token, !isM)
      setCachedSettings((cur) => ({
        ...cur,
        isMaintenanceMode: Boolean(res?.isMaintenanceMode ?? res?.IsMaintenanceMode ?? !isM),
      }))
    }, `Maintenance mode turned ${!isM ? 'ON' : 'OFF'}.`)
  }

  const columns = useMemo(() => {
    if (!records.length) return []
    const uniqueKeys = new Set()
    records.forEach((row) => Object.keys(row).forEach((k) => uniqueKeys.add(k)))
    return sortKeysForTable(table, Array.from(uniqueKeys))
  }, [records, table])

  const editId = editRecord
    ? editRecord.id ??
      editRecord.Id ??
      editRecord.userId ??
      editRecord.UserId ??
      editRecord.keyId ??
      editRecord.KeyId ??
      editRecord.orderId ??
      editRecord.OrderId ??
      0
    : 0

  return (
    <div className="center-wrap">
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <span className="hero-eyebrow">Database Console</span>
            <h1 className="auth-title mt-6">Owner Database Manager</h1>
            <p className="auth-subtitle mb-0">Direct record management for DSC database collections.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={`button button-sm ${cachedSettings?.isMaintenanceMode ? 'button-danger' : 'button-secondary'}`}
              disabled={busy}
              onClick={toggleMaint}
            >
              Maintenance: {cachedSettings?.isMaintenanceMode ? 'ACTIVE' : 'OFF'}
            </button>
            <button
              type="button"
              className="button button-secondary button-sm"
              disabled={loading || busy}
              onClick={load}
            >
              Reload Table
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="field" style={{ margin: 0 }}>
              <span className="micro-label">SELECT TABLE</span>
              <select
                value={table}
                onChange={(e) => handleTableChange(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px' }}
              >
                {TABLES.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field" style={{ margin: 0, minWidth: '220px' }}>
              <span className="micro-label">SEARCH RECORDS</span>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search values..."
                style={{ padding: '8px 12px', borderRadius: '6px' }}
              />
            </label>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {isDeletableTable && selectedIds.size > 0 ? (
              <button
                type="button"
                className="button button-danger button-sm"
                onClick={handleBulkDelete}
                disabled={busy}
              >
                Delete Selected ({selectedIds.size})
              </button>
            ) : null}

            <button
              type="button"
              className="button button-secondary button-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
              Page {page} of {pageCount} ({filtered.length} Total)
            </span>
            <button
              type="button"
              className="button button-secondary button-sm"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {message ? (
          <div className="form-success" style={{ marginBottom: '16px' }}>
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="form-error" style={{ marginBottom: '16px' }}>
            {error}
          </div>
        ) : null}

        {/* Data Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {isDeletableTable ? (
                  <th style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={visible.length > 0 && selectedIds.size === visible.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                ) : null}
                {columns.length > 0 ? (
                  columns.map((key) => <th key={key}>{key.toUpperCase()}</th>)
                ) : (
                  <th>RECORDS</th>
                )}
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                    Loading database records...
                  </td>
                </tr>
              ) : visible.map((row, index) => {
                const id = recordId(row, index)
                const isSelected = selectedIds.has(id)
                return (
                  <tr key={`${id}-${index}`}>
                    {isDeletableTable ? (
                      <td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(id)}
                        />
                      </td>
                    ) : null}
                    {columns.map((k) => (
                      <td key={k} style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {renderCellValue(k, row[k])}
                      </td>
                    ))}
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="button button-secondary button-sm"
                          onClick={() => openEdit(row)}
                        >
                          Edit / Manage
                        </button>
                        {isDeletableTable ? (
                          <button
                            type="button"
                            className="button button-danger button-sm"
                            disabled={busy}
                            onClick={() => confirmDelete(id)}
                          >
                            Delete
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!loading && !visible.length ? (
                <tr>
                  <td colSpan={columns.length + 2} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                    No matching records found in table "{table}".
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Record Modal (Table-Specific Form Controls) */}
      {editRecord ? (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <form className="modal-card form-stack" style={{ maxWidth: '680px' }} onSubmit={handleSaveEdit}>
            <div>
              <span className="micro-label">TABLE: {table.toUpperCase()}</span>
              <h2 className="mt-4 mb-0">
                Edit {TABLES.find(([k]) => k === table)?.[1] || table} {editId ? `(ID: ${editId})` : ''}
              </h2>
            </div>

            {/* USERS FORM */}
            {table === 'users' ? (
              <>
                <div style={{ background: 'var(--surface-hover)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.88rem' }}>
                  <strong>Username:</strong> {editRecord.username ?? editRecord.Username ?? '—'} &nbsp;|&nbsp;{' '}
                  <strong>HWID:</strong> {editRecord.hwid ?? editRecord.HWID ?? '—'}
                </div>

                <label className="field">
                  <span>Plan</span>
                  <input
                    required
                    value={editForm.plan || ''}
                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Expiry Date & Time</span>
                  <input
                    type="datetime-local"
                    value={editForm.expiryTime || ''}
                    onChange={(e) => setEditForm({ ...editForm, expiryTime: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Ban Status</span>
                  <select
                    value={String(Boolean(editForm.isBanned))}
                    onChange={(e) => setEditForm({ ...editForm, isBanned: e.target.value === 'true' })}
                  >
                    <option value="false">Active</option>
                    <option value="true">Banned</option>
                  </select>
                </label>
              </>
            ) : null}

            {/* KEYS FORM */}
            {table === 'keys' ? (
              <>
                <div style={{ background: 'var(--surface-hover)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.88rem' }}>
                  <strong>Key:</strong> <code>{editRecord.keyValue ?? editRecord.KeyValue ?? editRecord.key ?? '—'}</code>
                </div>

                <label className="field">
                  <span>Plan</span>
                  <input
                    required
                    value={editForm.plan || ''}
                    onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Valid Days</span>
                  <input
                    required
                    type="number"
                    min="0"
                    value={editForm.validDays ?? 0}
                    onChange={(e) => setEditForm({ ...editForm, validDays: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Key Used</span>
                  <select
                    value={String(Boolean(editForm.isUsed))}
                    onChange={(e) => setEditForm({ ...editForm, isUsed: e.target.value === 'true' })}
                  >
                    <option value="false">False (Unused)</option>
                    <option value="true">True (Used)</option>
                  </select>
                </label>
              </>
            ) : null}

            {/* ADMINS FORM */}
            {table === 'admins' ? (
              <>
                <div style={{ background: 'var(--surface-hover)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.88rem' }}>
                  <strong>Admin Username:</strong> {editRecord.username ?? editRecord.Username ?? '—'}
                </div>

                <label className="field">
                  <span>Role</span>
                  <input
                    required
                    value={editForm.role || ''}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Is Active</span>
                  <select
                    value={String(Boolean(editForm.isActive))}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                  >
                    <option value="true">True (Active)</option>
                    <option value="false">False (Inactive)</option>
                  </select>
                </label>
              </>
            ) : null}

            {/* ORDERS FORM */}
            {table === 'orders' ? (
              <>
                <div style={{ background: 'var(--surface-hover)', padding: '12px 14px', borderRadius: '8px', fontSize: '0.88rem' }}>
                  <strong>User:</strong> {editRecord.username ?? editRecord.Username ?? '—'} &nbsp;|&nbsp;{' '}
                  <strong>Plan:</strong> {editRecord.plan ?? editRecord.Plan ?? '—'} &nbsp;|&nbsp;{' '}
                  <strong>Amount:</strong> {editRecord.amount ?? editRecord.Amount ?? '—'} &nbsp;|&nbsp;{' '}
                  <strong>Txn ID:</strong> <code>{editRecord.txnId ?? editRecord.TxnId ?? '—'}</code>
                </div>

                <label className="field">
                  <span>Order Status</span>
                  <select
                    value={editForm.status || 'Pending'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </label>
              </>
            ) : null}

            {/* SYSTEM SETTINGS FORM */}
            {table === 'settings' ? (
              <>
                <h4 style={{ margin: '14px 0 6px', borderBottom: '1px solid var(--border)', paddingBottom: '6px', color: 'var(--primary)' }}>
                  System & Maintenance
                </h4>

                <label className="field">
                  <span>Latest Panel Version</span>
                  <input
                    value={editForm.latestVersion || ''}
                    onChange={(e) => setEditForm({ ...editForm, latestVersion: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>App Update URL</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editForm.updateUrl || ''}
                    onChange={(e) => setEditForm({ ...editForm, updateUrl: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Custom Maintenance Reason</span>
                  <textarea
                    rows={2}
                    value={editForm.maintenanceReason || ''}
                    onChange={(e) => setEditForm({ ...editForm, maintenanceReason: e.target.value })}
                  />
                </label>

                <h4 style={{ margin: '18px 0 6px', borderBottom: '1px solid var(--border)', paddingBottom: '6px', color: 'var(--primary)' }}>
                  Panel Download Links
                </h4>

                <label className="field">
                  <span>Free Panel Link</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editForm.freeLink || ''}
                    onChange={(e) => setEditForm({ ...editForm, freeLink: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Streamer Panel Link</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editForm.streamerLink || ''}
                    onChange={(e) => setEditForm({ ...editForm, streamerLink: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Sniper Panel Link</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editForm.sniperLink || ''}
                    onChange={(e) => setEditForm({ ...editForm, sniperLink: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Special Panel Link</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editForm.specialLink || ''}
                    onChange={(e) => setEditForm({ ...editForm, specialLink: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Aimbot Panel Link</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editForm.aimbotLink || ''}
                    onChange={(e) => setEditForm({ ...editForm, aimbotLink: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Premium Panel Link</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editForm.premiumLink || ''}
                    onChange={(e) => setEditForm({ ...editForm, premiumLink: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Customised Panel Link</span>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editForm.customisedLink || ''}
                    onChange={(e) => setEditForm({ ...editForm, customisedLink: e.target.value })}
                  />
                </label>
              </>
            ) : null}

            {/* FREE SETTINGS FORM */}
            {table === 'freeSettings' ? (
              <>
                <h4 style={{ margin: '14px 0 6px', borderBottom: '1px solid var(--border)', paddingBottom: '6px', color: 'var(--success)' }}>
                  Free Panel Configurations
                </h4>

                <label className="field">
                  <span>Global Free Username (Blank = Delete/OFF)</span>
                  <input
                    value={editForm.freeUsername || ''}
                    onChange={(e) => setEditForm({ ...editForm, freeUsername: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Global Free Password</span>
                  <input
                    value={editForm.freePassword || ''}
                    onChange={(e) => setEditForm({ ...editForm, freePassword: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Free User Valid Days</span>
                  <input
                    type="number"
                    min="1"
                    value={editForm.freeValidDays ?? 30}
                    onChange={(e) => setEditForm({ ...editForm, freeValidDays: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Max Free Panel Slots</span>
                  <input
                    type="number"
                    min="1"
                    value={editForm.maxFreeSlots ?? 20}
                    onChange={(e) => setEditForm({ ...editForm, maxFreeSlots: e.target.value })}
                  />
                </label>

                <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(editForm.showHomeDownloadBtn)}
                    onChange={(e) => setEditForm({ ...editForm, showHomeDownloadBtn: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Show Download Button on Home Page</span>
                </label>
              </>
            ) : null}

            {/* FREE USERS FORM */}
            {table === 'freeusers' ? (
              <>
                <label className="field">
                  <span>Username</span>
                  <input
                    required
                    value={editForm.username || ''}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>HWID Lock</span>
                  <input
                    value={editForm.hwid || ''}
                    onChange={(e) => setEditForm({ ...editForm, hwid: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>PC Name / CaptchaToken</span>
                  <input
                    value={editForm.captchaToken || ''}
                    onChange={(e) => setEditForm({ ...editForm, captchaToken: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Ban Status</span>
                  <select
                    value={String(Boolean(editForm.isBanned))}
                    onChange={(e) => setEditForm({ ...editForm, isBanned: e.target.value === 'true' })}
                  >
                    <option value="false">Active</option>
                    <option value="true">Banned</option>
                  </select>
                </label>

                <label className="field">
                  <span>Failed Attempts</span>
                  <input
                    type="number"
                    min="0"
                    value={editForm.failedLoginAttempts ?? 0}
                    onChange={(e) => setEditForm({ ...editForm, failedLoginAttempts: e.target.value })}
                  />
                </label>
              </>
            ) : null}

            {/* PANEL UPDATES FORM */}
            {table === 'panelUpdates' ? (
              <>
                <h4 style={{ margin: '14px 0 6px', borderBottom: '1px solid var(--border)', paddingBottom: '6px', color: 'var(--primary)' }}>
                  Update Panel Status
                </h4>

                <label className="field">
                  <span>Aimbot Status</span>
                  <input
                    value={editForm.update1 || ''}
                    onChange={(e) => setEditForm({ ...editForm, update1: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Sniper Status</span>
                  <input
                    value={editForm.update2 || ''}
                    onChange={(e) => setEditForm({ ...editForm, update2: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>Bypass Status</span>
                  <input
                    value={editForm.update3 || ''}
                    onChange={(e) => setEditForm({ ...editForm, update3: e.target.value })}
                  />
                </label>

                <label className="field">
                  <span>General Status</span>
                  <input
                    value={editForm.update4 || ''}
                    onChange={(e) => setEditForm({ ...editForm, update4: e.target.value })}
                  />
                </label>
              </>
            ) : null}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="button button-primary" disabled={busy} type="submit">
                {busy ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="button button-secondary" type="button" onClick={() => setEditRecord(null)}>
                Cancel
              </button>
            </div>

            {/* Optional Delete Button inside edit modal for deletable tables */}
            {isDeletableTable ? (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="button button-danger button-full"
                  disabled={busy}
                  onClick={() => {
                    const id = editId
                    setEditRecord(null)
                    confirmDelete(id)
                  }}
                >
                  Permanently Delete Record
                </button>
              </div>
            ) : null}
          </form>
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
              Permanently delete {deleteModal.label}? This database operation cannot be reversed.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="button button-danger"
                disabled={busy}
                onClick={async () => {
                  const action = deleteModal.action
                  setDeleteModal(null)
                  await run(action, 'Deleted successfully.')
                }}
              >
                Yes, Delete
              </button>
              <button
                type="button"
                className="button button-secondary"
                disabled={busy}
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
