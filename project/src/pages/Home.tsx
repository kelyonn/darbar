import React from "react";
import { Link } from "react-router-dom";
import homepageImage from "../assets/homepage.jpg"; // Import the image

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Image */}
        <img
          src={homepageImage}  // Use the imported image
          alt="Luxury Indian Fashion"
          className="hero-bg"
        />
        {/* Overlay for Blur & Dark Effect */}
        <div className="hero-overlay"></div>

        {/* Hero Content */}
        <div className="hero-content">
          <h1 className="hero-title">DARBAR</h1>
          <p className="hero-subtitle">Luxury Mughal-Inspired Fashion</p>
          <Link to="/collections" className="hero-button">
            Explore Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
