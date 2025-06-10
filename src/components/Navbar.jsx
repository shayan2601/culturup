import { Bell, MessageCircle, Search } from 'lucide-react';
import React, { useState } from 'react'
const Navbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
            <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">Culturup</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
                <a href="/" className="border-b-2 border-cyan-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                Home
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Explore Artists
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Gallery
                </a>
                <a href="/ArtEquipment" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Equipments
                </a>
                <a href="/login" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Login
                </a>
                <a href="/signup" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Signup
                </a>
            </div>
            </div>
            <div className="hidden md:flex items-center">
            <div className="relative mx-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                placeholder="Search artworks, artists..."
                type="search"
                />
            </div>
            
            {/* Notifications */}
            <div className="relative ml-3">
                <button
                className="p-1 bg-white rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
                
                {isNotificationOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                    <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Notifications</p>
                    </div>
                    {[1, 2, 3].map((item) => (
                        <a
                        key={item}
                        href="#"
                        className="block px-4 py-3 hover:bg-gray-50 transition ease-in-out duration-150"
                        >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                            <img className="h-10 w-10 rounded-full" src={`/api/placeholder/40/40`} alt="" />
                            </div>
                            <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">New message from Artist {item}</p>
                            <p className="text-sm text-gray-500">Just now</p>
                            </div>
                        </div>
                        </a>
                    ))}
                    <a href="#" className="block px-4 py-2 text-center text-sm text-cyan-600 hover:bg-gray-50">View all notifications</a>
                    </div>
                </div>
                )}
            </div>
            
            {/* Messages */}
            <button className="ml-3 p-1 bg-white rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                <MessageCircle className="h-6 w-6" />
            </button>
            
            {/* Profile dropdown */}
            <div className="ml-3 relative">
                <div>
                <button
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    <img
                    className="h-8 w-8 rounded-full"
                    src="/api/placeholder/32/32"
                    alt="User profile"
                    />
                </button>
                </div>
                
                {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="inline-block w-4 h-4 mr-2" />
                    Your Profile
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="inline-block w-4 h-4 mr-2" />
                    Settings
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="inline-block w-4 h-4 mr-2" />
                    Sign out
                    </a>
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