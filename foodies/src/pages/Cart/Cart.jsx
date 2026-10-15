import { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./Cart.css";
import { Link, useNavigate } from "react-router-dom";
import { calculateCartTotals, getCartItemCount } from "../../util/cartUtils";

const Cart = () => {
  const navigate = useNavigate();
  const { foodList, increaseQty, decreaseQty, quantities, removeFromCart } =
    useContext(StoreContext);
  const [cartError, setCartError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const itemCount = getCartItemCount(cartItems, quantities);
  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);

  const updateCart = async (action, id) => {
    setCartError("");
    setUpdatingId(id);
    try {
      await action(id);
    } catch {
      setCartError("We couldn't sync your cart. Please refresh and try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="foodly-cart">
      <header className="foodly-cart__heading">
        <div>
          <p className="foodly-cart__eyebrow">A LITTLE HAPPINESS, TO GO</p>
          <h1>Your cart<span>.</span></h1>
          <p>Good choices. Great food. One step closer.</p>
        </div>
        <Link className="foodly-cart__back" to="/explore">
          <i className="bi bi-arrow-left" aria-hidden="true" /> Explore the menu
        </Link>
      </header>

      {cartError && <p className="foodly-cart__error" role="alert">{cartError}</p>}

      <div className="foodly-cart__layout">
        <section className="foodly-cart__items" aria-labelledby="cart-items-heading">
          <div className="foodly-cart__panel-heading">
            <h2 id="cart-items-heading">Your delicious picks</h2>
            <span className="foodly-cart__count" aria-live="polite">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
          </div>
          {cartItems.length === 0 ? (
            <div className="foodly-cart__empty">
              <span className="foodly-cart__empty-icon"><i className="bi bi-bag-heart" aria-hidden="true" /></span>
              <h3>Something delicious is missing.</h3>
              <p>Your cart is empty. Find a new favorite and make it a meal.</p>
              <Link className="foodly-cart__primary" to="/explore">Find your next bite <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>
            </div>
          ) : (
            <ul className="foodly-cart__list">
              {cartItems.map((food) => (
                <li key={food.id} className="foodly-cart__item" aria-busy={updatingId === food.id}>
                  <Link to={`/food/${food.id}`} className="foodly-cart__image-link" tabIndex={-1} aria-hidden="true">
                    <img src={food.imageUrl} alt="" className="foodly-cart__image" />
                  </Link>
                  <div className="foodly-cart__item-info">
                    <span className="foodly-cart__category">{food.category}</span>
                    <h3><Link to={`/food/${food.id}`}>{food.name}</Link></h3>
                    <p>₹{Number(food.price).toFixed(2)} each</p>
                  </div>
                  <div className="foodly-cart__quantity" aria-label={`Quantity for ${food.name}`}>
                    <button type="button" disabled={updatingId !== null} aria-label={`Decrease quantity of ${food.name}`} onClick={() => updateCart(decreaseQty, food.id)}>−</button>
                    <output aria-label={`${food.name} quantity`} aria-live="polite">{quantities[food.id]}</output>
                    <button type="button" disabled={updatingId !== null} aria-label={`Increase quantity of ${food.name}`} onClick={() => updateCart(increaseQty, food.id)}>+</button>
                  </div>
                  <div className="foodly-cart__item-total">
                    <strong>₹{(food.price * quantities[food.id]).toFixed(2)}</strong>
                    <button type="button" className="foodly-cart__remove" disabled={updatingId !== null} aria-label={`Remove ${food.name} from cart`} onClick={() => updateCart(removeFromCart, food.id)}>
                      <i className="bi bi-trash3" aria-hidden="true" /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="foodly-cart__footer-note"><i className="bi bi-heart" aria-hidden="true" /> A great meal starts with your favorites.</div>
        </section>

        <aside className="foodly-cart__summary" aria-labelledby="cart-summary-heading">
          <div className="foodly-cart__summary-icon"><i className="bi bi-receipt" aria-hidden="true" /></div>
          <h2 id="cart-summary-heading">The little details</h2>
          <p className="foodly-cart__summary-subtitle">Your order, all added up.</p>
          <dl className="foodly-cart__totals">
            <div><dt>Subtotal</dt><dd>₹{subtotal.toFixed(2)}</dd></div>
            <div><dt>Delivery fee</dt><dd>₹{shipping.toFixed(2)}</dd></div>
            <div><dt>Tax (10%)</dt><dd>₹{tax.toFixed(2)}</dd></div>
            <div className="foodly-cart__grand-total"><dt>Total <small>(INR)</small></dt><dd>₹{total.toFixed(2)}</dd></div>
          </dl>
          <button type="button" className="foodly-cart__primary" disabled={cartItems.length === 0 || updatingId !== null} onClick={() => navigate("/order")}>
            Go to checkout <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>
          <p className="foodly-cart__secure"><i className="bi bi-lock" aria-hidden="true" /> Secure payment at checkout</p>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
