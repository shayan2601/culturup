export default function ProfileTabs({ activeTab, setActiveTab, userType }) {
    const tabs = userType === "artist"
      ? ["Profile", "Artworks"]
      : ["Profile", "Purchases"];
  
    return (
      <div className="flex justify-center space-x-4 mt-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-lg font-semibold ${
              activeTab === tab
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-500 hover:text-cyan-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  }
  