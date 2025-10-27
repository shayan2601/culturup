import { motion } from 'framer-motion';

export default function ProfileDetails({ profileData, profileDataSetter, isEditing, userType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='mx-auto mt-6 max-w-3xl rounded-2xl bg-white p-8 shadow-md'
    >
      <h2 className='mb-6 text-2xl font-bold text-gray-800'>Profile Details</h2>

      {userType === 'artist' ? (
        <>
          <div className='mb-4'>
            <label className='block font-semibold text-gray-700'>Bio</label>
            <textarea
              disabled={!isEditing}
              value={profileData.bio || ''}
              onChange={(e) => profileDataSetter({ ...profileData, bio: e.target.value })}
              className='mt-1 w-full rounded-md border p-2'
              rows={4}
            />
          </div>

          <div className='mb-4'>
            <label className='block font-semibold text-gray-700'>Hourly Rate ($)</label>
            <input
              type='number'
              disabled={!isEditing}
              value={profileData.hourly_rate || ''}
              onChange={(e) => profileDataSetter({ ...profileData, hourly_rate: e.target.value })}
              className='mt-1 w-full rounded-md border p-2'
            />
          </div>
        </>
      ) : (
        <>
          <div className='mb-4'>
            <label className='block font-semibold text-gray-700'>Company Name</label>
            <input
              disabled={!isEditing}
              value={profileData.company_name || ''}
              onChange={(e) => profileDataSetter({ ...profileData, company_name: e.target.value })}
              className='mt-1 w-full rounded-md border p-2'
            />
          </div>

          <div className='mb-4'>
            <label className='block font-semibold text-gray-700'>Address</label>
            <textarea
              disabled={!isEditing}
              value={profileData.address || ''}
              onChange={(e) => profileDataSetter({ ...profileData, address: e.target.value })}
              className='mt-1 w-full rounded-md border p-2'
              rows={3}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
