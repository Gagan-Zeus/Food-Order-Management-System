import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./FoodItem.css";

const FoodItem = ({ name, description, id, imageUrl, price, category }) => {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);
  const quantity = quantities?.[id] ?? 0;

  return (
    <article className="food-card">
      <Link to={`/food/${id}`} className="food-image-link">
        <div className="food-image-wrap">
          <img src={imageUrl} alt={name} className="food-card-image" />
          <span className="food-favourite" aria-hidden="true"><i className="bi bi-heart" /></span>
        </div>
      </Link>
      <div className="food-card-body">
        <div className="food-card-meta">
          <span>{category || "Chef's special"}</span>
          <span><i className="bi bi-star-fill" /> 4.8</span>
        </div>
        <Link to={`/food/${id}`} className="food-card-title">{name}</Link>
        <p className="food-card-description">{description || "A delicious favourite from our kitchen."}</p>
        <div className="food-card-footer">
          <strong>₹{Number(price || 0).toFixed(0)}</strong>
          {quantity > 0 ? (
            <div className="quantity-control" aria-label={`Quantity of ${name}`}>
              <button type="button" onClick={() => decreaseQty(id)} aria-label={`Remove one ${name}`}>
                <i className="bi bi-dash" />
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => increaseQty(id)} aria-label={`Add one ${name}`}>
                <i className="bi bi-plus" />
              </button>
            </div>
          ) : (
            <button className="add-food-button" type="button" onClick={() => increaseQty(id)}>
              <i className="bi bi-plus" /> Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default FoodItem;
