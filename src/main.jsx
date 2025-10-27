import '@styles/custom.css';
import '@styles/tailwind.css';

import ArtworkDetailPage from '@components/ArtworkDetailPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import AllArtists from './pages/AllArtists';
import AllEquipments from './pages/AllEquipments';
import ArtEquipment from './pages/ArtEquipment';
import ArtistDetails from './pages/ArtistDetails';
import ChatScreen from './pages/ChatScreen';
import ChatWindow from './pages/ChatWindow';
import ConversationsScreen from './pages/ConversationsScreen';
import CreateEquipment from './pages/CreateEquipment';
import Dashboard from './pages/Dashboard';
import ExploreArtists from './pages/ExploreArtists';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ProfilePage from './pages/Profile';
import PurchasePage from './pages/PurchasePage';
import Signup from './pages/Signup';
import UpdateArtist from './pages/UpdateArtist';
import UpdateArtwork from './pages/UpdateArtwork';
import UpdateEquipment from './pages/UpdateEquipment';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/equipments' element={<ArtEquipment />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/artwork/:artworkId' element={<ArtworkDetailPage />} />
        <Route path='/explore-artists' element={<ExploreArtists />} />
        <Route path='/gallery' element={<Gallery />} />
        {/* <Route path="/chat" element={<ChatList />} /> */}
        <Route path='/chat' element={<ChatScreen />} />
        <Route path='/chat/:conversationId' element={<ChatWindow />} />
        <Route path='/conversations' element={<ConversationsScreen />} />
        <Route path='/purchase/:artworkId' element={<PurchasePage />} />
        <Route path='/order-confirmation' element={<OrderConfirmationPage />} />
        {/* Admin routes */}
        <Route path='/admin' element={<AdminLogin />} />
        <Route
          path='/admin/dashboard'
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/create-equipment'
          element={
            <AdminProtectedRoute>
              <CreateEquipment />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/equipments'
          element={
            <AdminProtectedRoute>
              <AllEquipments />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/update-equipment/:id'
          element={
            <AdminProtectedRoute>
              <UpdateEquipment />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/artists'
          element={
            <AdminProtectedRoute>
              <AllArtists />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/update-artist/:id'
          element={
            <AdminProtectedRoute>
              <UpdateArtist />
            </AdminProtectedRoute>
          }
        />
        <Route
          path='/admin/artist/:id'
          element={
            <AdminProtectedRoute>
              <ArtistDetails />
            </AdminProtectedRoute>
          }
        />
        <Route path='/update-artwork/:id' element={<UpdateArtwork />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
