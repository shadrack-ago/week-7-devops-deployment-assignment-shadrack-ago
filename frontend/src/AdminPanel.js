import React, { useState } from 'react';
import AdminTrains from './AdminTrains';
import AdminBookings from './AdminBookings';

export default function AdminPanel({ token }) {
  const [tab, setTab] = useState('trains');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      <div className="flex gap-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${tab === 'trains' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('trains')}
        >
          Manage Trains
        </button>
        <button
          className={`px-3 py-1 rounded ${tab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('bookings')}
        >
          All Bookings
        </button>
      </div>
      {tab === 'trains' ? <AdminTrains token={token} /> : <AdminBookings token={token} />}
    </div>
  );
} 