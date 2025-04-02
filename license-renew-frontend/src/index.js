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
import Help from './pages/Help';
import LicenseList from './pages/LicenseList';
import Providers from './pages/Providers';
import Manage from './pages/Manage';
import Create from './pages/Create';

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
        <Route path="/providers" element={<Providers />} />
        <Route path="/manage" element={<Manage />} />
        <Route path="/licenses" element={<Licenses />} />
        <Route path="/viewlicense" element={<LicenseList />} />
        <Route path="/renew" element={<Renew />} />
        <Route path="/create" element={<Create />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
