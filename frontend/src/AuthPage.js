import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Something went wrong');
      } else {
        if (mode === 'register') {
          setSuccess('Registration successful! You can now log in.');
          setMode('login');
        } else {
          localStorage.setItem('token', data.token);
          localStorage.setItem('userEmail', email);
          if (onAuth) onAuth(data.token, email);
        }
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md border border-gray-200 p-6 flex flex-col items-center">
        {/* Creative description */}
        <div className="mb-6 w-full text-center">
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5V8a2 2 0 012-2h14a2 2 0 012 2v2.5M3 10.5V16a2 2 0 002 2h14a2 2 0 002-2v-5.5M3 10.5l9 5.5 9-5.5" />
              </svg>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-blue-700 mb-1 tracking-tight">Train Booking System</h1>
          <p className="text-gray-500 text-sm">Book your next journey with ease. Fast, simple, and secure train ticketing for everyone!</p>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="text-gray-500 text-sm mb-4 text-center">
          {mode === 'login' ? 'Welcome back! Please login.' : 'Sign up to book your train tickets.'}
        </p>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>
          {error && <div className="text-red-500 text-xs text-center">{error}</div>}
          {success && <div className="text-green-600 text-xs text-center">{success}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold shadow transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center w-full">
          {mode === 'login' ? (
            <span className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <button
                className="text-blue-600 hover:underline font-medium"
                onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              >
                Register
              </button>
            </span>
          ) : (
            <span className="text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                className="text-blue-600 hover:underline font-medium"
                onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 