import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-montserrat text-sm text-royal-gold uppercase tracking-widest mb-4">
        404
      </p>
      <h1 className="font-playfair text-4xl md:text-5xl mb-4">Page Not Found</h1>
      <p className="font-montserrat text-gray-600 max-w-md mb-8">
        The page you are looking for may have been moved, deleted, or does not exist.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-royal-gold text-white px-6 py-3 rounded font-montserrat text-sm hover:bg-opacity-90 transition-colors"
        >
          Go Home
        </Link>
        <Link
          to="/collections"
          className="border border-royal-gold text-royal-gold px-6 py-3 rounded font-montserrat text-sm hover:bg-royal-gold hover:text-white transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
