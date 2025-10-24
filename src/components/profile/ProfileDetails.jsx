import { motion } from "framer-motion";

export default function ProfileDetails({ profileData, profileDataSetter, isEditing, userType }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 mt-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Details</h2>

      {userType === "artist" ? (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Bio</label>
            <textarea
              disabled={!isEditing}
              value={profileData.bio || ""}
              onChange={(e) =>
                profileDataSetter({ ...profileData, bio: e.target.value })
              }
              className="w-full p-2 mt-1 border rounded-md"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Hourly Rate ($)</label>
            <input
              type="number"
              disabled={!isEditing}
              value={profileData.hourly_rate || ""}
              onChange={(e) =>
                profileDataSetter({ ...profileData, hourly_rate: e.target.value })
              }
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Company Name</label>
            <input
              disabled={!isEditing}
              value={profileData.company_name || ""}
              onChange={(e) =>
                profileDataSetter({ ...profileData, company_name: e.target.value })
              }
              className="w-full p-2 mt-1 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Address</label>
            <textarea
              disabled={!isEditing}
              value={profileData.address || ""}
              onChange={(e) =>
                profileDataSetter({ ...profileData, address: e.target.value })
              }
              className="w-full p-2 mt-1 border rounded-md"
              rows={3}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}
