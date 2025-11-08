import { useState } from 'react';
import { FaBoxes, FaChartBar, FaSignOutAlt, FaUserAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [artistOpen, setArtistOpen] = useState(false);

  const menuItems = [{ name: 'Dashboard', icon: <FaChartBar />, path: '/admin/dashboard' }];

  return (
    <div className='flex min-h-screen w-64 flex-col bg-cyan-700 p-6 text-white shadow-xl'>
      <h2 className='mb-10 text-2xl font-bold tracking-wide'>Admin Panel</h2>

      <nav className='flex-1 space-y-3'>
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all ${
              location.pathname === item.path ? 'bg-cyan-500 shadow-lg' : 'hover:bg-cyan-600'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}

        <div>
          <button
            onClick={() => setEquipmentOpen(!equipmentOpen)}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all ${
              location.pathname.includes('/admin/equipment')
                ? 'bg-cyan-500 shadow-lg'
                : 'hover:bg-cyan-600'
            }`}
          >
            <div className='flex items-center gap-3'>
              <FaBoxes />
              <span>Equipments</span>
            </div>
            <span>{equipmentOpen ? '▲' : '▼'}</span>
          </button>

          {equipmentOpen && (
            <div className='mt-2 ml-6 space-y-2'>
              <button
                onClick={() => navigate('/admin/equipments')}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                  location.pathname === '/admin/equipments' ? 'bg-cyan-600' : 'hover:bg-cyan-600'
                }`}
              >
                Get All Equipments
              </button>
              <button
                onClick={() => navigate('/admin/create-equipment')}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                  location.pathname === '/admin/create-equipment'
                    ? 'bg-cyan-600'
                    : 'hover:bg-cyan-600'
                }`}
              >
                Create Equipment
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setArtistOpen(!artistOpen)}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all ${
              location.pathname.includes('/admin/artist')
                ? 'bg-cyan-500 shadow-lg'
                : 'hover:bg-cyan-600'
            }`}
          >
            <div className='flex items-center gap-3'>
              <FaUserAlt />
              <span>Artists</span>
            </div>
            <span>{artistOpen ? '▲' : '▼'}</span>
          </button>

          {artistOpen && (
            <div className='mt-2 ml-6 space-y-2'>
              <button
                onClick={() => navigate('/admin/artists')}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                  location.pathname === '/admin/artists' ? 'bg-cyan-600' : 'hover:bg-cyan-600'
                }`}
              >
                Get All Artists
              </button>
            </div>
          )}
        </div>
      </nav>

      <button
        onClick={onLogout}
        className='mt-6 flex items-center gap-3 rounded-xl bg-red-600 px-4 py-3 transition-all hover:bg-red-700'
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
