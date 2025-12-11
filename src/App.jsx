import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import About from './pages/About';
import Layout from './components/Layout'; // Import the new Layout

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* THE LAYOUT WRAPS THESE PAGES */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
             <Route path="/" element={<Dashboard />} />
             <Route path="/settings" element={<Settings />} />
             <Route path="/about" element={<About />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}