import ArtworksGrid from '@components/profile/ArtworksGrid';
import ProfileDetails from '@components/profile/ProfileDetails';
import ProfileHeader from '@components/profile/ProfileHeader';
import ProfileTabs from '@components/profile/ProfileTabs';
import UploadArtworkModal from '@components/profile/UploadArtworkModal';
import axios from 'axios';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('Profile');
  const [artworks, setArtworks] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchases, setPurchases] = useState(null);
  const [purchasesError, setPurchasesError] = useState(null);
  const fileInputRef = useRef();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const token = localStorage.getItem('authToken');
  const userId = userData?.id;
  const userType = userData?.user_type;

  // fetch artworks (memoized so we can call it safely from effects/handlers)
  const fetchArtworks = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `https://shoaibahmad.pythonanywhere.com/api/artist-profiles/${userId}/artworks/`
      );
      setArtworks(res.data?.results || []);
    } catch (err) {
      console.error('Failed to load artworks:', err.response?.data || err.message);
    }
  }, [userId]);

  // fetch purchases (memoized)
  const fetchPurchases = useCallback(async () => {
    if (!userId) return;
    setPurchasesLoading(true);
    setPurchasesError(null);
    try {
      const response = await axios.get(
        `https://shoaibahmad.pythonanywhere.com/api/buyer-profiles/${userId}/purchases/`
      );
      setPurchases(response.data);
    } catch (err) {
      setPurchasesError('Failed to load purchases.');
      console.error(err);
    } finally {
      setPurchasesLoading(false);
    }
  }, [userId]);

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
        // load artist artworks
        fetchArtworks();
      }
    }
  }, [userId, token, userType, fetchArtworks]);

  useEffect(() => {
    if (activeTab === 'Purchases' && userId) {
      fetchPurchases();
    }
  }, [activeTab, userId, fetchPurchases]);

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

      {activeTab === 'Purchases' && (
        <div className='mx-auto mt-10 max-w-3xl px-4'>
          <h2 className='mb-4 text-2xl font-bold text-gray-900'>My Purchases</h2>

          {purchasesLoading && <p>Loading purchases...</p>}
          {purchasesError && <p className='text-red-500'>{purchasesError}</p>}

          {purchases && (
            <div>
              <h3 className='mt-4 text-xl font-semibold'>Orders</h3>
              {purchases.orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                purchases.orders.map((order) => (
                  <div key={order.id} className='my-2 rounded border p-4'>
                    <p>
                      <strong>Order ID:</strong> {order.id}
                    </p>
                    <p>
                      <strong>Status:</strong> {order.status}
                    </p>
                    <p>
                      <strong>Total Amount:</strong> ${order.total_amount}
                    </p>
                    <p>
                      <strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}
                    </p>

                    <h4 className='mt-2 font-semibold'>Artwork Items:</h4>
                    {order.artwork_items.map((item, idx) => (
                      <div key={idx} className='ml-4'>
                        <p>
                          <strong>Title:</strong> {item.artwork_title}
                        </p>
                        <p>
                          <strong>Artist:</strong> {item.artwork_artist}
                        </p>
                        <p>
                          <strong>Quantity:</strong> {item.quantity}
                        </p>
                        <p>
                          <strong>Price:</strong> ${item.price}
                        </p>
                      </div>
                    ))}
                  </div>
                ))
              )}

              <h3 className='mt-6 text-xl font-semibold'>Payments</h3>
              {purchases.payments.length === 0 ? (
                <p>No payments found.</p>
              ) : (
                purchases.payments.map((payment) => (
                  <div key={payment.id} className='my-2 rounded border p-4'>
                    <p>
                      <strong>Payment ID:</strong> {payment.id}
                    </p>
                    <p>
                      <strong>Payee:</strong> {payment.payee?.username}
                    </p>
                    <p>
                      <strong>Amount:</strong> ${payment.amount}
                    </p>
                    <p>
                      <strong>Method:</strong> {payment.payment_method}
                    </p>
                    <p>
                      <strong>Status:</strong> {payment.status}
                    </p>
                    <p>
                      <strong>Created At:</strong> {new Date(payment.created_at).toLocaleString()}
                    </p>
                    {payment.job && (
                      <p>
                        <strong>Job:</strong> {payment.job.title}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
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
              // refresh artworks list after a successful upload/update
              fetchArtworks();
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
