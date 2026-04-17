import React, { useState, useEffect, useCallback } from 'react'
import { bookings as bookingsApi } from '../api/client'
import BookingCard from '../components/BookingCard'
import HallModal from '../components/HallModal'
import ItemModal from '../components/ItemModal'
import BookingModal from '../components/BookingModal'

export default function Dashboard() {
  const [bookingList, setBookingList] = useState([])
  const [loading, setLoading] = useState(true)
  const [showHallModal, setShowHallModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState(null)

  const loadBookings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await bookingsApi.getAll()
      setBookingList(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadBookings() }, [loadBookings])

  const handleDelete = async (bookingid) => {
    if (!window.confirm('Delete this booking?')) return
    await bookingsApi.remove(bookingid)
    await loadBookings()
  }

  const handleEdit = (booking) => {
    setEditingBooking(booking)
    setShowBookingModal(true)
  }

  const openNewBooking = () => {
    setEditingBooking(null)
    setShowBookingModal(true)
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0 fw-bold">Deo Vihar — Bookings</h4>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => setShowHallModal(true)}>
            + Hall
          </button>
          <button className="btn btn-outline-secondary" onClick={() => setShowItemModal(true)}>
            + Item
          </button>
          <button className="btn btn-primary" onClick={openNewBooking}>
            + Booking
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : bookingList.length === 0 ? (
        <p className="text-muted text-center py-5">No bookings yet. Create one to get started.</p>
      ) : (
        <div className="row g-3">
          {bookingList.map(b => (
            <div key={b.bookingid} className="col-12 col-md-6 col-xl-4">
              <BookingCard booking={b} onDelete={handleDelete} onEdit={handleEdit} />
            </div>
          ))}
        </div>
      )}

      <HallModal show={showHallModal} onClose={() => setShowHallModal(false)} />
      <ItemModal show={showItemModal} onClose={() => setShowItemModal(false)} />
      <BookingModal
        show={showBookingModal}
        booking={editingBooking}
        onClose={() => { setShowBookingModal(false); setEditingBooking(null) }}
        onSaved={loadBookings}
      />
    </div>
  )
}
