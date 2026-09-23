import { useCallback, useEffect, useMemo, useState } from 'react'
import { deleteOwnerRecord, extractApiMessage, getOwnerTable, isAuthError, mapSettingsRecord, toggleMaintenance, updateOwnerRecord } from '../services/dscApi'
import { normalizeCollection } from '../utils/format'

const tables = [
  ['users', 'Users'], ['settings', 'System Settings'], ['freeSettings', 'Free Panel Settings'],
  ['freeusers', 'Free Users'], ['panelUpdates', 'Updates'], ['keys', 'Register Keys'],
  ['orders', 'Orders'], ['admins', 'Admin Accounts'],
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
  const [edit, setEdit] = useState(null)
  const [json, setJson] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const payload = await getOwnerTable(session.token, table)
      const rows = listFor(table, payload)
      setRecords(rows)
      if (table === 'settings' || table === 'freeSettings') setSettings(rows[0] || {})
      setPage(1)
    } catch (issue) {
      if (isAuthError(issue)) onSessionInvalid()
      else setError(extractApiMessage(issue.payload, issue.message || 'Could not load owner records.'))
    } finally { setLoading(false) }
  }, [session?.token, table, onSessionInvalid])

  useEffect(() => { load() }, [table, session?.token])

  const filtered = useMemo(() => records.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [records, search])
  const pageCount = Math.max(1, Math.ceil(filtered.length / 15))
  const visible = filtered.slice((page - 1) * 15, page * 15)

  async function run(operation, success) {
    setBusy(true); setError(''); setMessage('')
    try { await operation(); setMessage(success); await load() }
    catch (issue) {
      if (isAuthError(issue)) onSessionInvalid()
      else setError(extractApiMessage(issue.payload, issue.message || 'The request failed.'))
    } finally { setBusy(false) }
  }

  function openEdit(row) { setEdit(row); setJson(JSON.stringify(row, null, 2)) }

  async function save(event) {
    event.preventDefault()
    let updated
    try { updated = JSON.parse(json) }
    catch { setError('Enter a valid JSON object.'); return }
    if (!updated || Array.isArray(updated) || typeof updated !== 'object') { setError('Record must be a JSON object.'); return }
    if (table === 'users') updated.userId = Number(edit.id ?? edit.Id ?? edit.userId ?? edit.UserId)
    if (table === 'settings' || table === 'freeSettings') {
      updated = { ...updated, id: Number(updated.id ?? updated.Id ?? 0) }
    }
    await run(async () => { await updateOwnerRecord(session.token, table, updated); setEdit(null) }, 'Record updated successfully.')
  }

  async function remove(row) {
    const id = recordId(row, 0)
    if (!window.confirm(`Permanently delete record ${id} from ${table}? This cannot be undone.`)) return
    await run(() => deleteOwnerRecord(session.token, table, id), 'Record deleted successfully.')
  }

  async function maintenance() {
    const enabled = Boolean(settings?.isMaintenanceMode ?? settings?.IsMaintenanceMode)
    await run(async () => {
      const result = await toggleMaintenance(session.token, !enabled)
      setSettings((current) => ({ ...current, isMaintenanceMode: Boolean(result?.isMaintenanceMode ?? result?.IsMaintenanceMode ?? !enabled) }))
    }, `Maintenance ${enabled ? 'disabled' : 'enabled'}.`)
  }

  return <section className="dashboard-shell">
    <section className="panel panel-danger">
      <div className="panel-header"><div><span className="hero-eyebrow">Owner Database</span><h1>Owner Workspace</h1></div><button className="button button-secondary" type="button" disabled={busy} onClick={maintenance}>Maintenance: {(settings?.isMaintenanceMode ?? settings?.IsMaintenanceMode) ? 'ON' : 'OFF'}</button></div>
      <div className="panel-header">
        <label className="field"><span>Database table</span><select value={table} onChange={(event) => setTable(event.target.value)}>{tables.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label className="field"><span>Search records</span><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search username, HWID, plan..." /></label>
        <div className="hero-actions"><button className="button button-secondary" type="button" onClick={() => load()} disabled={loading || busy}>Refresh</button><button className="button button-secondary" type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Prev</button><span>Page {page} of {pageCount}</span><button className="button button-secondary" type="button" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next</button></div>
      </div>
      <p className="muted">Owner access only. Changes are sent to the existing DSC API.</p>
      {message ? <p className="form-success" role="status">{message}</p> : null}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <div className="table-wrap"><table><thead><tr>{visible[0] ? Object.keys(visible[0]).map((key) => <th key={key}>{key}</th>) : <th>Records</th>}<th>Actions</th></tr></thead><tbody>
        {loading ? <tr><td colSpan="20">Loading records...</td></tr> : visible.map((row, index) => <tr key={`${recordId(row, index)}-${index}`}>{Object.entries(row).map(([key, value]) => <td key={key}>{typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? '—')}</td>)}<td className="row-actions"><button className="button button-secondary" type="button" onClick={() => openEdit(row)}>Edit</button>{['users', 'keys', 'admins', 'orders', 'freeusers'].includes(table) ? <button className="button button-secondary" type="button" disabled={busy} onClick={() => remove(row)}>Delete</button> : null}</td></tr>)}
        {!loading && !visible.length ? <tr><td colSpan="20">No matching records.</td></tr> : null}
      </tbody></table></div>
    </section>
    {edit ? <div className="modal-overlay open" role="dialog" aria-modal="true"><form className="modal-card form-stack" onSubmit={save}><h2>Edit {table} record</h2><p>Keep the API field names and submit a JSON object. Use care with database values.</p><label className="field"><span>Record data</span><textarea className="json-editor" rows="18" spellCheck="false" value={json} onChange={(event) => setJson(event.target.value)} /></label><div className="hero-actions"><button className="button button-primary" disabled={busy} type="submit">Save Database Changes</button><button className="button button-secondary" type="button" onClick={() => setEdit(null)}>Cancel</button></div></form></div> : null}
  </section>
}
