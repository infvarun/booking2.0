import React, { useState } from 'react'
import { items as itemsApi } from '../api/client'
import { generateId } from '../utils/helpers'

const initial = { name: '', status: 'Active', price: '' }

export default function ItemModal({ show, onClose }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const setField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Item name is required'); return }
    setSaving(true)
    setError('')
    try {
      await itemsApi.create({
        itemid: generateId('I'),
        name: form.name.trim(),
        price: parseInt(form.price) || 0,
        status: form.status,
      })
      setSuccess(true)
    } catch {
      setError('Failed to save item. Check that the API is running.')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setForm(initial)
    setSuccess(false)
    setError('')
    onClose()
  }

  if (!show) return null

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Item</h5>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>
          <div className="modal-body">
            {success ? (
              <div className="alert alert-success mb-0">Item created successfully!</div>
            ) : (
              <>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Item Name *</label>
                  <input className="form-control" value={form.name} onChange={setField('name')} autoFocus />
                </div>
                <div className="mb-3">
                  <label className="form-label d-block">Status</label>
                  <div className="d-flex gap-3">
                    {['Active', 'Inactive'].map(s => (
                      <div key={s} className="form-check">
                        <input
                          className="form-check-input" type="radio" name="itemStatus"
                          id={`is-${s}`} checked={form.status === s}
                          onChange={() => setForm(f => ({ ...f, status: s }))}
                        />
                        <label className="form-check-label" htmlFor={`is-${s}`}>{s}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Price per unit (₹)</label>
                  <input type="number" className="form-control" value={form.price} onChange={setField('price')} min="0" />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            {success ? (
              <button className="btn btn-primary" onClick={handleClose}>Close</button>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Item'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
