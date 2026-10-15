import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./Header.css";

const Header = () => {
  return (
    <section className="hero-section page-shell">
      <div className="hero-copy">
        <p className="eyebrow">Made fresh for your mood</p>
        <h1>Good food is always a good idea.</h1>
        <p className="hero-description">
          Discover delicious dishes from your favourite kitchens, thoughtfully
          packed and delivered while they are still at their best.
        </p>
        <div className="hero-actions">
          <Link to="/explore" className="primary-button">
            Explore the menu <i className="bi bi-arrow-up-right" />
          </Link>
          <Link to="/contact" className="hero-secondary-link">
            Need a little help? <i className="bi bi-arrow-right" />
          </Link>
        </div>
        <div className="hero-proof">
          <div className="avatar-stack" aria-label="Recent customer ratings">
            {assets.reviewers.map((reviewer, index) => <span key={reviewer}><img src={reviewer} alt={`${index + 1} happy customer`} /></span>)}
          </div>
          <div>
            <strong>4.9 / 5</strong>
            <span>Loved by hungry people</span>
          </div>
        </div>
      </div>
      <div className="hero-visual" aria-label="A delicious biryani bowl">
        <div className="hero-glow" />
        <div className="hero-image-frame">
          <img
            src={assets.biryani || assets.biryaniLocal}
            alt="Fresh chicken biryani"
            onError={(e) => {
              if (assets.biryaniLocal && e.currentTarget.src !== assets.biryaniLocal) {
                e.currentTarget.src = assets.biryaniLocal;
              }
            }}
          />
        </div>
        <div className="hero-tag hero-tag-top">
          <span className="hero-tag-icon"><i className="bi bi-stars" /></span>
          <span><b>Chef's pick</b><small>Ready in 25 min</small></span>
        </div>
        <div className="hero-tag hero-tag-bottom">
          <i className="bi bi-heart-fill" />
          <span>Made with care</span>
        </div>
      </div>
    </section>
  );
};

export default Header;
