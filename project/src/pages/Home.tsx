import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen">
      <section className="hero-section">
        <img
          src="/homepage.jpg"  // Correct path for public folder
          alt="Luxury Indian Fashion"
          className="hero-bg"
        />
        <div className="hero-overlay"></div>
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
