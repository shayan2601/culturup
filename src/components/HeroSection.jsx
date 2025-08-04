import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => (
  <div className="relative bg-gradient-to-r from-cyan-700 to-blue-800 overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative z-10">
      <div className="lg:w-1/2 text-center lg:text-left">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl leading-tight">
          Discover Extraordinary Art
        </h1>
        <p className="mt-4 text-lg text-cyan-100 sm:text-xl lg:mt-6 max-w-xl">
          Connect with talented artists worldwide and explore a diverse collection of masterpieces curated just for you.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
          <Link
            to="/gallery"
            className="inline-block px-8 py-3 text-lg font-medium text-cyan-700 bg-white rounded-md shadow hover:bg-gray-100 transition"
          >
            Explore Gallery
          </Link>
          <Link
            to="/artists"
            className="inline-block px-8 py-3 text-lg font-medium  border border-white border-opacity-50 bg-white bg-opacity-10 rounded-md hover:bg-opacity-20 transition"
          >
            Find Artists
          </Link>
        </div>
      </div>
    </div>

    <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 z-0">
    <img
      className="h-full w-full object-cover"
      src="https://images.unsplash.com/photo-1639345002840-5eb3d08d2552?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBhaW50aW5ncyUyMGFydGlzdHN8ZW58MHx8MHx8fDA%3D"
      alt="Modern art exhibition"
      loading='lazy'
    />

      <div className="absolute inset-0 bg-gradient-to-l from-blue-800 via-cyan-700 to-transparent opacity-70 lg:opacity-50"></div>
    </div>
  </div>
);

export default HeroSection;
