import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InterviewSession from './pages/InterviewSession'; // <-- This is the new import

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-apple-gray dark:bg-apple-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes (Wrapped inside DashboardLayout) */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="interview" element={<InterviewSession />} /> {/* <-- This is the new route */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;