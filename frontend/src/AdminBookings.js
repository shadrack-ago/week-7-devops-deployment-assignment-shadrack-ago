import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminBookings({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/bookings/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load bookings');
        setLoading(false);
      });
  }, [token]);

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">All Bookings</h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div>No bookings found.</div>
      ) : (
        <div className="space-y-3">
          {bookings.map(booking => (
            <div key={booking._id} className="border rounded p-3 bg-white shadow-sm">
              <div className="font-semibold text-blue-700">{booking.train?.name || 'Train'}</div>
              <div className="text-sm text-gray-600">{booking.train?.source} → {booking.train?.destination}</div>
              <div className="text-xs text-gray-400">User: {booking.user?.email || booking.user}</div>
              <div className="text-xs text-gray-400">Departure: {booking.train ? new Date(booking.train.departureTime).toLocaleString() : ''}</div>
              <div className="text-xs text-gray-400">Seats Booked: {booking.seats}</div>
              <div className="text-xs text-gray-400">Booked At: {new Date(booking.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 