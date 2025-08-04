import { Bell, MessageCircle, Search, User, Settings, LogOut, Upload, Edit3, Heart, ShoppingBag, Eye, Plus, Camera, Save, X } from 'lucide-react';
import React, { useState, useRef } from 'react';
const ProfilePage = ({ userType = 'buyer', onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTab, setSelectedTab] = useState('profile');
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);
  
    const [profileData, setProfileData] = useState({
      name: userType === 'artist' ? 'Alexandra Chen' : 'John Doe',
      email: userType === 'artist' ? 'alexandra@example.com' : 'john@example.com',
      bio: userType === 'artist' ? 'Contemporary digital artist specializing in abstract compositions and vibrant color palettes. My work explores the intersection of technology and human emotion.' : 'Art enthusiast and collector with a passion for contemporary and classical pieces.',
      location: 'New York, NY',
      joinDate: 'January 2023',
      website: userType === 'artist' ? 'www.alexandrachen.art' : '',
      socialMedia: {
        instagram: userType === 'artist' ? '@alexandra_art' : '@johndoe',
        twitter: userType === 'artist' ? '@alexandrart' : '@johndoe'
      }
    });
  
    const [artworks] = useState([
      { id: 1, title: 'Digital Dreams', price: '$1,200', views: 245, likes: 32 },
      { id: 2, title: 'Abstract Reality', price: '$890', views: 189, likes: 28 },
      { id: 3, title: 'Color Symphony', price: '$1,500', views: 312, likes: 45 },
      { id: 4, title: 'Ethereal Waves', price: '$750', views: 156, likes: 19 }
    ]);
  
    const [purchases] = useState([
      { id: 1, title: 'Mountain Serenity', artist: 'Emma Wilson', date: 'Dec 2024', price: '$650' },
      { id: 2, title: 'Urban Nights', artist: 'Carlos Rodriguez', date: 'Nov 2024', price: '$420' },
      { id: 3, title: 'Ocean Dreams', artist: 'Sarah Kim', date: 'Oct 2024', price: '$890' }
    ]);
  
    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };
  
    const handleSave = () => {
      setIsEditing(false);
      console.log('Profile saved:', profileData);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 pb-24">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="flex justify-between items-start mb-8">
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 text-white"
              >
                Profile
              </button>
              <button
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors duration-200 flex items-center space-x-2 text-white"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              <div className="relative group">
                <div className="h-32 w-32 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    profileData.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                <button
                  onClick={triggerFileInput}
                  className="absolute -bottom-2 -right-2 p-3 bg-white rounded-full text-gray-600 hover:bg-gray-50 transition-colors duration-200 shadow-lg group-hover:scale-110 transform"
                >
                  <Camera className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
                  <h1 className="text-4xl font-bold text-white">{profileData.name}</h1>
                  {userType === 'artist' && (
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white inline-block">
                      ✨ Verified Artist
                    </span>
                  )}
                </div>
                <div className="space-y-2 text-white/90">
                  <p className="text-lg">📍 {profileData.location}</p>
                  <p>🗓️ Joined {profileData.joinDate}</p>
                  {userType === 'artist' && (
                    <p className="flex items-center justify-center md:justify-start space-x-2">
                      <span>🎨 {artworks.length} Artworks</span>
                      <span>•</span>
                      <span>❤️ {artworks.reduce((sum, art) => sum + art.likes, 0)} Total Likes</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8 px-8">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  ...(userType === 'artist' 
                    ? [{ id: 'artworks', label: 'Artworks', icon: Upload }]
                    : [{ id: 'purchases', label: 'Purchases', icon: ShoppingBag }]
                  )
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`flex items-center space-x-2 py-6 px-2 border-b-2 transition-colors duration-200 ${
                        selectedTab === tab.id
                          ? 'border-cyan-500 text-cyan-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
  
            <div className="p-8">
              {selectedTab === 'profile' && (
                <div className="max-w-4xl space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-50 transition-colors duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-50 transition-colors duration-200"
                      />
                    </div>
                    
                    {userType === 'artist' && (
                      <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700">Website</label>
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-50 transition-colors duration-200"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-50 transition-colors duration-200 resize-none"
                    />
                  </div>
  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Instagram</label>
                      <input
                        type="text"
                        value={profileData.socialMedia.instagram}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          socialMedia: {...profileData.socialMedia, instagram: e.target.value}
                        })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-50 transition-colors duration-200"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700">Twitter</label>
                      <input
                        type="text"
                        value={profileData.socialMedia.twitter}
                        onChange={(e) => setProfileData({
                          ...profileData, 
                          socialMedia: {...profileData.socialMedia, twitter: e.target.value}
                        })}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-50 transition-colors duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}
  
              {selectedTab === 'artworks' && userType === 'artist' && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">My Artworks</h3>
                      <p className="text-gray-600">Manage and showcase your creative works</p>
                    </div>
                    <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                      <Plus className="h-5 w-5" />
                      <span>Upload New Artwork</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artworks.map((artwork) => (
                      <div key={artwork.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="h-48 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-xl mb-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-2">{artwork.title}</h4>
                        <p className="text-cyan-600 font-semibold text-xl mb-3">{artwork.price}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>{artwork.views}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{artwork.likes}</span>
                            </span>
                          </div>
                          <button className="text-cyan-600 hover:text-cyan-700 font-medium">Edit</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
  
              {selectedTab === 'purchases' && userType === 'buyer' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Purchase History</h3>
                    <p className="text-gray-600">Your collected artworks and transaction history</p>
                  </div>
                  
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="bg-white rounded-2xl p-6 flex items-center space-x-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <div className="h-20 w-20 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-xl flex-shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{purchase.title}</h4>
                          <p className="text-gray-600">by {purchase.artist}</p>
                          <p className="text-sm text-gray-500">{purchase.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-xl">{purchase.price}</p>
                          <button className="text-cyan-600 hover:text-cyan-700 text-sm font-medium">View Details</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };


  export default ProfilePage;