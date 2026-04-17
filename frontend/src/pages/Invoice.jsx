import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, CheckCircle, AlertCircle, Building2, Calendar, Users, Hash } from 'lucide-react'
import { parseItems, parseHall, formatCurrency } from '../utils/helpers'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Invoice() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const booking = state?.booking

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-700 font-semibold">No invoice data</p>
          <button onClick={() => navigate('/')} className="mt-4 text-violet-600 hover:text-violet-800 text-sm font-medium transition-colors">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const parsedItems = parseItems(booking.allItems)
  const hall = parseHall(booking.allHall)
  const subTotal = (hall?.price || 0) + parsedItems.reduce((s, i) => s + i.total, 0)
  const grandTotal = booking.total || 0
  const balanceDue = grandTotal - (booking.paid || 0)
  const isPaid = balanceDue <= 0

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      {/* Actions bar — hidden on print */}
      <div className="d-print-none print:hidden bg-slate-900 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-[1.02]"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      {/* Invoice document */}
      <div className="max-w-3xl mx-auto my-8 print:my-0 bg-white shadow-xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden">

        {/* Colour bar */}
        <div className="h-2 bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600" />

        <div className="p-10 print:p-8">
          {/* Company + Invoice header */}
          <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg leading-tight">Deo Vihar Pvt Ltd</p>
                  <p className="text-slate-500 text-xs">Bazaar Samiti Delhi</p>
                </div>
              </div>
              <div className="text-xs text-slate-500 space-y-0.5 ml-0.5">
                <p>navin@deovihar.com</p>
                <p>+91 9306769990</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-4xl font-black text-slate-100 tracking-tight mb-2">INVOICE</p>
              <div className="space-y-1 text-sm">
                {booking.invoice_num && (
                  <div className="flex items-center justify-end gap-2 text-slate-600">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold">{booking.invoice_num}</span>
                  </div>
                )}
                {booking.gst_num && (
                  <p className="text-slate-400 text-xs">GST: {booking.gst_num}</p>
                )}
                <div className="mt-2">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {isPaid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {isPaid ? 'PAID IN FULL' : 'PAYMENT PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-3">Bill To</p>
              <p className="font-bold text-slate-900 text-base">{booking.customer}</p>
              {booking.address && <p className="text-slate-500 text-sm mt-1">{booking.address}</p>}
              {booking.email && <p className="text-slate-500 text-sm">{booking.email}</p>}
              {booking.phone && <p className="text-slate-500 text-sm">{booking.phone}</p>}
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-3">Event Details</p>
              <div className="space-y-1.5 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{fmtDate(booking.fromdate)}</span>
                  <span className="text-slate-300">→</span>
                  <span>{fmtDate(booking.todate)}</span>
                </div>
                {hall && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hall.name}</span>
                  </div>
                )}
                {booking.numberOfPpl > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{booking.numberOfPpl} guests</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Line items */}
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b-2 border-slate-900">
                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">#</th>
                <th className="text-left pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
                <th className="text-right pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Unit Price</th>
                <th className="text-right pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Qty</th>
                <th className="text-right pb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hall && (
                <tr>
                  <td className="py-3 text-sm text-slate-400">1</td>
                  <td className="py-3">
                    <p className="text-sm font-medium text-slate-900">{hall.name}</p>
                    <p className="text-xs text-slate-400">Venue Hall</p>
                  </td>
                  <td className="py-3 text-right text-sm text-slate-600">{formatCurrency(hall.price)}</td>
                  <td className="py-3 text-right text-sm text-slate-600">1</td>
                  <td className="py-3 text-right text-sm font-semibold text-slate-900">{formatCurrency(hall.price)}</td>
                </tr>
              )}
              {parsedItems.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 text-sm text-slate-400">{(hall ? 2 : 1) + i}</td>
                  <td className="py-3 text-sm font-medium text-slate-900">{item.name}</td>
                  <td className="py-3 text-right text-sm text-slate-600">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 text-right text-sm text-slate-600">{item.qty}</td>
                  <td className="py-3 text-right text-sm font-semibold text-slate-900">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subTotal)}</span>
              </div>
              {booking.damage > 0 && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Damage charges</span>
                  <span>{formatCurrency(booking.damage)}</span>
                </div>
              )}
              {booking.gst > 0 && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>GST</span>
                  <span>{formatCurrency(booking.gst)}</span>
                </div>
              )}
              {booking.service_tax > 0 && (
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Service Tax</span>
                  <span>{formatCurrency(booking.service_tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t-2 border-slate-900">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Amount Paid</span>
                <span className="text-emerald-600 font-medium">{formatCurrency(booking.paid)}</span>
              </div>
              <div className={`flex justify-between text-base font-bold pt-2 border-t border-slate-200 ${
                isPaid ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                <span>Balance Due</span>
                <span>{formatCurrency(balanceDue)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start gap-4 text-xs text-slate-400">
            <div>
              <p className="font-semibold text-slate-600 mb-1">Thank you for your business!</p>
              <p>Deo Vihar Pvt Ltd · Bazaar Samiti Delhi</p>
            </div>
            <div className="text-right">
              <p>Booking ID: <span className="font-mono text-slate-500">{booking.bookingid}</span></p>
              <p className="mt-0.5">Generated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
