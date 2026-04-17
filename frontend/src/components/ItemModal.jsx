import React, { useState, useEffect } from 'react'
import { X, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import { items as itemsApi } from '../api/client'
import { generateId } from '../utils/helpers'

const emptyForm = { name: '', status: 'Active', price: '' }

function Radio({ name, value, checked, onChange, label, activeColor }) {
  return (
    <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
      checked
        ? activeColor || 'border-violet-300 bg-violet-50 text-violet-700 font-medium'
        : 'border-slate-200 text-slate-600 hover:border-slate-300'
    }`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  )
}

export default function ItemModal({ show, item, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const isEditing = !!item

  useEffect(() => {
    if (show) {
      setForm(item
        ? { name: item.name || '', status: item.status || 'Active', price: item.price ?? '' }
        : emptyForm
      )
    }
  }, [show, item])

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name.trim()) { toast.error('Item name is required'); return }
    setSaving(true)
    try {
      const payload = {
        itemid: item?.itemid || generateId('I'),
        name: form.name.trim(),
        price: parseInt(form.price) || 0,
        status: form.status,
      }
      if (isEditing) {
        await itemsApi.update(item.itemid, payload)
        toast.success('Item updated')
      } else {
        await itemsApi.create(payload)
        toast.success('Item created')
      }
      await onSaved()
      onClose()
    } catch {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} item`)
    } finally {
      setSaving(false)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Package className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">{isEditing ? 'Edit Item' : 'Add Item'}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Item Name *</label>
            <input
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              value={form.name} onChange={set('name')} placeholder="e.g. Pillow, Bed Sheet"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <div className="flex gap-2">
              <Radio name="istatus" value="Active" checked={form.status === 'Active'}
                onChange={() => setForm(f => ({ ...f, status: 'Active' }))} label="Active"
                activeColor="border-emerald-300 bg-emerald-50 text-emerald-700 font-medium"
              />
              <Radio name="istatus" value="Inactive" checked={form.status === 'Inactive'}
                onChange={() => setForm(f => ({ ...f, status: 'Inactive' }))} label="Inactive"
                activeColor="border-slate-300 bg-slate-100 text-slate-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Price per unit (₹)</label>
            <input type="number" min="0"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              value={form.price} onChange={set('price')} placeholder="0"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSubmit} disabled={saving}
            className="px-5 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {saving ? 'Saving…' : isEditing ? 'Update Item' : 'Save Item'}
          </button>
        </div>
      </div>
    </div>
  )
}
