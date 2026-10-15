import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import "./FoodDisplay.css";

const FoodDisplay = ({ category = "All", searchText = "", limit }) => {
  const { foodList } = useContext(StoreContext);

  const filteredFoods = (foodList || []).filter((food) => {
    const foodCategory = food.category || "";
    const foodName = food.name || "";
    return (
      (category === "All" || foodCategory.toLowerCase() === category.toLowerCase()) &&
      foodName.toLowerCase().includes(searchText.toLowerCase())
    );
  });
  const displayedFoods = limit ? filteredFoods.slice(0, limit) : filteredFoods;

  return (
    <div className="food-display">
      {displayedFoods.length > 0 ? (
        <div className="food-grid">
          {displayedFoods.map((food) => (
            <FoodItem key={food.id} {...food} />
          ))}
        </div>
      ) : (
        <div className="empty-state food-empty-state">
          <i className="bi bi-search" />
          <h3>No dishes found</h3>
          <p>Try another search or choose a different category.</p>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;
