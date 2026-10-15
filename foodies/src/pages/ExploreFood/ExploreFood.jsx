import React, { useState } from "react";
import { Link } from "react-router-dom";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import "./ExploreFood.css";

const ExploreFood = () => {
  const [category, setCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  return (
    <main className="explore-page page-shell page-section">
      <div className="explore-heading">
        <div>
          <p className="eyebrow">The full menu</p>
          <h1 className="section-heading">Something for every craving.</h1>
          <p className="section-copy">Browse the menu, find your favourite, and let us handle the rest.</p>
        </div>
        <Link to="/" className="secondary-button"><i className="bi bi-arrow-left" /> Back home</Link>
      </div>
      <div className="explore-search-wrap">
        <i className="bi bi-search" />
        <input
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by dish, category or flavour..."
          aria-label="Search dishes"
        />
        {searchText && <button type="button" onClick={() => setSearchText("")} aria-label="Clear search"><i className="bi bi-x" /></button>}
      </div>
      <ExploreMenu category={category} setCategory={setCategory} />
      <div className="explore-results-heading">
        <h2>{searchText ? `Results for “${searchText}”` : category === "All" ? "All dishes" : category}</h2>
        <span>Freshly prepared today</span>
      </div>
      <FoodDisplay category={category} searchText={searchText} />
    </main>
  );
};

export default ExploreFood;
