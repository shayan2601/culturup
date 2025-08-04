import '@styles/custom.css';
import '@styles/tailwind.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ArtEquipment from './pages/ArtEquipment';
import AdminLogin from './pages/AdminLogin';
import ProfilePage from './pages/Profile';
import ArtworkDetailPage from '@components/ArtworkDetailPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/equipments" element={<ArtEquipment />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/artwork/:artworkId" element={<ArtworkDetailPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
