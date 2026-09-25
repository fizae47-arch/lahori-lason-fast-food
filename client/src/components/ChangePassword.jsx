import { useState } from 'react';
import axios from 'axios';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Eye icon state
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage('Naya password match nahi kar raha!');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/change-password`, {
        oldPassword,
        newPassword,
      });
      setIsError(false);
      setMessage(res.data.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setIsError(true);
      setMessage(err.response?.data?.message || 'Error: Password change nahi hua');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔐 Change Password</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">

        {/* Old Password */}
        <div>
          <label className="block text-sm font-semibold mb-1">Old Password</label>
          <div className="relative">
            <input
              type={showOld ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showOld ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold mb-1">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showNew ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border p-2 rounded pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {message && (
          <p className={isError ? 'text-red-500 text-sm' : 'text-green-600 text-sm'}>
            {message}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;