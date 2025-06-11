import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ChatRooms() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    axios.get('rooms/').then((res) => setRooms(res.data));
  }, []);

  const createRoom = async () => {
    if (!roomName.trim()) return;
    try {
      const res = await axios.post('rooms/', { name: roomName });
      setRooms([...rooms, res.data]);
      setRoomName('');
    } catch (error) {
      alert('Failed to create room.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Join or Create a Chat Room</h1>

        <div className="flex items-center gap-2 mb-6">
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            onClick={createRoom}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Create
          </button>
        </div>

        <ul className="divide-y divide-gray-200">
          {rooms.map((room) => (
            <li key={room.id} className="py-3">
              <Link
                to={`/rooms/${room.id}`}
                className="text-lg font-medium text-blue-600 hover:underline"
              >
                {room.name}
              </Link>
            </li>
          ))}
          {rooms.length === 0 && (
            <li className="text-gray-500 text-center py-6">No rooms yet. Create one above.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
