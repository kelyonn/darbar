import React, { useEffect } from 'react';

const Returns = () => {
  // Scroll to the top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-4xl mb-8">Returns Policy</h1>
      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="font-playfair text-2xl mb-4">Return Period</h2>
          <p>You may return unused items within 14 days of delivery. Items must be in their original condition with all tags attached.</p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">Eligible Items</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Unworn clothing with original tags</li>
            <li>Unworn accessories in original packaging</li>
            <li>Items without signs of wear or alterations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">Non-Returnable Items</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Custom-made or altered items</li>
            <li>Items marked as final sale</li>
            <li>Worn or damaged items</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">Return Process</h2>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contact our customer service within 14 days of delivery</li>
            <li>Receive a return authorization number</li>
            <li>Pack the item securely with all original packaging</li>
            <li>Ship to the provided return address</li>
          </ol>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">Refunds</h2>
          <p>Refunds will be processed within 7-10 business days of receiving the returned item. Original shipping charges are non-refundable.</p>
        </section>
      </div>
    </div>
  );
};

export default Returns;
