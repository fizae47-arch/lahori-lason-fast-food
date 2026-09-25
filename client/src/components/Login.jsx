import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { password });
      if (res.data.success) {
        sessionStorage.setItem('isLoggedIn', 'true');
        onLogin();
      }
    } catch (err) {
      setError('Galat Password! Dobara try karo.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-80">
        <h1 className="text-2xl font-extrabold text-center text-yellow-500 mb-2">
          🍔 LAHORI LASON
        </h1>
        <p className="text-center text-gray-500 text-sm mb-6">POS System Login</p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-3">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded pr-10 focus:outline-none focus:border-yellow-400"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 disabled:bg-gray-300"
          >
            {loading ? 'Checking...' : 'Unlock'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;