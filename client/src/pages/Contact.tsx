import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to send message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm font-montserrat shadow-sm focus:border-royal-gold focus:outline-none focus:ring-1 focus:ring-royal-gold';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-playfair text-4xl mb-2">Contact Us</h1>
      <p className="font-montserrat text-gray-600 mb-10">
        Have a question or need assistance? We typically respond within 24 hours.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          {submitted ? (
            <div className="py-12 text-center">
              <h2 className="font-playfair text-2xl mb-3">Message Sent</h2>
              <p className="font-montserrat text-gray-600">
                Thank you for reaching out. We will get back to you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 font-montserrat">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-montserrat">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 font-montserrat">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 font-montserrat">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-royal-gold text-white px-8 py-3 rounded font-montserrat text-sm hover:bg-opacity-90 disabled:opacity-60 transition-all"
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-playfair text-xl mb-2">Get in Touch</h3>
            <p className="font-montserrat text-sm text-gray-600">
              We are available Monday through Saturday, 10am–6pm IST.
            </p>
          </div>
          <div className="space-y-3 font-montserrat text-sm text-gray-600">
            <p><span className="font-medium text-gray-800">Email:</span> contact@darbar.in</p>
            <p><span className="font-medium text-gray-800">Phone:</span> +91 98765 43210</p>
            <p><span className="font-medium text-gray-800">Address:</span> 12, Gulmohar Lane, New Delhi — 110017</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
