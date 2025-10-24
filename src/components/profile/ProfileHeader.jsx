import { Camera, Edit3, Save } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 pb-24">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative max-w-7xl mx-auto px-4 pt-10 flex flex-col md:flex-row items-center md:items-start gap-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative group flex-shrink-0"
        >
          <div className="h-32 w-32 rounded-3xl bg-white/20 overflow-hidden shadow-lg flex items-center justify-center text-white text-4xl">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              profileData?.user?.username?.[0]?.toUpperCase()
            )}
          </div>

          <button
            onClick={triggerFileInput}
            className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full text-gray-600 hover:bg-gray-100 shadow-md"
          >
            <Camera className="h-5 w-5" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
        </motion.div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-bold text-white">
            {profileData?.user?.first_name || profileData?.user?.username}
          </h1>
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mt-2 px-4 py-1 bg-white/20 rounded-full text-sm text-white"
          >
            {userType === "artist" ? "🎨 Artist" : "💼 Buyer"}
          </motion.span>
          <p className="text-white/90 mt-3">📧 {profileData?.user?.email}</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onEditToggle}
          className="mt-4 md:mt-0 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl flex items-center space-x-2 text-white backdrop-blur-md"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
        </motion.button>
      </div>
    </div>
  );
}
