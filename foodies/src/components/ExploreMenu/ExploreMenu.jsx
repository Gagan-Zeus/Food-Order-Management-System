import React, { useRef } from "react";
import { categories } from "../../assets/assets";
import "./ExploreMenu.css";

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);

  const scrollMenu = (amount) => {
    menuRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="explore-menu-section">
      <div className="section-topline">
        <div>
          <p className="eyebrow">Find your flavour</p>
          <h2 className="section-heading">What are you craving?</h2>
        </div>
        <div className="category-arrows">
          <button type="button" onClick={() => scrollMenu(-260)} aria-label="Previous categories">
            <i className="bi bi-arrow-left" />
          </button>
          <button type="button" onClick={() => scrollMenu(260)} aria-label="Next categories">
            <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
      <div className="category-scroller" ref={menuRef}>
        <button
          type="button"
          className={`category-pill ${category === "All" ? "selected" : ""}`}
          onClick={() => setCategory("All")}
        >
          <span className="category-emoji">✦</span> All dishes
        </button>
        {categories.map((item) => (
          <button
            type="button"
            key={item.category}
            className={`category-pill ${item.category === category ? "selected" : ""}`}
            onClick={() => setCategory((current) => current === item.category ? "All" : item.category)}
          >
            <img src={item.icon} alt="" />
            {item.category}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ExploreMenu;
