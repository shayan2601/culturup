import { Bell, MessageCircle, Search, User, Settings, LogOut, Upload, Edit3, Heart, ShoppingBag, Eye, Plus, Camera, Save, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const Navbar = ({ onProfileClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('userData'));
  
    if (token && user) {
      setIsLoggedIn(true);
      setUsername(user.username);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    window.location.href = '/';
  };
  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-transparent">
                Culturup
              </span>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-1">
                {[
                    { name: 'Home', href: '/' },
                    { name: 'Explore Artists', href: '#' },
                    { name: 'Gallery', href: '#' },
                    { name: 'Equipments', href: '/ArtEquipment' },
                    ...(isLoggedIn ? [] : [
                    { name: 'Login', href: '/login' },
                    { name: 'Signup', href: '/signup' }
                    ])
                ].map((item) => (
                    <a
                    key={item.name}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group text-gray-600 hover:text-cyan-600`}
                    >
                    {item.name}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-all duration-300`}></span>
                    </a>
                ))}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                className="block w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl leading-5 bg-white/50 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all duration-300 sm:text-sm hover:bg-white"
                placeholder="Search artworks, artists..."
                type="search"
              />
            </div>
            
            <div className="relative">
              <button
                className="relative p-2 bg-white/50 backdrop-blur-sm rounded-xl text-gray-500 hover:text-cyan-600 hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell className="h-5 w-5 group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"></span>
              </button>
              
              {isNotificationOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md ring-1 ring-gray-200 border border-gray-100 transform transition-all duration-300 animate-in slide-in-from-top-2">
                  <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">Notifications</p>
                    </div>
                    {[1, 2, 3].map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="block px-4 py-3 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">A{item}</span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">New message from Artist {item}</p>
                            <p className="text-xs text-gray-500">Just now</p>
                          </div>
                        </div>
                      </a>
                    ))}
                    <a href="#" className="block px-4 py-3 text-center text-sm text-cyan-600 hover:bg-cyan-50 transition-colors duration-200 font-medium">
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <button className="p-2 bg-white/50 backdrop-blur-sm rounded-xl text-gray-500 hover:text-cyan-600 hover:bg-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 group">
              <MessageCircle className="h-5 w-5 group-hover:animate-pulse" />
            </button>
            
            <div className="relative">
              <button
                className="bg-white/50 backdrop-blur-sm rounded-xl p-1 flex text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 hover:bg-white transition-all duration-300 group"
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  if (onProfileClick && !isProfileOpen) {
                    onProfileClick();
                  }
                }}
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                  <span className="text-white font-semibold text-sm">JD</span>
                </div>
              </button>
              
                {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md ring-1 ring-gray-200 border border-gray-100 transform transition-all duration-300 animate-in slide-in-from-top-2">
                        <div className="py-2">
                        <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200">
                            <User className="w-4 h-4 mr-3 text-cyan-600" />
                            Your Profile
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200">
                            <Settings className="w-4 h-4 mr-3 text-cyan-600" />
                            Settings
                        </a>
                        <hr className="my-1 border-gray-100" />
                        <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign out
                        </button>
                        </div>
                    </div>
                )}

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;