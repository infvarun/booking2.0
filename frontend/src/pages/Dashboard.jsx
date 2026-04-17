import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Search, TrendingUp, Calendar, IndianRupee, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import { bookings as bookingsApi } from '../api/client'
import { formatCurrency } from '../utils/helpers'
import BookingCard from '../components/BookingCard'
import BookingModal from '../components/BookingModal'

function StatCard({ title, value, icon: Icon, color, sub }) {
  const palette = {
    violet: 'bg-violet-50 text-violet-600 ring-violet-100',
    emerald: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    blue: 'bg-blue-50 text-blue-600 ring-blue-100',
    amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  }
  return (
    <div className="bg-white rounded-2xl p-5 ring-1 ring-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <div className={`w-9 h-9 rounded-xl ring-2 flex items-center justify-center flex-shrink-0 ${palette[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 bg-slate-100 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 w-32 bg-slate-100 rounded-lg mb-2" />
          <div className="h-3 w-24 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-5 w-14 bg-slate-100 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-slate-100 rounded-lg" />
        <div className="h-3 w-3/4 bg-slate-100 rounded-lg" />
        <div className="h-3 w-1/2 bg-slate-100 rounded-lg" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-50">
        <div className="h-5 w-20 bg-slate-100 rounded-lg" />
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => <div key={i} className="w-8 h-8 bg-slate-100 rounded-lg" />)}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [bookingList, setBookingList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)

  const loadBookings = useCallback(async () => {
    setLoading(true)
    try {
      setBookingList(await bookingsApi.getAll())
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadBookings() }, [loadBookings])

  const handleDelete = async (bookingid) => {
    if (!window.confirm('Delete this booking? This cannot be undone.')) return
    try {
      await bookingsApi.remove(bookingid)
      toast.success('Booking deleted')
      await loadBookings()
    } catch {
      toast.error('Failed to delete booking')
    }
  }

  const stats = {
    total: bookingList.length,
    revenue: bookingList.reduce((s, b) => s + (b.total || 0), 0),
    collected: bookingList.reduce((s, b) => s + (b.paid || 0), 0),
    pending: bookingList.filter(b => (b.paid || 0) < (b.total || 0)).length,
  }

  const filtered = bookingList.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      b.customer?.toLowerCase().includes(q) ||
      b.bookingid?.toLowerCase().includes(q) ||
      b.phone?.includes(q)
    const matchFilter =
      filter === 'all' ||
      (filter === 'paid' && (b.paid || 0) >= (b.total || 0)) ||
      (filter === 'partial' && (b.paid || 0) < (b.total || 0))
    return matchSearch && matchFilter
  })

  return (
    <div className="p-6 lg:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Bookings</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {loading ? 'Loading…' : `${bookingList.length} reservation${bookingList.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => { setEditingBooking(null); setShowModal(true) }}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-violet-200 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] select-none"
        >
          <Plus className="w-4 h-4" />
          New Booking
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Bookings" value={stats.total} icon={Calendar} color="violet" />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.revenue)}
          icon={IndianRupee}
          color="emerald"
        />
        <StatCard
          title="Collected"
          value={formatCurrency(stats.collected)}
          icon={TrendingUp}
          color="blue"
          sub={stats.revenue > 0 ? `${Math.round((stats.collected / stats.revenue) * 100)}% of revenue` : undefined}
        />
        <StatCard
          title="With Balance"
          value={stats.pending}
          icon={Clock}
          color="amber"
          sub="bookings pending full payment"
        />
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customer, ID or phone…"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white ring-1 ring-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 self-start">
          {[['all', 'All'], ['paid', 'Paid'], ['partial', 'Partial']].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                filter === val
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
            <Calendar className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-600 font-semibold text-base">
            {search || filter !== 'all' ? 'No results found' : 'No bookings yet'}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            {search ? 'Try a different search term' : filter !== 'all' ? 'Try a different filter' : 'Create your first booking to get started'}
          </p>
          {!search && filter === 'all' && (
            <button
              onClick={() => { setEditingBooking(null); setShowModal(true) }}
              className="mt-5 inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-violet-200 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              New Booking
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(b => (
            <BookingCard
              key={b.bookingid}
              booking={b}
              onDelete={handleDelete}
              onEdit={(booking) => { setEditingBooking(booking); setShowModal(true) }}
            />
          ))}
        </div>
      )}

      <BookingModal
        show={showModal}
        booking={editingBooking}
        onClose={() => { setShowModal(false); setEditingBooking(null) }}
        onSaved={loadBookings}
      />
    </div>
  )
}
