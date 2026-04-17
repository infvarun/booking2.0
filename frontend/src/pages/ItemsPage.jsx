import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Package, Pencil, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { items as itemsApi } from '../api/client'
import { formatCurrency } from '../utils/helpers'
import ItemModal from '../components/ItemModal'

function ItemCard({ item, onEdit, onDelete }) {
  const isActive = item.status === 'Active' || item.status === 'active'
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-sm hover:shadow-md hover:ring-violet-100 transition-all duration-200 overflow-hidden group">
      <div className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 leading-tight">{item.name}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{item.itemid}</p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ring-1 ${
            isActive
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
              : 'bg-slate-100 text-slate-500 ring-slate-200'
          }`}>
            {isActive
              ? <CheckCircle2 className="w-3 h-3" />
              : <XCircle className="w-3 h-3" />
            }
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3.5 border-t border-slate-50">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-0.5">Unit Price</p>
            <p className="text-xl font-bold text-slate-900 tracking-tight">{formatCurrency(item.price)}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item.itemid)}
              className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ItemsPage() {
  const [itemList, setItemList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setItemList(await itemsApi.getAll())
    } catch {
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (itemid) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    try {
      await itemsApi.remove(itemid)
      toast.success('Item deleted')
      await load()
    } catch {
      toast.error('Failed to delete item')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Items</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? 'Loading…' : `${itemList.length} item${itemList.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowModal(true) }}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98] select-none"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 animate-pulse h-36" />
          ))}
        </div>
      ) : itemList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Package className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-600 font-semibold">No items yet</p>
          <p className="text-slate-400 text-sm mt-1">Add catering and decoration items</p>
          <button
            onClick={() => { setEditingItem(null); setShowModal(true) }}
            className="mt-5 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {itemList.map(item => (
            <ItemCard
              key={item.itemid}
              item={item}
              onEdit={(i) => { setEditingItem(i); setShowModal(true) }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ItemModal
        show={showModal}
        item={editingItem}
        onClose={() => { setShowModal(false); setEditingItem(null) }}
        onSaved={load}
      />
    </div>
  )
}
