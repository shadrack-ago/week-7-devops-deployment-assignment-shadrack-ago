import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function AdminTrains({ token }) {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editTrain, setEditTrain] = useState(null);
  const [form, setForm] = useState({ name: '', source: '', destination: '', departureTime: '', seatsAvailable: 0, price: 0 });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchTrains = () => {
    setLoading(true);
    fetch(`${API_URL}/api/trains`)
      .then(res => res.json())
      .then(data => { setTrains(data); setLoading(false); })
      .catch(() => { setError('Failed to load trains'); setLoading(false); });
  };

  useEffect(() => { fetchTrains(); }, []);

  const openAdd = () => {
    setForm({ name: '', source: '', destination: '', departureTime: '', seatsAvailable: 0, price: 0 });
    setShowAdd(true);
    setEditTrain(null);
    setFormError('');
  };

  const openEdit = (train) => {
    setForm({ ...train, departureTime: train.departureTime.slice(0, 16) });
    setEditTrain(train);
    setShowAdd(true);
    setFormError('');
  };

  const closeForm = () => {
    setShowAdd(false);
    setEditTrain(null);
    setFormError('');
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    const method = editTrain ? 'PUT' : 'POST';
    const url = editTrain ? `${API_URL}/api/trains/${editTrain._id}` : `${API_URL}/api/trains`;
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, seatsAvailable: Number(form.seatsAvailable), price: Number(form.price) }),
      });
      if (!res.ok) {
        const data = await res.json();
        setFormError(data.message || 'Failed to save train');
      } else {
        fetchTrains();
        closeForm();
      }
    } catch {
      setFormError('Failed to save train');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this train?')) return;
    try {
      await fetch(`${API_URL}/api/trains/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrains();
    } catch {}
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Trains</h3>
        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm" onClick={openAdd}>Add Train</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-3">
          {trains.map(train => (
            <div key={train._id} className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-white shadow-sm">
              <div>
                <div className="font-semibold text-blue-700">{train.name}</div>
                <div className="text-sm text-gray-600">{train.source} → {train.destination}</div>
                <div className="text-xs text-gray-400">Departure: {new Date(train.departureTime).toLocaleString()}</div>
                <div className="text-xs text-gray-400">Seats: {train.seatsAvailable} | Price: ${train.price}</div>
              </div>
              <div className="flex gap-2">
                <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs" onClick={() => openEdit(train)}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded text-xs" onClick={() => handleDelete(train._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={closeForm}>&times;</button>
            <h4 className="font-bold mb-2">{editTrain ? 'Edit Train' : 'Add Train'}</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-2 py-1 border rounded" placeholder="Train Name" required />
              <input name="source" value={form.source} onChange={handleChange} className="w-full px-2 py-1 border rounded" placeholder="Source" required />
              <input name="destination" value={form.destination} onChange={handleChange} className="w-full px-2 py-1 border rounded" placeholder="Destination" required />
              <input name="departureTime" value={form.departureTime} onChange={handleChange} className="w-full px-2 py-1 border rounded" type="datetime-local" required />
              <input name="seatsAvailable" value={form.seatsAvailable} onChange={handleChange} className="w-full px-2 py-1 border rounded" type="number" min="0" placeholder="Seats Available" required />
              <input name="price" value={form.price} onChange={handleChange} className="w-full px-2 py-1 border rounded" type="number" min="0" placeholder="Price" required />
              {formError && <div className="text-red-500 text-xs">{formError}</div>}
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold shadow transition disabled:opacity-60" disabled={formLoading}>
                {formLoading ? 'Saving...' : (editTrain ? 'Update Train' : 'Add Train')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 