import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Building2, Pencil, Trash2, Wind, Thermometer, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { halls as hallsApi } from '../api/client'
import { formatCurrency } from '../utils/helpers'
import HallModal from '../components/HallModal'

const statusStyle = {
  Clean: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Dirty: 'bg-red-50 text-red-600 ring-red-200',
  'Under Repair': 'bg-amber-50 text-amber-700 ring-amber-200',
}

function HallCard({ hall, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-sm hover:shadow-md hover:ring-violet-100 transition-all duration-200 overflow-hidden group">
      <div className="h-1.5 bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 leading-tight">{hall.name}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{hall.hallid}</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ring-1 ${statusStyle[hall.status] || 'bg-slate-100 text-slate-600 ring-slate-200'}`}>
            {hall.status || '—'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium ${
            hall.type === 'AC' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {hall.type === 'AC' ? <Thermometer className="w-3 h-3" /> : <Wind className="w-3 h-3" />}
            {hall.type || 'Non-AC'}
          </span>
          {hall.capacity > 0 && (
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
              <Users className="w-3 h-3" />
              {hall.capacity} guests
            </span>
          )}
        </div>

        {hall.description && (
          <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">{hall.description}</p>
        )}

        <div className="flex items-center justify-between pt-3.5 border-t border-slate-50">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-0.5">Price</p>
            <p className="text-xl font-bold text-slate-900 tracking-tight">{formatCurrency(hall.price)}</p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(hall)}
              className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(hall.hallid)}
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

export default function HallsPage() {
  const [hallList, setHallList] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingHall, setEditingHall] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setHallList(await hallsApi.getAll())
    } catch {
      toast.error('Failed to load halls')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (hallid) => {
    if (!window.confirm('Delete this hall? This cannot be undone.')) return
    try {
      await hallsApi.remove(hallid)
      toast.success('Hall deleted')
      await load()
    } catch {
      toast.error('Failed to delete hall')
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Halls</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? 'Loading…' : `${hallList.length} venue${hallList.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => { setEditingHall(null); setShowModal(true) }}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02] active:scale-[0.98] select-none"
        >
          <Plus className="w-4 h-4" />
          Add Hall
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 animate-pulse h-44" />
          ))}
        </div>
      ) : hallList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-600 font-semibold">No halls yet</p>
          <p className="text-slate-400 text-sm mt-1">Add your first venue hall to get started</p>
          <button
            onClick={() => { setEditingHall(null); setShowModal(true) }}
            className="mt-5 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Add Hall
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {hallList.map(hall => (
            <HallCard
              key={hall.hallid}
              hall={hall}
              onEdit={(h) => { setEditingHall(h); setShowModal(true) }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <HallModal
        show={showModal}
        hall={editingHall}
        onClose={() => { setShowModal(false); setEditingHall(null) }}
        onSaved={load}
      />
    </div>
  )
}
