import React, { useState, useEffect } from 'react'
import { X, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { halls as hallsApi } from '../api/client'
import { generateId } from '../utils/helpers'

const emptyForm = { name: '', status: 'Clean', type: 'AC', description: '', price: '', capacity: '' }

function Radio({ name, value, checked, onChange, label }) {
  return (
    <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
      checked ? 'border-violet-300 bg-violet-50 text-violet-700 font-medium' : 'border-slate-200 text-slate-600 hover:border-slate-300'
    }`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  )
}

export default function HallModal({ show, hall, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const isEditing = !!hall

  useEffect(() => {
    if (show) {
      setForm(hall
        ? { name: hall.name || '', status: hall.status || 'Clean', type: hall.type || 'AC', description: hall.description || '', price: hall.price ?? '', capacity: hall.capacity ?? '' }
        : emptyForm
      )
    }
  }, [show, hall])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('Hall name is required'); return }
    setSaving(true)
    try {
      const payload = {
        hallid: hall?.hallid || generateId('H'),
        name: form.name.trim(),
        status: form.status,
        type: form.type,
        description: form.description,
        price: parseInt(form.price) || 0,
        capacity: parseInt(form.capacity) || 0,
      }
      if (isEditing) {
        await hallsApi.update(hall.hallid, payload)
        toast.success('Hall updated')
      } else {
        await hallsApi.create(payload)
        toast.success('Hall created')
      }
      await onSaved()
      onClose()
    } catch {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} hall`)
    } finally {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
              <Building2 className="w-4 h-4 text-violet-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">{isEditing ? 'Edit Hall' : 'Add Hall'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Hall Name *</label>
            <input
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              value={form.name} onChange={set('name')} placeholder="e.g. Grand Banquet Hall"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {['Clean', 'Dirty', 'Under Repair'].map(s => (
                <Radio key={s} name="status" value={s} checked={form.status === s}
                  onChange={() => setForm(f => ({ ...f, status: s }))} label={s} />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Cooling</label>
            <div className="flex gap-2">
              {['AC', 'Non-AC'].map(t => (
                <Radio key={t} name="type" value={t} checked={form.type === t}
                  onChange={() => setForm(f => ({ ...f, type: t }))} label={t} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (₹)</label>
              <input type="number" min="0"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                value={form.price} onChange={set('price')} placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacity</label>
              <input type="number" min="0"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                value={form.capacity} onChange={set('capacity')} placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <input
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              value={form.description} onChange={set('description')} placeholder="Optional details…"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit} disabled={saving}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {saving ? 'Saving…' : isEditing ? 'Update Hall' : 'Save Hall'}
          </button>
        </div>
      </div>
    </div>
  )
}
