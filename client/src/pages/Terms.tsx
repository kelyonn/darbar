import React, { useEffect } from 'react';

const Terms = () => {
  // Scroll to the top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-4xl mb-8">Terms & Conditions</h1>
      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="font-playfair text-2xl mb-4">1. Introduction</h2>
          <p>Welcome to Darbar. By accessing and using our website, you accept and agree to be bound by these terms and conditions.</p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">2. Intellectual Property</h2>
          <p>All content on this website, including designs, text, graphics, logos, and images, is the property of Darbar and is protected by copyright laws.</p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">3. Product Information</h2>
          <p>We strive to display our products accurately, but colors and details may vary due to screen settings. All products are subject to availability.</p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">4. Pricing and Payment</h2>
          <p>All prices are in Indian Rupees (₹). We reserve the right to modify prices without notice. Payment must be made in full before order processing.</p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">5. Shipping and Delivery</h2>
          <p>Delivery times are estimates only. We are not liable for delays beyond our control. Risk of loss passes to you upon delivery.</p>
        </section>

        <section>
          <h2 className="font-playfair text-2xl mb-4">6. Privacy Policy</h2>
          <p>Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect and use your personal data.</p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
