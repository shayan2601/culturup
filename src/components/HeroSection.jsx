import { Link } from 'react-router-dom';

const HeroSection = () => (
  <div className='relative overflow-hidden bg-gradient-to-r from-cyan-700 to-blue-800'>
    <div className='relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28'>
      <div className='text-center lg:w-1/2 lg:text-left'>
        <h1 className='text-4xl leading-tight font-extrabold text-white sm:text-5xl lg:text-6xl'>
          Discover Extraordinary Art
        </h1>
        <p className='mt-4 max-w-xl text-lg text-cyan-100 sm:text-xl lg:mt-6'>
          Connect with talented artists worldwide and explore a diverse collection of masterpieces
          curated just for you.
        </p>
        <div className='mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start'>
          <Link
            to='/gallery'
            className='inline-block rounded-md bg-white px-8 py-3 text-lg font-medium text-cyan-700 shadow transition hover:bg-gray-100'
          >
            Explore Gallery
          </Link>
          <Link
            to='/explore-artists'
            className='border-opacity-50 bg-opacity-10 hover:bg-opacity-20 inline-block rounded-md border border-white bg-white px-8 py-3 text-lg font-medium transition'
          >
            Find Artists
          </Link>
        </div>
      </div>
    </div>

    <div className='absolute inset-y-0 right-0 z-0 w-full lg:w-1/2'>
      <img
        className='h-full w-full object-cover'
        src='https://images.unsplash.com/photo-1639345002840-5eb3d08d2552?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBhaW50aW5ncyUyMGFydGlzdHN8ZW58MHx8MHx8fDA%3D'
        alt='Modern art exhibition'
        loading='lazy'
      />

      <div className='absolute inset-0 bg-gradient-to-l from-blue-800 via-cyan-700 to-transparent opacity-70 lg:opacity-50'></div>
    </div>
  </div>
);

export default HeroSection;
