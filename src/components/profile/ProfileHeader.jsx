import { motion } from 'framer-motion';
import { Camera, Edit3, Save } from 'lucide-react';

export default function ProfileHeader({
  profileData,
  profileImage,
  isEditing,
  onEditToggle,
  onImageUpload,
  fileInputRef,
  triggerFileInput,
  userType,
}) {
  return (
    <div className='relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 pb-24'>
      <div className='absolute inset-0 bg-black/10' />
      <div className='relative mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 pt-10 md:flex-row md:items-start'>
        <motion.div whileHover={{ scale: 1.05 }} className='group relative flex-shrink-0'>
          <div className='flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-white/20 text-4xl text-white shadow-lg'>
            {profileImage ? (
              <img src={profileImage} alt='Profile' className='h-full w-full object-cover' />
            ) : (
              profileData?.user?.username?.[0]?.toUpperCase()
            )}
          </div>

          <button
            onClick={triggerFileInput}
            className='absolute -right-2 -bottom-2 rounded-full bg-white p-2 text-gray-600 shadow-md hover:bg-gray-100'
          >
            <Camera className='h-5 w-5' />
          </button>

          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={onImageUpload}
            className='hidden'
          />
        </motion.div>

        <div className='flex-1 text-center md:text-left'>
          <h1 className='text-4xl font-bold text-white'>
            {profileData?.user?.first_name || profileData?.user?.username}
          </h1>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className='mt-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm text-white'
          >
            {userType === 'artist' ? '🎨 Artist' : '💼 Buyer'}
          </motion.span>
          <p className='mt-3 text-white/90'>📧 {profileData?.user?.email}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onEditToggle}
          className='mt-4 flex items-center space-x-2 rounded-xl bg-white/20 px-6 py-2 text-white backdrop-blur-md hover:bg-white/30 md:mt-0'
        >
          {isEditing ? <Save className='h-4 w-4' /> : <Edit3 className='h-4 w-4' />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </motion.button>
      </div>
    </div>
  );
}
