import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Pencil, Trash2, Building2, Calendar, Users, Phone } from 'lucide-react'
import { formatCurrency, parseHall } from '../utils/helpers'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function BookingCard({ booking, onDelete, onEdit }) {
  const navigate = useNavigate()
  const isPaid = (booking.paid || 0) >= (booking.total || 0)
  const hall = parseHall(booking.allHall)
  const initials = (booking.customer || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const due = (booking.total || 0) - (booking.paid || 0)

  return (
    <div className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-sm hover:shadow-lg hover:ring-violet-100 transition-all duration-200 overflow-hidden group">
      {/* Status bar */}
      <div className={`h-1 ${isPaid ? 'bg-emerald-400' : 'bg-amber-400'}`} />

      <div className="p-5">
        {/* Customer row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-700 flex items-center justify-center text-sm font-bold flex-shrink-0 select-none">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{booking.customer}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{booking.bookingid}</p>
            </div>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-2 ${
            isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {isPaid ? 'Paid' : 'Partial'}
          </span>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {hall && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{hall.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>{fmtDate(booking.fromdate)} → {fmtDate(booking.todate)}</span>
          </div>
          {booking.numberOfPpl > 0 && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{booking.numberOfPpl} guests</span>
            </div>
          )}
          {booking.phone && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{booking.phone}</span>
            </div>
          )}
        </div>

        {/* Financials + actions */}
        <div className="flex items-end justify-between pt-3.5 border-t border-slate-50">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold text-slate-900 tracking-tight">{formatCurrency(booking.total)}</p>
              {!isPaid && (
                <p className="text-xs text-amber-600 font-medium">{formatCurrency(due)} due</p>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{formatCurrency(booking.paid)} paid</p>
          </div>

          <div className="flex gap-0.5">
            <button
              onClick={() => navigate('/invoice', { state: { booking } })}
              className="w-8 h-8 rounded-lg hover:bg-violet-50 flex items-center justify-center text-slate-400 hover:text-violet-600 transition-colors"
              title="View Invoice"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(booking)}
              className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(booking.bookingid)}
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
