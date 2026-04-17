import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import { X, Plus, Trash2, CalendarDays, Building2, Package, User, CreditCard, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'
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

function Section({ icon: Icon, title, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
          <Icon className="w-3.5 h-3.5 text-violet-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label}{required && <span className="text-rose-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all placeholder:text-slate-400"

export default function BookingModal({ show, booking, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm())
  const [halls, setHalls] = useState([])
  const [availableItems, setAvailableItems] = useState([])
  const [saving, setSaving] = useState(false)
  const isEditing = !!booking

  useEffect(() => {
    if (!show) return
    hallsApi.getAll().then(setHalls).catch(() => toast.error('Could not load halls'))
    itemsApi.getAll().then(data =>
      setAvailableItems(data.filter(i => i.status === 'Active' || i.status === 'active'))
    ).catch(() => toast.error('Could not load items'))
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

  useEffect(() => {
    if (form._hallName && halls.length > 0) {
      const matched = halls.find(h => h.name === form._hallName)
      if (matched) setForm(f => ({ ...f, selectedHallId: matched.hallid, _hallName: undefined }))
    }
  }, [halls, form._hallName])

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }))
  const setDate = (f) => (d) => setForm(p => ({ ...p, [f]: d }))
  const setN = (f) => (e) => setForm(p => ({ ...p, [f]: parseInt(e.target.value) || 0 }))

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
    if (!form.cust_name.trim()) { toast.error('Customer name is required'); return }
    setSaving(true)

    const allItems = form.itemRows
      .filter(r => r.name && r.qty > 0)
      .map(r => `${r.name}:${r.qty}:${r.unitPrice}`)
      .join(',')

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
      allHall: hallObj ? `${hallObj.name}:${hallPrice}` : '',
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
        toast.success('Booking updated')
      } else {
        await bookingsApi.create(payload)
        toast.success('Booking created')
      }
      await onSaved()
      onClose()
    } catch {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} booking`)
    } finally {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:rounded-2xl shadow-2xl sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-t-3xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{isEditing ? 'Edit Booking' : 'New Booking'}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{isEditing ? `Editing ${booking.bookingid}` : 'Fill in the details below'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto scrollbar-thin flex-1 p-6 space-y-6">

          {/* Reference */}
          <Section icon={CreditCard} title="Reference">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Invoice #">
                <input className={inputCls} value={form.invoice_num} onChange={set('invoice_num')} placeholder="INV-001" />
              </Field>
              <Field label="GST #">
                <input className={inputCls} value={form.gst_num} onChange={set('gst_num')} placeholder="GSTIN" />
              </Field>
              <Field label="No. of People">
                <input type="number" min="0" className={inputCls} value={form.numberOfPpl} onChange={set('numberOfPpl')} placeholder="0" />
              </Field>
            </div>
          </Section>

          <div className="border-t border-slate-100" />

          {/* Customer */}
          <Section icon={User} title="Customer">
            <div className="space-y-3">
              <Field label="Full Name" required>
                <input className={inputCls} value={form.cust_name} onChange={set('cust_name')} placeholder="Customer full name" autoFocus={!isEditing} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Phone">
                  <input className={inputCls} value={form.mobile} onChange={set('mobile')} placeholder="+91 00000 00000" />
                </Field>
                <Field label="Email">
                  <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="name@example.com" />
                </Field>
              </div>
              <Field label="Address">
                <input className={inputCls} value={form.cust_addr} onChange={set('cust_addr')} placeholder="Full address" />
              </Field>
            </div>
          </Section>

          <div className="border-t border-slate-100" />

          {/* Event */}
          <Section icon={CalendarDays} title="Event Details">
            <div className="space-y-3">
              <Field label="Hall">
                <select className={inputCls} value={form.selectedHallId} onChange={set('selectedHallId')}>
                  <option value="">— Select a hall —</option>
                  {halls.map(h => (
                    <option key={h.hallid} value={h.hallid}>
                      {h.name} · {formatCurrency(h.price)} ({h.type})
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="From Date">
                  <DatePicker
                    className={inputCls}
                    selected={form.startDate}
                    onChange={setDate('startDate')}
                    selectsStart startDate={form.startDate} endDate={form.endDate}
                    minDate={new Date()} dateFormat="dd-MMM-yyyy"
                    placeholderText="Select start date"
                  />
                </Field>
                <Field label="To Date">
                  <DatePicker
                    className={inputCls}
                    selected={form.endDate}
                    onChange={setDate('endDate')}
                    selectsEnd startDate={form.startDate} endDate={form.endDate}
                    minDate={form.startDate || new Date()} dateFormat="dd-MMM-yyyy"
                    placeholderText="Select end date"
                  />
                </Field>
              </div>
            </div>
          </Section>

          <div className="border-t border-slate-100" />

          {/* Items */}
          <Section icon={Package} title="Items">
            {form.itemRows.length > 0 && (
              <div className="mb-3 rounded-xl overflow-hidden ring-1 ring-slate-100">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500">
                      <th className="text-left px-3 py-2 font-medium">Item</th>
                      <th className="text-right px-3 py-2 font-medium w-16">Qty</th>
                      <th className="text-right px-3 py-2 font-medium w-24">Unit Price</th>
                      <th className="text-right px-3 py-2 font-medium w-24">Total</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {form.itemRows.map((row, i) => (
                      <tr key={i} className="bg-white">
                        <td className="px-3 py-2">
                          <select
                            className="w-full text-xs bg-transparent focus:outline-none text-slate-700"
                            value={row.name}
                            onChange={e => updateItemRow(i, 'name', e.target.value)}
                          >
                            <option value="">— Select —</option>
                            {availableItems.map(it => (
                              <option key={it.itemid} value={it.name}>{it.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min="1"
                            className="w-full text-xs text-right bg-transparent focus:outline-none focus:bg-slate-50 rounded px-1 text-slate-700"
                            value={row.qty}
                            onChange={e => updateItemRow(i, 'qty', parseInt(e.target.value) || 1)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min="0"
                            className="w-full text-xs text-right bg-transparent focus:outline-none focus:bg-slate-50 rounded px-1 text-slate-700"
                            value={row.unitPrice}
                            onChange={e => updateItemRow(i, 'unitPrice', parseInt(e.target.value) || 0)}
                          />
                        </td>
                        <td className="px-3 py-2 text-right font-medium text-slate-700">
                          {formatCurrency(row.qty * row.unitPrice)}
                        </td>
                        <td className="pr-2 py-2">
                          <button onClick={() => removeItemRow(i)}
                            className="w-6 h-6 rounded hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              onClick={addItemRow}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add item row
            </button>
          </Section>

          <div className="border-t border-slate-100" />

          {/* Charges */}
          <Section icon={IndianRupee} title="Additional Charges">
            <div className="grid grid-cols-3 gap-3">
              <Field label="Damage (₹)">
                <input type="number" min="0" className={inputCls} value={form.damage} onChange={setN('damage')} placeholder="0" />
              </Field>
              <Field label="GST (₹)">
                <input type="number" min="0" className={inputCls} value={form.gst} onChange={setN('gst')} placeholder="0" />
              </Field>
              <Field label="Service Tax (₹)">
                <input type="number" min="0" className={inputCls} value={form.service_tax} onChange={setN('service_tax')} placeholder="0" />
              </Field>
            </div>
          </Section>

          {/* Payment summary */}
          <div className="bg-slate-900 rounded-2xl p-5 text-white">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Total Bill</p>
                <p className="text-3xl font-bold tracking-tight">{formatCurrency(total)}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs uppercase tracking-wide font-medium mb-1">Balance Due</p>
                <p className={`text-xl font-bold ${due > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {formatCurrency(due)}
                </p>
              </div>
            </div>
            <div className="space-y-2 mb-4 text-xs text-slate-400">
              {hallObj && (
                <div className="flex justify-between">
                  <span>Hall ({hallObj.name})</span>
                  <span className="text-slate-300">{formatCurrency(hallPrice)}</span>
                </div>
              )}
              {itemsSubTotal > 0 && (
                <div className="flex justify-between">
                  <span>Items subtotal</span>
                  <span className="text-slate-300">{formatCurrency(itemsSubTotal)}</span>
                </div>
              )}
              {Number(form.damage) > 0 && <div className="flex justify-between"><span>Damage</span><span className="text-slate-300">{formatCurrency(Number(form.damage))}</span></div>}
              {Number(form.gst) > 0 && <div className="flex justify-between"><span>GST</span><span className="text-slate-300">{formatCurrency(Number(form.gst))}</span></div>}
              {Number(form.service_tax) > 0 && <div className="flex justify-between"><span>Service Tax</span><span className="text-slate-300">{formatCurrency(Number(form.service_tax))}</span></div>}
            </div>
            <div className="border-t border-slate-700 pt-4">
              <label className="block text-xs text-slate-400 font-medium mb-2">Amount Paid (₹)</label>
              <input
                type="number" min="0"
                className="w-full px-3 py-2.5 text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all placeholder:text-slate-500"
                value={form.paid}
                onChange={setN('paid')}
                placeholder="0"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white flex-shrink-0">
          <p className="text-xs text-slate-400">
            {form.cust_name ? `Booking for ${form.cust_name}` : 'Fill required fields to continue'}
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit} disabled={saving}
              className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {saving ? 'Saving…' : isEditing ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
