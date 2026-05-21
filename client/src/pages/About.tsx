import React, { useEffect } from 'react';

const About = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-4xl text-center mb-6">The Royal Court – About Darbar</h1>
      
      {/* Text Section */}
      <div className="prose max-w-none text-lg text-center mx-auto mb-10">
        <p>
          Inspired by the opulence and grandeur of the Mughal Empire, Darbar is a luxury fashion brand that 
          seamlessly blends traditional craftsmanship with contemporary aesthetics. Rooted in the artistic 
          legacy of Akbar, Jahangir, and Shah Jahan, we bring to life designs that echo the splendor of the 
          royal courts, where art, architecture, and textiles flourished.
        </p>
        <p>
          Our collections pay homage to the miniature paintings and intricate textiles that once adorned 
          the courts of the Mughal and Rajasthani eras. Just as Hindu and Muslim artisans collaborated to 
          create timeless masterpieces, Darbar unites heritage techniques with modern sensibilities to craft 
          elegant, luxurious pieces for today’s connoisseurs. The essence of balance, rhythm, and unity in 
          design principles is reflected in every aspect of our work—honoring an era where beauty and artistry 
          were paramount.
        </p>
      </div>

      {/* Image Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {["m1.jpg", "m2.jpg", "m3.jpg", "m4.jpg"].map((image, index) => (
          <div key={index} className="w-full h-64 md:h-80 overflow-hidden rounded-lg shadow-md">
            <img 
              src={`/${image}`} 
              alt={`Mughal Art ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
