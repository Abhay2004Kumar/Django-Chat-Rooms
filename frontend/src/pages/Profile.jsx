import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

export default function Profile() {
  const [form, setForm] = useState({
    photo: null,
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (!token) return;

    axios.get('me/', {
      headers: { Authorization: `Bearer ${token}` }
    }).then((res) => {
      setPreview(res.data.photo);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.new_password && form.new_password !== form.confirm_password) {
      alert('New passwords do not match.');
      return;
    }

    const formData = new FormData();
    if (form.photo) formData.append('photo', form.photo);
    if (form.current_password) formData.append('current_password', form.current_password);
    if (form.new_password) formData.append('new_password', form.new_password);
    if (form.confirm_password) formData.append('confirm_password', form.confirm_password);

    try {
      setLoading(true);
      const res = await axios.put('me/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Profile updated!');
      setForm({
        photo: null,
        current_password: '',
        new_password: '',
        confirm_password: ''
      });

      if (res.data.photo) {
        setPreview(res.data.photo);
        const user = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...user, photo: res.data.photo }));
      }
    } catch (err) {
      alert('Update failed. ' + (err.response?.data?.detail || 'Check your inputs.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-md mx-auto mt-10 px-6 py-8 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Edit Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Profile preview"
                className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setPreview(URL.createObjectURL(file));
                  setForm({ ...form, photo: file });
                }
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              value={form.current_password}
              onChange={(e) => setForm({ ...form, current_password: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="New password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
