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
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/Profile';
import ArtworkDetailPage from '@components/ArtworkDetailPage';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import ExploreArtists from './pages/ExploreArtists';
import Gallery from './pages/Gallery';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/equipments" element={<ArtEquipment />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/artwork/:artworkId" element={<ArtworkDetailPage />} />
        <Route path="/explore-artists" element={<ExploreArtists />} />
        <Route path="/gallery" element={<Gallery />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
