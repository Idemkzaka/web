import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AttendanceProvider } from './context/AttendanceContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <AttendanceProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </Router>
    </AttendanceProvider>
  );
}

export default App;