const Testimonials = () => {
  const testimonials = [
    {
      name: 'Fatima Zahra',
      role: 'Art Collector',
      feedback:
        'Culturup has transformed the way I discover and collect art. The platform is intuitive, and I love the curation of emerging artists!',
      avatar: '/api/placeholder/100/100',
    },
    {
      name: 'James Wilson',
      role: 'Gallery Owner',
      feedback:
        "As a gallery owner, I've found exceptional talent through this platform. The quality of artists and their work is outstanding.",
      avatar: '/api/placeholder/100/100',
    },
    {
      name: 'Mei Lin',
      role: 'Visual Artist',
      feedback:
        'This platform has helped me reach collectors I never would have connected with otherwise. My sales have increased dramatically.',
      avatar: '/api/placeholder/100/100',
    },
  ];

  return (
    <div className='bg-white py-16'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <h2 className='mb-12 text-center text-2xl font-bold text-gray-900'>
          What Our Community Says
        </h2>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {testimonials.map((testimonial, index) => (
            <div key={index} className='relative rounded-lg bg-gray-50 p-6 shadow-sm'>
              <div className='absolute -top-6 left-1/2 -translate-x-1/2 transform'>
                <img
                  src='https://plus.unsplash.com/premium_photo-1690407617686-d449aa2aad3c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YXZhdGFyJTIwcGljdHVyZXxlbnwwfHwwfHx8MA%3D%3D'
                  alt={testimonial.name}
                  className='h-12 w-12 rounded-full border-4 border-white shadow'
                />
              </div>
              <div className='pt-6 text-center'>
                <p className='mb-4 text-gray-600 italic'>{testimonial.feedback}</p>
                <h4 className='text-lg font-bold text-gray-900'>{testimonial.name}</h4>
                <p className='text-sm text-gray-500'>{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Testimonials;
