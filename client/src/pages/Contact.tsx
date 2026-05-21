import React, { useEffect } from 'react';

const Contact = () => {
  // Scroll to the top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-4xl mb-6">Contact Us</h1>
      <div className="max-w-2xl">
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-royal-gold focus:ring-royal-gold"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-royal-gold focus:ring-royal-gold"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="message"
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-royal-gold focus:ring-royal-gold"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-royal-gold text-white px-6 py-2 rounded hover:bg-opacity-90"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
