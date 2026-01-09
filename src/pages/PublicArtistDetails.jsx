import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '@components/Navbar';
import { MapPin, Calendar, Star, DollarSign, ArrowLeft, Mail, Globe, Award, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';

const PublicArtistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('artworks');

  useEffect(() => {
    fetchArtistAndArtworks();
  }, [id]);

  const fetchArtistAndArtworks = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [artistRes, artworkRes] = await Promise.all([
        axios.get(`https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${id}/`, { headers }),
        axios.get(`https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${id}/artworks/`, { headers })
      ]);

      setArtist(artistRes.data);
      setArtworks(artworkRes.data.results || []);
    } catch (err) {
      console.error('Error fetching artist details:', err);
      toast.error('Failed to load artist details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Artist not found</h2>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
      </div>
    );
  }

  const { user, bio, skills, experience_level, hourly_rate } = artist;
  const fullName = `${user.first_name} ${user.last_name}`;
  
  // Create a safer fallback for profile image
  const profileImage = user.profile_image || 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0d9488&color=fff&size=200`;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      {/* Header / Hero Section */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-gray-500 hover:text-cyan-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
            {/* Profile Image */}
            <div className="flex-shrink-0 mb-6 md:mb-0">
              <div className="relative">
                <img 
                  src={profileImage} 
                  alt={fullName}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {artist.is_verified && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1.5 border-2 border-white shadow-sm" title="Verified Artist">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    {artist.location && (
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {artist.location}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1 text-gray-400" />
                      {experience_level || 'Artist'} 
                    </span>
                    <span className="flex items-center text-cyan-700 font-medium">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {hourly_rate}/hr
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 md:mt-0">
                  
                  <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full font-medium shadow-sm hover:bg-gray-50 transition-all"
                    onClick={() => navigate('/chat', { state: { artistId: user.id } })}
                  >
                    Message
                  </button>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-gray-600 max-w-3xl leading-relaxed mt-2">
                {bio || "No bio information available for this artist."}
              </p>
              
              {/* Skills Tags */}
              {skills && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {skills.split(',').map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('artworks')}
              className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'artworks' 
                  ? 'border-cyan-600 text-cyan-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Artworks ({artworks.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'about' 
                  ? 'border-cyan-600 text-cyan-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Artworks Tab */}
        {activeTab === 'artworks' && (
          <div className="animate-fade-in">
            {artworks.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No artworks yet</h3>
                <p className="mt-1 text-gray-500">This artist stays waiting for inspiration.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {artworks.map((art) => (
                  <div 
                    key={art.id} 
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                    onClick={() => navigate(`/artwork/${art.id}`)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={art.image || art.watermarked_image}
                        alt={art.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-4 w-full text-white">
                          <p className="font-semibold text-sm">View Details</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-cyan-700 transition-colors">
                          {art.title}
                        </h3>
                        {/* <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                           Artist has no post_date in API sample, omit
                        </span> */}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
                        {art.description || "No description provided."}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                        <span className="text-lg font-bold text-gray-900">
                           {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(art.price)}
                        </span>
                        <div className="flex items-center space-x-3 text-gray-400 text-sm">
                           <span className="flex items-center"><Star className="w-3 h-3 mr-1" /> {art.likes_count || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Biography</h3>
                <div className="prose prose-cyan text-gray-600 max-w-none">
                  <p>{bio || "No detailed biography available."}</p>
                </div>
              </div>
              
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Expertise</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start p-4 rounded-xl bg-gray-50">
                    <Award className="w-6 h-6 text-cyan-600 mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Experience Level</h4>
                      <p className="text-gray-600 text-sm mt-1">{experience_level || 'Not specified'}</p>
                    </div>
                  </div>
                   <div className="flex items-start p-4 rounded-xl bg-gray-50">
                    <DollarSign className="w-6 h-6 text-cyan-600 mt-1 mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Rates</h4>
                      <p className="text-gray-600 text-sm mt-1">Starting at ${hourly_rate}/hr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
               <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
                  <div className="space-y-4">
                     <div className="flex items-center text-gray-600">
                        <Mail className="w-5 h-5 mr-3 text-cyan-600" />
                        <span className="text-sm truncate">{user.email}</span>
                     </div>
                      <div className="flex items-center text-gray-600">
                        <Globe className="w-5 h-5 mr-3 text-cyan-600" />
                        <span className="text-sm">culturup.com/artist/{user.username || id}</span>
                     </div>
                     <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 text-cyan-600" />
                        <span className="text-sm">Member since {new Date().getFullYear()}</span>
                     </div>
                  </div>

               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicArtistDetails;
