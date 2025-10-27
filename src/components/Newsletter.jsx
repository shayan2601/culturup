const Newsletter = () => (
  <div className='bg-cyan-700'>
    <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
      <div className='rounded-lg bg-cyan-800 px-6 py-6 md:px-12 md:py-12 lg:px-16 lg:py-16 xl:flex xl:items-center'>
        <div className='xl:w-0 xl:flex-1'>
          <h2 className='text-2xl font-extrabold tracking-tight text-white sm:text-3xl'>
            Stay updated with art trends
          </h2>
          <p className='mt-3 max-w-3xl text-lg leading-6 text-cyan-200'>
            Sign up for our newsletter to receive weekly curated artworks and special event
            invitations.
          </p>
        </div>
        <div className='mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8'>
          <form className='sm:flex'>
            <label htmlFor='email-address' className='sr-only'>
              Email address
            </label>
            <input
              id='email-address'
              name='email'
              type='email'
              autoComplete='email'
              required
              className='w-full rounded-md border-white px-5 py-3 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-700 focus:outline-none'
              placeholder='Enter your email'
            />
            <button
              type='submit'
              className='mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-cyan-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-cyan-400 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cyan-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:flex-shrink-0'
            >
              Subscribe
            </button>
          </form>
          <p className='mt-3 text-sm text-cyan-200'>
            We care about your data. Read our{' '}
            <a href='#' className='font-medium text-white underline'>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Newsletter;
