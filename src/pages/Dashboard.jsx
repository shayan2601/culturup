import FeaturedArtists from '../components/FeaturedArtists';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import PopularCategories from '../components/PopularCategories';
import RecentArtworks from '../components/RecentArtworks';
import Testimonials from '../components/Testimonials';

const Dashboard = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <HeroSection />
      <FeaturedArtists />
      <RecentArtworks />
      <PopularCategories />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Dashboard;
