import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function TrainList({ token }) {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [seats, setSeats] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/trains`)
      .then(res => res.json())
      .then(data => {
        setTrains(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load trains');
        setLoading(false);
      });
  }, []);

  const openBooking = (train) => {
    setSelectedTrain(train);
    setSeats(1);
    setBookingError('');
    setBookingSuccess('');
  };

  const closeBooking = () => {
    setSelectedTrain(null);
    setBookingError('');
    setBookingSuccess('');
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trainId: selectedTrain._id, seats }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBookingError(data.message || 'Booking failed');
      } else {
        setBookingSuccess('Booking successful!');
        // Update train seats locally
        setTrains(trains => trains.map(t => t._id === selectedTrain._id ? { ...t, seatsAvailable: t.seatsAvailable - seats } : t));
        setTimeout(() => {
          closeBooking();
        }, 1200);
      }
    } catch {
      setBookingError('Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Available Trains</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : trains.length === 0 ? (
        <div>No trains available.</div>
      ) : (
        <div className="space-y-4">
          {trains.map(train => (
            <div key={train._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white shadow-sm">
              <div>
                <div className="font-semibold text-blue-700">{train.name}</div>
                <div className="text-sm text-gray-600">{train.source} → {train.destination}</div>
                <div className="text-xs text-gray-400">Departure: {new Date(train.departureTime).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Seats: {train.seatsAvailable} | Price: ${train.price}</div>
              </div>
              <button
                className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm font-medium transition"
                onClick={() => openBooking(train)}
                disabled={train.seatsAvailable === 0}
              >
                Book
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedTrain && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={closeBooking}>&times;</button>
            <h3 className="text-lg font-bold mb-2">Book {selectedTrain.name}</h3>
            <form onSubmit={handleBooking} className="space-y-3">
              <div className="text-sm text-gray-600 mb-1">{selectedTrain.source} → {selectedTrain.destination}</div>
              <div className="text-xs text-gray-400 mb-2">Departure: {new Date(selectedTrain.departureTime).toLocaleString()}</div>
              <div>
                <label className="block text-sm mb-1">Seats</label>
                <input
                  type="number"
                  min="1"
                  max={selectedTrain.seatsAvailable}
                  value={seats}
                  onChange={e => setSeats(Number(e.target.value))}
                  className="w-full px-2 py-1 border rounded"
                  required
                />
                <div className="text-xs text-gray-400 mt-1">Available: {selectedTrain.seatsAvailable}</div>
              </div>
              {bookingError && <div className="text-red-500 text-xs">{bookingError}</div>}
              {bookingSuccess && <div className="text-green-600 text-xs">{bookingSuccess}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold shadow transition disabled:opacity-60"
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 