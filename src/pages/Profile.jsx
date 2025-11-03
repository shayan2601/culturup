import ArtworksGrid from '@components/profile/ArtworksGrid';
import ProfileDetails from '@components/profile/ProfileDetails';
import ProfileHeader from '@components/profile/ProfileHeader';
import ProfileTabs from '@components/profile/ProfileTabs';
import UploadArtworkModal from '@components/profile/UploadArtworkModal';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');
  const [artworks, setArtworks] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const fileInputRef = useRef();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const token = localStorage.getItem('authToken');
  const userId = userData?.id;
  const userType = userData?.user_type;

  useEffect(() => {
    if (userId && token) {
      const apiUrl =
        userType === 'artist'
          ? `https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${userId}/`
          : `https://shoaibahmad.pythonanywhere.com/api/buyer-profiles/${userId}/`;

      axios.get(apiUrl, { headers: { Authorization: `Token ${token}` } }).then((res) => {
        setProfileData(res.data);
        setProfileImage(res.data.user?.profile_image);
      });

      if (userType === 'artist') {
        axios
          .get(`https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${userId}/artworks/`)
          .then((res) => setArtworks(res.data?.results || []));
      }
    }
  }, [userId]);

  const triggerFileInput = () => fileInputRef.current.click();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      await handleSave();
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    console.log('USERID: ', userId);
    console.log('token: ', token);
    if (!userId || !token) return;

    const isArtist = userType === 'artist';
    const apiUrl = isArtist
      ? `https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${userId}/`
      : `https://shoaibahmad.pythonanywhere.com/api/buyer-profiles/${userId}/`;

    try {
      // If buyer → use FormData to include image and text fields together
      if (!isArtist) {
        const formData = new FormData();
        formData.append('company_name', profileData.company_name || '');
        formData.append('address', profileData.address || '');

        if (selectedImageFile) {
          formData.append('profile_image', selectedImageFile);
        }

        const res = await axios.patch(apiUrl, formData, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        setProfileData(res.data);
        setProfileImage(res.data.user?.profile_image);
      } else {
        // If artist → use your original JSON + optional image upload flow
        const updateData = {
          bio: profileData.bio || '',
          hourly_rate: profileData.hourly_rate || '0.00',
          is_available: profileData.is_available ?? true,
        };

        const res = await axios.patch(apiUrl, updateData, {
          headers: { Authorization: `Token ${token}` },
        });

        if (selectedImageFile) {
          const formData = new FormData();
          formData.append('profile_image', selectedImageFile);

          const imgRes = await axios.patch(apiUrl, formData, {
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          setProfileData(imgRes.data);
          setProfileImage(imgRes.data.user?.profile_image);
        } else {
          setProfileData(res.data);
        }
      }

      setIsEditing(false);
      alert('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      alert('❌ Failed to update profile.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 pb-20'>
      <ProfileHeader
        profileData={profileData}
        profileImage={profileImage}
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onImageUpload={handleImageUpload}
        fileInputRef={fileInputRef}
        triggerFileInput={triggerFileInput}
        userType={userType}
      />

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} userType={userType} />

      {activeTab === 'Profile' && (
        <ProfileDetails
          profileData={profileData}
          profileDataSetter={setProfileData}
          isEditing={isEditing}
          userType={userType}
        />
      )}

      {userType === 'artist' && activeTab === 'Artworks' && (
        <>
          <div className='mx-auto mt-10 max-w-6xl px-4'>
            <button
              onClick={() => {
                setEditingArtwork(null);
                setShowUploadModal(true);
              }}
              className='mb-6 rounded-xl bg-cyan-600 px-5 py-2 text-white hover:bg-cyan-700'
            >
              + Upload Artwork
            </button>

            <ArtworksGrid
              artworks={artworks}
              onEdit={(id) => {
                const art = artworks.find((a) => a.id === id);
                setEditingArtwork(art);
                setShowUploadModal(true);
              }}
            />
          </div>

          <UploadArtworkModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUpload={(data) => {
              console.log('Artwork saved:', data);
              setShowUploadModal(false);
              // Optional: refresh artwork list here
            }}
            token={token}
            mode={editingArtwork ? 'edit' : 'create'}
            artwork={editingArtwork}
          />
        </>
      )}
    </div>
  );
}
