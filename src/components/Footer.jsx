import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">ArtistMarket</h3>
            <p className="mb-4 text-sm">Connecting artists with art lovers since 2020. Our marketplace empowers creators and celebrates artistic expression.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Discover Artists</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Featured Artwork</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Collections</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Upcoming Events</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Artist Spotlights</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Seller Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Buyer Protection</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Report an Issue</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 mt-1 flex-shrink-0" size={18} />
                <span>123 Gallery Street, Art District, CA 94103</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 flex-shrink-0" size={18} />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 flex-shrink-0" size={18} />
                <span>hello@artistmarket.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {currentYear} ArtistMarket. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex flex-wrap">
            <a href="#" className="text-sm mr-6 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-sm mr-6 hover:text-white">Terms of Service</a>
            <a href="#" className="text-sm hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}