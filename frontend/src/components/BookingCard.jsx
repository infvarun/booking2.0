import React from 'react'
import { useNavigate } from 'react-router-dom'
import { formatCurrency, parseHall } from '../utils/helpers'

export default function BookingCard({ booking, onDelete, onEdit }) {
  const navigate = useNavigate()

  const hall = parseHall(booking.allHall)
  const isPaid = (booking.paid || 0) >= (booking.total || 0)
  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-semibold">{booking.customer}</span>
        <span className={`badge ${isPaid ? 'bg-success' : 'bg-warning text-dark'}`}>
          {isPaid ? 'Paid' : 'Partial'}
        </span>
      </div>
      <div className="card-body">
        <p className="mb-1 text-muted small font-monospace">{booking.bookingid}</p>
        <p className="mb-1"><strong>Hall:</strong> {hall?.name || '—'}</p>
        <p className="mb-1">
          <strong>Dates:</strong> {fmtDate(booking.fromdate)} → {fmtDate(booking.todate)}
        </p>
        {booking.phone && <p className="mb-1"><strong>Phone:</strong> {booking.phone}</p>}
        <p className="mb-0">
          <strong>Total:</strong> {formatCurrency(booking.total)}{' '}
          <span className="text-muted">|</span>{' '}
          <strong>Paid:</strong> {formatCurrency(booking.paid)}
        </p>
      </div>
      <div className="card-footer d-flex gap-2">
        <button
          className="btn btn-sm btn-outline-primary flex-fill"
          onClick={() => navigate('/invoice', { state: { booking } })}
        >
          Invoice
        </button>
        <button className="btn btn-sm btn-outline-secondary flex-fill" onClick={() => onEdit(booking)}>
          Edit
        </button>
        <button
          className="btn btn-sm btn-outline-danger flex-fill"
          onClick={() => onDelete(booking.bookingid)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
