import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';

// Pages
import Page1_Login from './pages/Page1_Login';
import Page2_Dashboard from './pages/Page2_Dashboard';
import Page3_EmployeePortal from './pages/Page3_EmployeePortal';
import Page4_Directory from './pages/Page4_Directory';
import Page5_Attendance from './pages/Page5_Attendance';
import Page6_LeaveManagement from './pages/Page6_LeaveManagement';
import Page7_Payroll from './pages/Page7_Payroll';
import Page8_AiAnalytics from './pages/Page8_AiAnalytics';
import Page9_ProjectsTasks from './pages/Page9_ProjectsTasks';
import Page_KioskFullscreen from './pages/Page_KioskFullscreen';
import Page_Settings from './pages/Page_Settings';

export default function App() {
  return (
    <Routes>
      {/* Standalone Login Route */}
      <Route path="/login" element={<Page1_Login />} />

      {/* Standalone Fullscreen Kiosk Route */}
      <Route path="/kiosk" element={<Page_KioskFullscreen />} />

      {/* Main App Layout Shell */}
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Page2_Dashboard />} />
        <Route path="/portal" element={<Page3_EmployeePortal />} />
        <Route path="/tasks" element={<Page9_ProjectsTasks />} />
        <Route path="/directory" element={<Page4_Directory />} />
        <Route path="/attendance" element={<Page5_Attendance />} />
        <Route path="/leaves" element={<Page6_LeaveManagement />} />
        <Route path="/payroll" element={<Page7_Payroll />} />
        <Route path="/ai-analytics" element={<Page8_AiAnalytics />} />
        <Route path="/settings" element={<Page_Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
