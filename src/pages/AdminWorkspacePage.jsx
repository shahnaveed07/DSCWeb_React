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
import { normalizeCollection } from '../utils/format'

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

function listFor(table, payload) {
  if (table === 'settings' || table === 'freeSettings' || table === 'panelUpdates') {
    if (table === 'settings' || table === 'freeSettings') return [mapSettingsRecord(payload)]
    const record = payload?.data && !Array.isArray(payload.data) ? payload.data : payload
    return Array.isArray(record) ? record : record && typeof record === 'object' ? [record] : []
  }
  return normalizeCollection(payload, [table, table[0].toUpperCase() + table.slice(1), 'data', 'records', 'Records'])
}

function recordId(row, index) {
  return row?.id ?? row?.Id ?? row?.userId ?? row?.UserId ?? row?.keyId ?? row?.KeyId ?? row?.username ?? row?.Username ?? index
}

export function AdminWorkspacePage({ session, onSessionInvalid }) {
  const [table, setTable] = useState('users')
  const [records, setRecords] = useState([])
  const [settings, setSettings] = useState(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [editRecord, setEditRecord] = useState(null)
  const [editJson, setEditJson] = useState('')
  const [deleteModal, setDeleteModal] = useState(null) // { label, action }
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    setSelectedIds(new Set())
    try {
      const payload = await getOwnerTable(session.token, table)
      const rows = listFor(table, payload)
      setRecords(rows)
      if (table === 'settings' || table === 'freeSettings') setSettings(rows[0] || {})
      setPage(1)
    } catch (issue) {
      if (isAuthError(issue)) onSessionInvalid()
      else setError(extractApiMessage(issue.payload, issue.message || 'Could not load owner records.'))
    } finally {
      setLoading(false)
    }
  }, [session?.token, table, onSessionInvalid])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    return records.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()))
  }, [records, search])

  const pageSize = 15
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize)

  async function run(operation, successMsg) {
    setBusy(true)
    setError('')
    setMessage('')
    try {
      await operation()
      if (successMsg) setMessage(successMsg)
      await load()
    } catch (issue) {
      if (isAuthError(issue)) onSessionInvalid()
      else setError(extractApiMessage(issue.payload, issue.message || 'The request failed.'))
    } finally {
      setBusy(false)
    }
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

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return
    setDeleteModal({
      label: `${selectedIds.size} selected record(s)`,
      action: async () => {
        for (const id of selectedIds) {
          try {
            await deleteOwnerRecord(session.token, table, id)
          } catch {
            // continue
          }
        }
      },
    })
  }

  function openEdit(row) {
    setEditRecord(row)
    setEditJson(JSON.stringify(row, null, 2))
  }

  async function saveEdit(e) {
    e.preventDefault()
    let updated
    try {
      updated = JSON.parse(editJson)
    } catch {
      setError('Please provide a valid JSON object.')
      return
    }

    if (!updated || Array.isArray(updated) || typeof updated !== 'object') {
      setError('Record must be a JSON object.')
      return
    }

    if (table === 'users') {
      updated.userId = Number(editRecord.id ?? editRecord.Id ?? editRecord.userId ?? editRecord.UserId)
    }
    if (table === 'settings' || table === 'freeSettings') {
      updated = { ...updated, id: Number(updated.id ?? updated.Id ?? 0) }
    }

    await run(async () => {
      await updateOwnerRecord(session.token, table, updated)
      setEditRecord(null)
    }, 'Record updated successfully.')
  }

  async function toggleMaint() {
    const isM = Boolean(settings?.isMaintenanceMode ?? settings?.IsMaintenanceMode)
    await run(async () => {
      const res = await toggleMaintenance(session.token, !isM)
      setSettings((cur) => ({
        ...cur,
        isMaintenanceMode: Boolean(res?.isMaintenanceMode ?? res?.IsMaintenanceMode ?? !isM),
      }))
    }, `Maintenance mode turned ${!isM ? 'ON' : 'OFF'}.`)
  }

  const isDeletableTable = ['users', 'keys', 'admins', 'orders', 'freeusers'].includes(table)

  return (
    <div className="center-wrap" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <section className="panel" style={{ padding: '28px', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
          <div>
            <span className="hero-eyebrow">Database Console</span>
            <h1 className="auth-title mt-6">Owner Database Manager</h1>
            <p className="auth-subtitle mb-0">Direct low-level management for DSC database collections.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className={`btn btn-sm ${settings?.isMaintenanceMode ? 'btn-danger' : 'btn-secondary'}`}
              disabled={busy}
              onClick={toggleMaint}
            >
              Maintenance: {settings?.isMaintenanceMode ? 'ACTIVE' : 'OFF'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={loading || busy}
              onClick={load}
            >
              Reload Table
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="field" style={{ margin: 0 }}>
              <span className="micro-label">SELECT TABLE</span>
              <select
                value={table}
                onChange={(e) => setTable(e.target.value)}
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
                className="btn btn-danger btn-sm"
                onClick={handleBulkDelete}
                disabled={busy}
              >
                Delete Selected ({selectedIds.size})
              </button>
            ) : null}

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </button>
            <span style={{ fontSize: '0.88rem', color: 'var(--muted)' }}>
              Page {page} of {pageCount} ({filtered.length} items)
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page >= pageCount}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>

        {message ? (
          <div className="alert-box alert-success mb-16">
            <p className="mb-0 text-success">{message}</p>
          </div>
        ) : null}

        {error ? (
          <div className="alert-box alert-danger mb-16">
            <p className="mb-0 text-danger">{error}</p>
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
                {visible[0] ? (
                  Object.keys(visible[0]).map((key) => <th key={key}>{key}</th>)
                ) : (
                  <th>Records</th>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={20} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
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
                    {Object.entries(row).map(([k, val]) => (
                      <td key={k} style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val ?? '—')}
                      </td>
                    ))}
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEdit(row)}
                        >
                          Edit
                        </button>
                        {isDeletableTable ? (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            disabled={busy}
                            onClick={() =>
                              setDeleteModal({
                                label: `record #${id} from ${table}`,
                                action: () => deleteOwnerRecord(session.token, table, id),
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
              {!loading && !visible.length ? (
                <tr>
                  <td colSpan={20} style={{ textAlign: 'center', padding: '30px', color: 'var(--muted)' }}>
                    No matching records found in table "{table}".
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Record Modal */}
      {editRecord ? (
        <div className="modal-overlay open" role="dialog" aria-modal="true">
          <form className="modal-card form-stack" style={{ maxWidth: '650px' }} onSubmit={saveEdit}>
            <h2>Edit {table} Record</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
              Ensure field types and names match the backend database schema.
            </p>

            <label className="field">
              <span>Record JSON</span>
              <textarea
                className="json-editor"
                rows={16}
                spellCheck={false}
                value={editJson}
                onChange={(e) => setEditJson(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.88rem', padding: '12px' }}
              />
            </label>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button className="btn btn-primary" disabled={busy} type="submit">
                Save Database Changes
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setEditRecord(null)}>
                Cancel
              </button>
            </div>
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
              Permanently delete {deleteModal.label}? This database operation is irreversible.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-danger"
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
                className="btn btn-secondary"
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
