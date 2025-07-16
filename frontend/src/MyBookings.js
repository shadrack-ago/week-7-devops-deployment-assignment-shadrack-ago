import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function MyBookings({ token }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/bookings`, {
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
      <h2 className="text-xl font-bold mb-4">My Bookings</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : bookings.length === 0 ? (
        <div>You have no bookings yet.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="border rounded p-4 bg-white shadow-sm">
              <div className="font-semibold text-blue-700">{booking.train?.name || 'Train'}</div>
              <div className="text-sm text-gray-600">{booking.train?.source} → {booking.train?.destination}</div>
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