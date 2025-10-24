// src/components/AdminSidebar.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaChartBar, FaBoxes, FaSignOutAlt, FaUserAlt } from "react-icons/fa";

const AdminSidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [artistOpen, setArtistOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaChartBar />, path: "/admin/dashboard" },
  ];

  return (
    <div className="w-64 bg-cyan-700 text-white min-h-screen flex flex-col p-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-10 tracking-wide">Admin Panel</h2>

      <nav className="flex-1 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path
                ? "bg-cyan-500 shadow-lg"
                : "hover:bg-cyan-600"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}

        {/* Equipments */}
        <div>
          <button
            onClick={() => setEquipmentOpen(!equipmentOpen)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
              location.pathname.includes("/admin/equipment")
                ? "bg-cyan-500 shadow-lg"
                : "hover:bg-cyan-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaBoxes />
              <span>Equipments</span>
            </div>
            <span>{equipmentOpen ? "▲" : "▼"}</span>
          </button>

          {equipmentOpen && (
            <div className="ml-6 mt-2 space-y-2">
              <button
                onClick={() => navigate("/admin/equipments")}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  location.pathname === "/admin/equipments"
                    ? "bg-cyan-600"
                    : "hover:bg-cyan-600"
                }`}
              >
                Get All Equipments
              </button>
              <button
                onClick={() => navigate("/admin/create-equipment")}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  location.pathname === "/admin/create-equipment"
                    ? "bg-cyan-600"
                    : "hover:bg-cyan-600"
                }`}
              >
                Create Equipment
              </button>
            </div>
          )}
        </div>

        {/* 🎨 Artists */}
        <div>
          <button
            onClick={() => setArtistOpen(!artistOpen)}
            className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all ${
              location.pathname.includes("/admin/artist")
                ? "bg-cyan-500 shadow-lg"
                : "hover:bg-cyan-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <FaUserAlt />
              <span>Artists</span>
            </div>
            <span>{artistOpen ? "▲" : "▼"}</span>
          </button>

          {artistOpen && (
            <div className="ml-6 mt-2 space-y-2">
              <button
                onClick={() => navigate("/admin/artists")}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${
                  location.pathname === "/admin/artists"
                    ? "bg-cyan-600"
                    : "hover:bg-cyan-600"
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
        className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-xl mt-6 transition-all"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default AdminSidebar;
