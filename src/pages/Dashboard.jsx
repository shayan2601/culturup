import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedArtists from '../components/FeaturedArtists';
import RecentArtworks from '../components/RecentArtworks';
import Testimonials from '../components/Testimonials';
import PopularCategories from '../components/PopularCategories';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroSection />
      <FeaturedArtists />
      <RecentArtworks />
      <PopularCategories />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Dashboard;
