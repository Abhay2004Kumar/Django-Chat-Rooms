import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/Navbar';

export default function ChatRoom() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    axios
      .get(`rooms/${id}/messages/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      })
      .then((res) => {
        setMessages(res.data);
        scrollToBottom();
      })
      .catch((err) => {
        console.error('Fetch messages error:', err.response?.data || err.message);
        alert('Error loading messages');
      });
  }, [id]);

  const sendMessage = async () => {
    if (!content.trim()) return;
    try {
      const res = await axios.post(
        `rooms/${id}/messages/`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      setMessages([...messages, res.data]);
      setContent('');
      scrollToBottom();
    } catch (err) {
      console.error('Message send error:', err.response?.data || err.message);
      alert('Error sending message: ' + (err.response?.data?.detail || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto mt-8 p-4 bg-white shadow-md rounded-xl">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Chat Room</h2>

        <div className="h-[400px] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-3 bg-white p-3 rounded shadow-sm border border-gray-100">
              <img
                src={msg.sender.photo || 'https://via.placeholder.com/40'}
                alt={msg.sender.username}
                className="w-10 h-10 rounded-full object-cover border"
              />
              <div>
                <p className="text-sm text-gray-800 font-medium">{msg.sender.username}</p>
                <p className="text-sm text-gray-700">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-4 flex gap-2">
          <input
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Type a message"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
