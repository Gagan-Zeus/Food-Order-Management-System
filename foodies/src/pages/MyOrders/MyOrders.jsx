import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import { calculateCartTotals, resolveFoodItem } from "../../util/cartUtils";

const MyOrders = () => {
  const { token, foodList, addItemsToCart, increaseQty } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await axios.get("http://localhost:8080/api/orders", { headers: { Authorization: `Bearer ${token}` } });
        const validOrders = (response.data || []).filter((order) => {
          const paymentStatus = (order.paymentStatus || "").toLowerCase();
          const orderStatus = (order.orderStatus || "").toLowerCase();
          return paymentStatus !== "pending" && orderStatus !== "pending payment";
        });
        if (isMounted) setOrders([...validOrders].reverse());
      } catch (error) {
        console.error("Could not fetch orders:", error);
        if (isMounted) setLoadError("We couldn't load your orders. Check your connection and try again.");
        toast.error("Could not fetch orders.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchOrders();
    return () => { isMounted = false; };
  }, [token]);

  useEffect(() => {
    if (!selectedOrder) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") setSelectedOrder(null); };
    document.body.classList.add("foodly-modal-open");
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.classList.remove("foodly-modal-open"); document.removeEventListener("keydown", onKeyDown); };
  }, [selectedOrder]);

  const viewDetails = (order) => {
    const quantities = {};
    const cartItems = (order.orderedItems || []).filter((item) => item.quantity > 0).map((item) => {
      const catalogItem = resolveFoodItem(item, foodList);
      const foodId = catalogItem?.id || item.foodId;
      quantities[foodId] = item.quantity;
      const price = item.price > 0 ? item.price : catalogItem?.price || 0;
      return {
        ...item,
        id: foodId,
        foodId,
        name: item.name || catalogItem?.name || "Delicious dish",
        price,
      };
    });
    setSelectedOrder({ ...order, orderedItems: cartItems, calculatedFees: calculateCartTotals(cartItems, quantities) });
  };

  const getStatusBadge = (status) => {
    if (status === "Paid" || status === "Delivered") return "is-success";
    if (status === "Food Preparing" || status === "Out for Delivery") return "is-progress";
    if (status === "Payment Cancelled") return "is-cancelled";
    if (status === "Payment Failed") return "is-failed";
    return "is-pending";
  };

  const reorder = async (order) => {
    const orderedItems = (order.orderedItems || []).filter((item) => item.quantity > 0);
    if (orderedItems.length === 0) {
      toast.error("This order has no items to reorder.");
      return;
    }

    const itemsToAdd = [];
    let unavailableCount = 0;

    for (const item of orderedItems) {
      const catalogItem = resolveFoodItem(item, foodList);
      if (catalogItem) {
        itemsToAdd.push({
          foodId: catalogItem.id,
          quantity: item.quantity,
          name: catalogItem.name,
        });
      } else {
        unavailableCount += 1;
      }
    }

    if (itemsToAdd.length === 0) {
      toast.error("None of the items from this order are currently available on the menu.");
      return;
    }

    try {
      if (addItemsToCart) {
        await addItemsToCart(itemsToAdd);
      } else {
        for (const item of itemsToAdd) {
          await increaseQty(item.foodId, item.quantity);
        }
      }

      if (unavailableCount > 0) {
        toast.warn(`${itemsToAdd.length} item(s) added to cart. ${unavailableCount} item(s) are no longer on the menu.`);
      } else {
        toast.success("Items added to cart!");
      }
    } catch (error) {
      console.error("Failed to reorder items:", error);
      toast.error("Could not add items to cart. Please try again.");
    }
  };

  return (
    <main className="foodly-orders">
      <header className="foodly-orders__header">
        <div><p className="foodly-orders__eyebrow">YOUR FOOD JOURNEY</p><h1>Order history<span>.</span></h1><p>Every good meal has a story. Here are yours.</p></div>
        <div className="foodly-orders__header-mark" aria-hidden="true"><i className="bi bi-bag-heart" /></div>
      </header>

      <section className="foodly-orders__panel" aria-labelledby="orders-heading">
        <div className="foodly-orders__panel-head"><div><h2 id="orders-heading">Your orders</h2><p>Keep an eye on the good stuff.</p></div>{!isLoading && orders.length > 0 && <span className="foodly-orders__total-count">{orders.length} {orders.length === 1 ? "order" : "orders"}</span>}</div>
        {isLoading ? <div className="foodly-orders__state"><span className="foodly-orders__loader" aria-hidden="true" /><h3>Gathering your orders...</h3><p>Just a moment while we fetch the delicious details.</p></div> : loadError ? <div className="foodly-orders__state foodly-orders__state--error"><i className="bi bi-cloud-slash" aria-hidden="true" /><h3>That didn’t work.</h3><p>{loadError}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></div> : orders.length === 0 ? <div className="foodly-orders__state"><span className="foodly-orders__empty-icon"><i className="bi bi-receipt" aria-hidden="true" /></span><h3>Your next favorite is waiting.</h3><p>You haven’t placed an order yet. Let’s change that.</p><button type="button" onClick={() => navigate("/explore")}>Explore the menu <i className="bi bi-arrow-right" aria-hidden="true" /></button></div> : <div className="foodly-orders__list">{orders.map((order) => {
          const itemCount = (order.orderedItems || []).filter((item) => item.quantity > 0).reduce((count, item) => count + item.quantity, 0);
          const displayId = String(order.id || "").slice(-8).toUpperCase();
          return <article key={order.id || displayId} className="foodly-order-card"><div className="foodly-order-card__icon"><img src={assets.delivery} alt="" /></div><div className="foodly-order-card__main"><div className="foodly-order-card__meta"><span className={`foodly-status ${getStatusBadge(order.orderStatus)}`}><i className="bi bi-circle-fill" aria-hidden="true" />{order.orderStatus}</span><span>{itemCount} {itemCount === 1 ? "item" : "items"}</span></div><h3>Order <span>#{displayId || "—"}</span></h3><p>Thanks for choosing a good meal today.</p></div><div className="foodly-order-card__amount"><span>Total</span><strong>₹{Number(order.amount || 0).toFixed(2)}</strong></div><div className="foodly-order-card__actions"><button type="button" className="foodly-order-card__details" onClick={() => viewDetails(order)}>View details <i className="bi bi-arrow-up-right" aria-hidden="true" /></button><button type="button" className="foodly-order-card__reorder" onClick={() => reorder(order)}><i className="bi bi-arrow-repeat" aria-hidden="true" /> Reorder</button></div></article>;
        })}</div>}
      </section>

      {selectedOrder && <div className="foodly-order-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedOrder(null); }}><section className="foodly-order-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="order-details-heading"><header className="foodly-order-modal__header"><div><p>ORDER DETAILS</p><h2 id="order-details-heading">Order #{String(selectedOrder.id || "").slice(-8).toUpperCase()}</h2></div><button type="button" onClick={() => setSelectedOrder(null)} aria-label="Close order details"><i className="bi bi-x-lg" aria-hidden="true" /></button></header><div className="foodly-order-modal__body"><div className={`foodly-order-modal__status ${getStatusBadge(selectedOrder.orderStatus)}`}><i className="bi bi-info-circle" aria-hidden="true" /><span><small>Current status</small><strong>{selectedOrder.orderStatus}</strong></span></div><div className="foodly-order-modal__address"><h3><i className="bi bi-geo-alt" aria-hidden="true" /> Delivery address</h3><p>{selectedOrder.userAddress}</p><div><span>Phone</span>{selectedOrder.phoneNumber}</div><div><span>Email</span>{selectedOrder.email}</div></div><div className="foodly-order-modal__items"><h3>Item breakdown</h3><ul>{selectedOrder.orderedItems?.map((item, index) => <li key={`${item.foodId}-${index}`}><span>{item.quantity} × {item.name}</span><strong>₹{(item.price * item.quantity).toFixed(2)}</strong></li>)}</ul></div><dl className="foodly-order-modal__totals"><div><dt>Subtotal</dt><dd>₹{selectedOrder.calculatedFees.subtotal.toFixed(2)}</dd></div><div><dt>Delivery fee</dt><dd>₹{selectedOrder.calculatedFees.shipping.toFixed(2)}</dd></div><div><dt>Tax (10%)</dt><dd>₹{selectedOrder.calculatedFees.tax.toFixed(2)}</dd></div><div className="foodly-order-modal__grand-total"><dt>Grand total</dt><dd>₹{selectedOrder.calculatedFees.total.toFixed(2)}</dd></div></dl></div><footer className="foodly-order-modal__footer">{selectedOrder.orderStatus === "Out for Delivery" && <button type="button" className="foodly-order-modal__track" onClick={() => { setSelectedOrder(null); navigate(`/track/${selectedOrder.id}`); }}><i className="bi bi-geo-alt-fill" aria-hidden="true" /> Track order</button>}<button type="button" className="foodly-order-modal__close" onClick={() => setSelectedOrder(null)}>Done</button></footer></section></div>}
    </main>
  );
};

export default MyOrders;
