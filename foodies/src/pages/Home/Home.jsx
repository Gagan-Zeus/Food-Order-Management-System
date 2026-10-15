import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals, getCartItemCount } from "../../util/cartUtils";
import "./Home.css";

const Home = () => {
  const [category, setCategory] = useState("All");
  const { foodList, quantities, increaseQty, decreaseQty } = useContext(StoreContext);
  const cartItems = (foodList || []).filter((food) => quantities?.[food.id] > 0);
  const itemCount = getCartItemCount(cartItems, quantities);
  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities || {});

  return (
    <main className="home-page">
      <Header />
      <div className="home-layout page-shell">
        <section className="menu-column">
          <ExploreMenu category={category} setCategory={setCategory} />
          <div className="menu-heading-row">
            <div>
              <p className="eyebrow">{category === "All" ? "Full menu" : "Category"}</p>
              <h2 className="section-heading">{category === "All" ? "All dishes" : `${category} dishes`}</h2>
            </div>
            <Link to="/explore" className="muted-link">Browse menu <i className="bi bi-arrow-up-right" /></Link>
          </div>
          <FoodDisplay category={category} searchText="" />
        </section>

        <aside className="home-order-panel">
          <div className="order-panel-heading">
            <div>
              <p className="eyebrow">Your selection</p>
              <h2>My order <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span></h2>
            </div>
            <Link to="/cart" aria-label="Edit cart"><i className="bi bi-three-dots" /></Link>
          </div>
          {cartItems.length === 0 ? (
            <div className="home-order-empty">
              <span><i className="bi bi-bag-heart" /></span>
              <h3>Your order starts here</h3>
              <p>Add a dish and it will show up in your order summary.</p>
            </div>
          ) : (
            <div className="home-order-items">
              {cartItems.map((food) => (
                <div className="home-order-item" key={food.id}>
                  <img src={food.imageUrl} alt="" />
                  <div className="home-order-item-info">
                    <strong>{food.name}</strong>
                    <span>₹{Number(food.price).toFixed(0)}</span>
                    <div className="mini-quantity">
                      <button type="button" onClick={() => decreaseQty(food.id)} aria-label="Decrease quantity"><i className="bi bi-dash" /></button>
                      <b>{quantities[food.id]}</b>
                      <button type="button" onClick={() => increaseQty(food.id)} aria-label="Increase quantity"><i className="bi bi-plus" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="order-panel-summary">
            <div><span>Subtotal</span><b>₹{subtotal.toFixed(2)}</b></div>
            <div><span>Delivery</span><b>{shipping ? `₹${shipping.toFixed(2)}` : "Free"}</b></div>
            <div><span>Tax</span><b>₹{tax.toFixed(2)}</b></div>
            <div className="order-total"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div>
          </div>
          <Link to="/cart" className={`primary-button order-panel-button ${cartItems.length === 0 ? "disabled" : ""}`}>
            Review order <i className="bi bi-arrow-right" />
          </Link>
          <p className="order-note"><i className="bi bi-shield-check" /> Secure checkout with Razorpay</p>
        </aside>
      </div>
    </main>
  );
};

export default Home;
