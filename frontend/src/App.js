import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AuthPage from './AuthPage';
import TrainList from './TrainList';
import MyBookings from './MyBookings';
import AdminPanel from './AdminPanel';

const ADMIN_EMAIL = 'admin@example.com';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

  const handleAuth = (token, email) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);
    setToken(token);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUserEmail(null);
  };

  if (!token) {
    return <AuthPage onAuth={(token, email) => handleAuth(token, email)} />;
  }

  const isAdmin = userEmail === ADMIN_EMAIL;

  return (
    <Router>
      <nav className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-blue-700 text-lg">Train Booking</span>
          <Link to="/" className="text-gray-700 hover:text-blue-600">Trains</Link>
          <Link to="/bookings" className="text-gray-700 hover:text-blue-600">My Bookings</Link>
          {isAdmin && <Link to="/admin" className="text-gray-700 hover:text-blue-600">Admin</Link>}
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">Logout</button>
      </nav>
      <div className="p-4 max-w-2xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<TrainList token={token} />} />
          <Route path="/bookings" element={<MyBookings token={token} />} />
          {isAdmin && <Route path="/admin" element={<AdminPanel token={token} />} />}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
