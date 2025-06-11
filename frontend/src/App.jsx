import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ChatRooms from './pages/ChatRooms';
import ChatRoom from './pages/ChatRoom';
import RequireAuth from './components/RequireAuth';
import Profile from './pages/Profile';

function App() {
  const isAuthenticated = !!localStorage.getItem('access');

  return (
    <Router>
      <Routes>
        {/* Redirect to /rooms if already logged in */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/rooms" /> : <Register />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/rooms" /> : <Login />} />

        <Route
          path="/rooms"
          element={
            <RequireAuth>
              <ChatRooms />
            </RequireAuth>
          }
        />
        <Route
          path="/rooms/:id"
          element={
            <RequireAuth>
              <ChatRoom />
            </RequireAuth>
          }
        />
        <Route
  path="/profile"
  element={
    <RequireAuth>
      <Profile />
    </RequireAuth>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
