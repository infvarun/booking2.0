import React, { useState } from 'react'
import { halls as hallsApi } from '../api/client'
import { generateId } from '../utils/helpers'

const initial = { name: '', status: 'Clean', type: 'AC', description: '', price: '', capacity: '' }

export default function HallModal({ show, onClose }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  const setField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const setRadio = (field) => (val) => setForm(f => ({ ...f, [field]: val }))

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Hall name is required'); return }
    setSaving(true)
    setError('')
    try {
      await hallsApi.create({
        hallid: generateId('H'),
        name: form.name.trim(),
        status: form.status,
        type: form.type,
        description: form.description,
        price: parseInt(form.price) || 0,
        capacity: parseInt(form.capacity) || 0,
      })
      setSuccess(true)
    } catch {
      setError('Failed to save hall. Check that the API is running.')
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
            <h5 className="modal-title">Add Hall</h5>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>
          <div className="modal-body">
            {success ? (
              <div className="alert alert-success mb-0">Hall created successfully!</div>
            ) : (
              <>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                  <label className="form-label">Hall Name *</label>
                  <input className="form-control" value={form.name} onChange={setField('name')} autoFocus />
                </div>
                <div className="mb-3">
                  <label className="form-label d-block">Status</label>
                  <div className="d-flex gap-3">
                    {['Clean', 'Dirty', 'Under Repair'].map(s => (
                      <div key={s} className="form-check">
                        <input
                          className="form-check-input" type="radio" name="hallStatus"
                          id={`hs-${s}`} checked={form.status === s}
                          onChange={() => setRadio('status')(s)}
                        />
                        <label className="form-check-label" htmlFor={`hs-${s}`}>{s}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label d-block">Cooling</label>
                  <div className="d-flex gap-3">
                    {['AC', 'Non-AC'].map(t => (
                      <div key={t} className="form-check">
                        <input
                          className="form-check-input" type="radio" name="hallType"
                          id={`ht-${t}`} checked={form.type === t}
                          onChange={() => setRadio('type')(t)}
                        />
                        <label className="form-check-label" htmlFor={`ht-${t}`}>{t}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label className="form-label">Price (₹)</label>
                    <input type="number" className="form-control" value={form.price} onChange={setField('price')} min="0" />
                  </div>
                  <div className="col">
                    <label className="form-label">Capacity</label>
                    <input type="number" className="form-control" value={form.capacity} onChange={setField('capacity')} min="0" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input className="form-control" value={form.description} onChange={setField('description')} />
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
                  {saving ? 'Saving…' : 'Save Hall'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
