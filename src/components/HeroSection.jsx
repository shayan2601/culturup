import React from 'react'
import { Link } from 'react-router-dom';
const HeroSection = () => (
    <div className="relative bg-gradient-to-r from-cyan-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Discover Extraordinary Art
          </h2>
          <p className="mt-3 max-w-md mx-auto text-lg text-cyan-100 sm:text-xl md:mt-5 md:max-w-3xl">
            Connect with talented artists worldwide and explore a diverse collection of masterpieces.
          </p>
          <div className="mt-8 flex justify-center sm:justify-start">
            <div className="rounded-md shadow">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-cyan-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Explore Gallery
              </a>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a
                href="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-800 bg-opacity-60 hover:bg-opacity-70 md:py-4 md:text-lg md:px-10"
              >
                Find Artists
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
        <img
          className="h-full w-full object-cover"
          src="/api/placeholder/700/400"
          alt="Art gallery exhibition"
        />
      </div>
    </div>
  );
export default HeroSection;