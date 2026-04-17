import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { parseItems, parseHall, formatCurrency } from '../utils/helpers'

export default function Invoice() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const booking = state?.booking

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <p className="text-muted">
          No invoice data.{' '}
          <button className="btn btn-link p-0" onClick={() => navigate('/')}>
            Go back to dashboard
          </button>
        </p>
      </div>
    )
  }

  const parsedItems = parseItems(booking.allItems)
  const hall = parseHall(booking.allHall)
  const subTotal = (hall?.price || 0) + parsedItems.reduce((s, i) => s + i.total, 0)
  const balanceDue = subTotal + (booking.gst || 0) + (booking.service_tax || 0) + (booking.damage || 0) - (booking.paid || 0)
  const isPaid = (booking.paid || 0) >= (booking.total || 0)

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="container py-4" style={{ maxWidth: 820 }}>
      <div className="d-print-none mb-3 d-flex gap-2">
        <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>← Back</button>
        <button className="btn btn-primary" onClick={() => window.print()}>Print Invoice</button>
      </div>

      <div className="border rounded p-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h5 className="mb-1 fw-bold">Deo Vihar Pvt Ltd</h5>
            <div className="text-muted small">Bazaar Samiti Delhi</div>
            <div className="text-muted small">navin@deovihar.com | +91 9306769990</div>
          </div>
          <div className="text-end">
            <div><strong>Invoice #:</strong> {booking.invoice_num || '—'}</div>
            <div><strong>GST #:</strong> {booking.gst_num || '—'}</div>
            <div><strong>From:</strong> {fmtDate(booking.fromdate)}</div>
            <div><strong>To:</strong> {fmtDate(booking.todate)}</div>
            <span className={`badge mt-1 ${isPaid ? 'bg-success' : 'bg-warning text-dark'}`}>
              {isPaid ? 'PAID' : 'PARTIAL'}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <h6 className="text-muted text-uppercase small mb-2">Bill To</h6>
          <div className="fw-semibold">{booking.customer}</div>
          {booking.address && <div className="text-muted small">{booking.address}</div>}
          {booking.email && <div className="text-muted small">{booking.email}</div>}
          {booking.phone && <div className="text-muted small">{booking.phone}</div>}
          {booking.numberOfPpl > 0 && <div className="text-muted small">Guests: {booking.numberOfPpl}</div>}
        </div>

        <table className="table table-bordered mb-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Description</th>
              <th className="text-end">Unit Price</th>
              <th className="text-end">Qty</th>
              <th className="text-end">Amount</th>
            </tr>
          </thead>
          <tbody>
            {hall && (
              <tr>
                <td>1</td>
                <td>{hall.name} <span className="text-muted">(Hall)</span></td>
                <td className="text-end">{formatCurrency(hall.price)}</td>
                <td className="text-end">1</td>
                <td className="text-end">{formatCurrency(hall.price)}</td>
              </tr>
            )}
            {parsedItems.map((item, i) => (
              <tr key={i}>
                <td>{(hall ? 2 : 1) + i}</td>
                <td>{item.name}</td>
                <td className="text-end">{formatCurrency(item.unitPrice)}</td>
                <td className="text-end">{item.qty}</td>
                <td className="text-end">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-end">
          <table className="table table-sm" style={{ width: 320 }}>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td className="text-end">{formatCurrency(subTotal)}</td>
              </tr>
              {booking.damage > 0 && (
                <tr>
                  <td>Damage</td>
                  <td className="text-end">{formatCurrency(booking.damage)}</td>
                </tr>
              )}
              {booking.gst > 0 && (
                <tr>
                  <td>GST</td>
                  <td className="text-end">{formatCurrency(booking.gst)}</td>
                </tr>
              )}
              {booking.service_tax > 0 && (
                <tr>
                  <td>Service Tax</td>
                  <td className="text-end">{formatCurrency(booking.service_tax)}</td>
                </tr>
              )}
              <tr className="fw-bold">
                <td>Total</td>
                <td className="text-end">{formatCurrency(booking.total)}</td>
              </tr>
              <tr>
                <td>Paid</td>
                <td className="text-end">{formatCurrency(booking.paid)}</td>
              </tr>
              <tr className="table-warning fw-bold">
                <td>Balance Due</td>
                <td className="text-end">{formatCurrency(balanceDue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
