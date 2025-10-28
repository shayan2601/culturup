import {
  Bell,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  User,
  X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onProfileClick }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

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
    <nav className='sticky top-0 z-50 border-b border-gray-100 bg-white/90 shadow-lg backdrop-blur-md'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between'>
          {/* Left Menu */}
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center'>
              <span className='bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-700 bg-clip-text text-2xl font-bold text-transparent'>
                Culturup
              </span>
            </div>
            <div className='hidden md:ml-8 md:flex md:space-x-1'>
              {[
                { name: 'Home', href: '/' },
                { name: 'Explore Artists', href: '/explore-artists' },
                { name: 'Gallery', href: '/gallery' },
                { name: 'Equipments', href: '/equipments' },
                ...(isLoggedIn ? [{ name: 'Jobs', href: '/jobs' }] : []),
                ...(!isLoggedIn
                  ? [
                      { name: 'Login', href: '/login' },
                      { name: 'Signup', href: '/signup' },
                    ]
                  : []),
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className='group relative rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all duration-300 hover:text-cyan-600'
                >
                  {item.name}
                  <span className='absolute bottom-0 left-0 h-0.5 w-full scale-x-0 transform bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 group-hover:scale-x-100'></span>
                </a>
              ))}
            </div>
          </div>

          {/* Right Menu */}
          <div className='hidden items-center space-x-4 md:flex'>
            <div className='relative'>
              <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                <Search className='h-4 w-4 text-gray-400' />
              </div>
              <input
                className='block w-64 rounded-xl border border-gray-200 bg-white/50 py-2 pr-4 pl-10 leading-5 placeholder-gray-500 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:border-cyan-500 focus:placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none sm:text-sm'
                placeholder='Search artworks, artists...'
                type='search'
              />
            </div>

            <div className='relative'>
              <button
                className='group relative rounded-xl bg-white/50 p-2 text-gray-500 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-cyan-600 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none'
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Bell className='h-5 w-5 group-hover:animate-pulse' />
                <span className='absolute -top-1 -right-1 block h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-red-500 to-pink-500'></span>
              </button>

              {isNotificationOpen && (
                <div className='animate-in slide-in-from-top-2 absolute right-0 mt-2 w-80 origin-top-right transform rounded-2xl border border-gray-100 bg-white/95 shadow-2xl ring-1 ring-gray-200 backdrop-blur-md transition-all duration-300'>
                  <div className='py-2'>
                    <div className='border-b border-gray-100 px-4 py-3'>
                      <p className='text-sm font-semibold text-gray-900'>Notifications</p>
                    </div>
                    {[1, 2, 3].map((item) => (
                      <a
                        key={item}
                        href='#'
                        className='block px-4 py-3 transition-all duration-200 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50'
                      >
                        <div className='flex items-center'>
                          <div className='flex-shrink-0'>
                            <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500'>
                              <span className='text-sm font-semibold text-white'>A{item}</span>
                            </div>
                          </div>
                          <div className='ml-3'>
                            <p className='text-sm font-medium text-gray-900'>
                              New message from Artist {item}
                            </p>
                            <p className='text-xs text-gray-500'>Just now</p>
                          </div>
                        </div>
                      </a>
                    ))}
                    <a
                      href='#'
                      className='block px-4 py-3 text-center text-sm font-medium text-cyan-600 transition-colors duration-200 hover:bg-cyan-50'
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Messages Icon: Only show if logged in */}
            {isLoggedIn && (
              <button
                onClick={() => navigate('/conversations')}
                className='group rounded-xl bg-white/50 p-2 text-gray-500 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-cyan-600 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none'
              >
                <MessageCircle className='h-5 w-5 group-hover:animate-pulse' />
              </button>
            )}

            {/* Profile */}
            <div className='relative'>
              <button
                className='group flex rounded-xl bg-white/50 p-1 text-sm backdrop-blur-sm transition-all duration-300 hover:bg-white focus:ring-2 focus:ring-cyan-500/50 focus:outline-none'
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  if (onProfileClick && !isProfileOpen) {
                    onProfileClick();
                  }
                }}
              >
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 transition-transform duration-300 group-hover:scale-105'>
                  <span className='text-sm font-semibold text-white'>
                    {username ? username[0].toUpperCase() : 'JD'}
                  </span>
                </div>
              </button>

              {isProfileOpen && (
                <div className='animate-in slide-in-from-top-2 absolute right-0 mt-2 w-48 origin-top-right transform rounded-2xl border border-gray-100 bg-white/95 shadow-2xl ring-1 ring-gray-200 backdrop-blur-md transition-all duration-300'>
                  <div className='py-2'>
                    <a
                      href='/profile'
                      className='flex items-center px-4 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50'
                    >
                      <User className='mr-3 h-4 w-4 text-cyan-600' />
                      Your Profile
                    </a>
                    <a
                      href='#'
                      className='flex items-center px-4 py-2 text-sm text-gray-700 transition-all duration-200 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50'
                    >
                      <Settings className='mr-3 h-4 w-4 text-cyan-600' />
                      Settings
                    </a>
                    <hr className='my-1 border-gray-100' />
                    <button
                      onClick={handleLogout}
                      className='flex w-full items-center px-4 py-2 text-left text-sm text-red-600 transition-all duration-200 hover:bg-red-50'
                    >
                      <LogOut className='mr-3 h-4 w-4' />
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
