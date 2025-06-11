import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 onClick={() => navigate('/rooms')} className="text-xl font-bold text-green-700 cursor-pointer">Chat App</h1>
      {user && (
        <div className="flex items-center gap-4">
          <img src={user.photo} className="w-8 h-8 rounded-full object-cover" alt="profile" />
          <span
            className="text-gray-800 font-medium cursor-pointer hover:underline"
            onClick={() => navigate('/profile')}
          >
            {user.username}
          </span>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
