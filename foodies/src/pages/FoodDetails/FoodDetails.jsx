import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchFoodDetails } from "../../service/FoodService";
import { StoreContext } from "../../context/StoreContext";
import "./FoodDetails.css";

const FoodDetails = () => {
  const { id } = useParams();
  const { foodList, increaseQty, quantities } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const localFood = foodList.find((food) => String(food.id) === String(id));

    const loadFoodDetails = async () => {
      if (localFood) {
        setData(localFood);
        setLoading(false);
        return;
      }

      try {
        const foodData = await fetchFoodDetails(id);
        if (active) setData(foodData);
      } catch {
        if (active) toast.error("Failed to load food details");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFoodDetails();
    return () => { active = false; };
  }, [foodList, id]);

  if (loading) {
    return <div className="page-shell page-section food-detail-state"><span className="loading-spinner" /><p>Loading your dish...</p></div>;
  }

  if (!data) {
    return <div className="page-shell page-section"><div className="empty-state"><i className="bi bi-emoji-frown" /><h3>That dish could not be found</h3><Link to="/explore" className="primary-button">Back to menu</Link></div></div>;
  }

  const quantity = quantities?.[data.id] || 0;

  const addToCart = () => {
    increaseQty(data.id);
    navigate("/cart");
  };

  return (
    <main className="food-details-page page-shell page-section">
      <Link to="/explore" className="back-link"><i className="bi bi-arrow-left" /> Back to menu</Link>
      <div className="food-detail-layout">
        <div className="food-detail-image-panel">
          <span className="detail-image-badge"><i className="bi bi-star-fill" /> Customer favourite</span>
          <img src={data.imageUrl} alt={data.name} />
        </div>
        <div className="food-detail-copy">
          <p className="eyebrow">{data.category || "Chef's special"}</p>
          <h1>{data.name}</h1>
          <div className="detail-rating"><span><i className="bi bi-star-fill" /> 4.8</span> · 120+ happy orders</div>
          <p className="detail-description">{data.description}</p>
          <div className="detail-perks">
            <span><i className="bi bi-check2-circle" /> Freshly prepared</span>
            <span><i className="bi bi-clock" /> Ready in 25 min</span>
          </div>
          <div className="detail-purchase-row">
            <strong>₹{Number(data.price || 0).toFixed(0)}</strong>
            {quantity > 0 && <span className="detail-in-cart">{quantity} in your cart</span>}
          </div>
          <div className="detail-actions">
            <button type="button" className="primary-button" onClick={addToCart}><i className="bi bi-bag-plus" /> Add to order</button>
            <Link to="/cart" className="secondary-button">View cart <i className="bi bi-arrow-up-right" /></Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FoodDetails;
