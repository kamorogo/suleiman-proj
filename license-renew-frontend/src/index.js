import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App'; 
import About from './pages/About';
import Contacts from './pages/Contacts';
import Services from './pages/Services';
import Reports from './pages/Reports';
import NotificationsPage from './pages/NotificationsPage';
import Licenses from './pages/Licenses';
import Renew from './pages/Renew';
import Settings from './pages/Settings';
import Help from './pages/Help';
import LicenseList from './pages/LicenseList';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/licenses" element={<Licenses />} />
        <Route path="/viewlicense" element={<LicenseList />} />
        <Route path="/renew" element={<Renew />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
