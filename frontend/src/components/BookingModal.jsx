import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { halls as hallsApi, items as itemsApi, bookings as bookingsApi } from '../api/client'
import { generateId, toSQLDatetime, formatCurrency, parseItems, parseHall } from '../utils/helpers'

const emptyForm = () => ({
  invoice_num: '', gst_num: '', numberOfPpl: '',
  cust_name: '', cust_addr: '', mobile: '', email: '',
  startDate: null, endDate: null,
  selectedHallId: '',
  itemRows: [],
  damage: 0, gst: 0, service_tax: 0, paid: 0,
})

export default function BookingModal({ show, booking, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm())
  const [halls, setHalls] = useState([])
  const [availableItems, setAvailableItems] = useState([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const isEditing = !!booking

  useEffect(() => {
    if (!show) return
    hallsApi.getAll().then(setHalls).catch(() => {})
    itemsApi.getAll().then(data => setAvailableItems(data.filter(i =>
      i.status === 'Active' || i.status === 'active'
    ))).catch(() => {})
  }, [show])

  useEffect(() => {
    if (!show) return
    if (booking) {
      const parsedItems = parseItems(booking.allItems)
      const hall = parseHall(booking.allHall)
      setForm({
        invoice_num: booking.invoice_num || '',
        gst_num: booking.gst_num || '',
        numberOfPpl: booking.numberOfPpl || '',
        cust_name: booking.customer || '',
        cust_addr: booking.address || '',
        mobile: booking.phone || '',
        email: booking.email || '',
        startDate: booking.fromdate ? new Date(booking.fromdate) : null,
        endDate: booking.todate ? new Date(booking.todate) : null,
        selectedHallId: '',
        _hallName: hall?.name,
        itemRows: parsedItems.map(i => ({ name: i.name, unitPrice: i.unitPrice, qty: i.qty })),
        damage: booking.damage || 0,
        gst: booking.gst || 0,
        service_tax: booking.service_tax || 0,
        paid: booking.paid || 0,
      })
    } else {
      setForm(emptyForm())
    }
  }, [show, booking])

  // Match hall name to hallid once halls are loaded (edit mode)
  useEffect(() => {
    if (form._hallName && halls.length > 0) {
      const matched = halls.find(h => h.name === form._hallName)
      if (matched) setForm(f => ({ ...f, selectedHallId: matched.hallid, _hallName: undefined }))
    }
  }, [halls, form._hallName])

  const setField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  const setDate = (field) => (date) => setForm(f => ({ ...f, [field]: date }))
  const setNum = (field) => (e) => setForm(f => ({ ...f, [field]: parseInt(e.target.value) || 0 }))

  const hallObj = halls.find(h => h.hallid === form.selectedHallId)
  const hallPrice = hallObj?.price || 0
  const itemsSubTotal = form.itemRows.reduce((s, r) => s + (r.qty * r.unitPrice), 0)
  const subTotal = hallPrice + itemsSubTotal
  const total = subTotal + Number(form.damage) + Number(form.gst) + Number(form.service_tax)
  const due = total - Number(form.paid)

  const addItemRow = () =>
    setForm(f => ({ ...f, itemRows: [...f.itemRows, { name: '', unitPrice: 0, qty: 1 }] }))

  const removeItemRow = (idx) =>
    setForm(f => ({ ...f, itemRows: f.itemRows.filter((_, i) => i !== idx) }))

  const updateItemRow = (idx, field, value) => {
    setForm(f => {
      const rows = [...f.itemRows]
      rows[idx] = { ...rows[idx], [field]: value }
      if (field === 'name') {
        const found = availableItems.find(i => i.name === value)
        if (found) rows[idx].unitPrice = found.price || 0
      }
      return { ...f, itemRows: rows }
    })
  }

  const handleSubmit = async () => {
    if (!form.cust_name.trim()) { setError('Customer name is required'); return }
    setSaving(true)
    setError('')

    const allItems = form.itemRows
      .filter(r => r.name && r.qty > 0)
      .map(r => `${r.name}:${r.qty}:${r.unitPrice}`)
      .join(',')

    const allHall = hallObj ? `${hallObj.name}:${hallPrice}` : ''

    const payload = {
      bookingid: booking?.bookingid || generateId('B'),
      fromdate: toSQLDatetime(form.startDate),
      todate: toSQLDatetime(form.endDate),
      customer: form.cust_name.trim(),
      phone: form.mobile,
      address: form.cust_addr,
      email: form.email,
      numberOfPpl: parseInt(form.numberOfPpl) || 0,
      allItems,
      allHall,
      damage: Number(form.damage),
      gst: Number(form.gst),
      service_tax: Number(form.service_tax),
      total,
      paid: Number(form.paid),
      invoice_num: form.invoice_num,
      gst_num: form.gst_num,
    }

    try {
      if (isEditing) {
        await bookingsApi.update(booking.bookingid, payload)
      } else {
        await bookingsApi.create(payload)
      }
      await onSaved()
      handleClose()
    } catch {
      setError('Failed to save booking. Check that the API is running.')
    } finally {
      setSaving(false)
    }
  }

  const handleClose = () => {
    setForm(emptyForm())
    setError('')
    onClose()
  }

  if (!show) return null

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{isEditing ? 'Edit Booking' : 'New Booking'}</h5>
            <button type="button" className="btn-close" onClick={handleClose} />
          </div>

          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Invoice #</label>
                <input className="form-control" value={form.invoice_num} onChange={setField('invoice_num')} />
              </div>
              <div className="col-md-4">
                <label className="form-label">GST #</label>
                <input className="form-control" value={form.gst_num} onChange={setField('gst_num')} />
              </div>
              <div className="col-md-4">
                <label className="form-label">No. of People</label>
                <input type="number" className="form-control" value={form.numberOfPpl} onChange={setField('numberOfPpl')} min="0" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Customer Name *</label>
              <input className="form-control" value={form.cust_name} onChange={setField('cust_name')} autoFocus={!isEditing} />
            </div>

            <div className="mb-3">
              <label className="form-label">Hall</label>
              <select className="form-select" value={form.selectedHallId} onChange={setField('selectedHallId')}>
                <option value="">— Select Hall —</option>
                {halls.map(h => (
                  <option key={h.hallid} value={h.hallid}>
                    {h.name} — {formatCurrency(h.price)} ({h.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label d-block">From Date</label>
                <DatePicker
                  className="form-control"
                  selected={form.startDate}
                  onChange={setDate('startDate')}
                  selectsStart
                  startDate={form.startDate}
                  endDate={form.endDate}
                  minDate={new Date()}
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="Select start date"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label d-block">To Date</label>
                <DatePicker
                  className="form-control"
                  selected={form.endDate}
                  onChange={setDate('endDate')}
                  selectsEnd
                  startDate={form.startDate}
                  endDate={form.endDate}
                  minDate={form.startDate || new Date()}
                  dateFormat="dd-MMM-yyyy"
                  placeholderText="Select end date"
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0">Items</label>
                <button className="btn btn-sm btn-outline-primary" onClick={addItemRow}>+ Add Item</button>
              </div>
              {form.itemRows.length > 0 && (
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Item</th>
                      <th style={{ width: 80 }}>Qty</th>
                      <th style={{ width: 110 }}>Unit Price</th>
                      <th style={{ width: 100 }}>Total</th>
                      <th style={{ width: 40 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {form.itemRows.map((row, i) => (
                      <tr key={i}>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            value={row.name}
                            onChange={e => updateItemRow(i, 'name', e.target.value)}
                          >
                            <option value="">— Select —</option>
                            {availableItems.map(it => (
                              <option key={it.itemid} value={it.name}>{it.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number" className="form-control form-control-sm" min="1"
                            value={row.qty}
                            onChange={e => updateItemRow(i, 'qty', parseInt(e.target.value) || 1)}
                          />
                        </td>
                        <td>
                          <input
                            type="number" className="form-control form-control-sm" min="0"
                            value={row.unitPrice}
                            onChange={e => updateItemRow(i, 'unitPrice', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="text-end">{formatCurrency(row.qty * row.unitPrice)}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => removeItemRow(i)}>×</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label">Damage (₹)</label>
                <input type="number" className="form-control" value={form.damage} onChange={setNum('damage')} min="0" />
              </div>
              <div className="col-md-4">
                <label className="form-label">GST (₹)</label>
                <input type="number" className="form-control" value={form.gst} onChange={setNum('gst')} min="0" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Service Tax (₹)</label>
                <input type="number" className="form-control" value={form.service_tax} onChange={setNum('service_tax')} min="0" />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Address</label>
              <input className="form-control" value={form.cust_addr} onChange={setField('cust_addr')} />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.mobile} onChange={setField('mobile')} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={form.email} onChange={setField('email')} />
              </div>
            </div>

            <div className="card bg-light border-0">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Total Bill</label>
                    <input className="form-control fw-bold" readOnly value={formatCurrency(total)} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Amount Paid (₹)</label>
                    <input type="number" className="form-control" value={form.paid} onChange={setNum('paid')} min="0" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Balance Due</label>
                    <input className={`form-control fw-bold ${due > 0 ? 'text-danger' : 'text-success'}`} readOnly value={formatCurrency(due)} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving…' : isEditing ? 'Update Booking' : 'Save Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
