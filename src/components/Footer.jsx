import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-gray-900 text-gray-300'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <h3 className='mb-4 text-xl font-semibold text-white'>ArtistMarket</h3>
            <p className='mb-4 text-sm'>
              Connecting artists with art lovers since 2020. Our marketplace empowers creators and
              celebrates artistic expression.
            </p>
            <div className='flex space-x-4'>
              <a href='#' className='text-gray-400 hover:text-white'>
                <Instagram size={20} />
              </a>
              <a href='#' className='text-gray-400 hover:text-white'>
                <Twitter size={20} />
              </a>
              <a href='#' className='text-gray-400 hover:text-white'>
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold text-white'>Explore</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Discover Artists
                </a>
              </li>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Featured Artwork
                </a>
              </li>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Collections
                </a>
              </li>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Upcoming Events
                </a>
              </li>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Artist Spotlights
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold text-white'>Support</h3>
            <ul className='space-y-2'>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Help Center
                </a>
              </li>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Seller Guidelines
                </a>
              </li>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Buyer Protection
                </a>
              </li>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  Report an Issue
                </a>
              </li>
              <li>
                <a href='#' className='transition-colors duration-200 hover:text-white'>
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className='mb-4 text-lg font-semibold text-white'>Contact Us</h3>
            <ul className='space-y-3'>
              <li className='flex items-start'>
                <MapPin className='mt-1 mr-2 flex-shrink-0' size={18} />
                <span>123 Gallery Street, Art District, CA 94103</span>
              </li>
              <li className='flex items-center'>
                <Phone className='mr-2 flex-shrink-0' size={18} />
                <span>(555) 123-4567</span>
              </li>
              <li className='flex items-center'>
                <Mail className='mr-2 flex-shrink-0' size={18} />
                <span>hello@artistmarket.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className='bg-gray-950 py-6'>
        <div className='mx-auto flex max-w-7xl flex-col items-center justify-between px-4 sm:px-6 md:flex-row lg:px-8'>
          <p className='text-sm'>&copy; {currentYear} ArtistMarket. All rights reserved.</p>
          <div className='mt-4 flex flex-wrap md:mt-0'>
            <a href='#' className='mr-6 text-sm hover:text-white'>
              Privacy Policy
            </a>
            <a href='#' className='mr-6 text-sm hover:text-white'>
              Terms of Service
            </a>
            <a href='#' className='text-sm hover:text-white'>
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
