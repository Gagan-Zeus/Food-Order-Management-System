import { useContext, useRef, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals, getCartItemCount } from "../../util/cartUtils";
import api from "../../api/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { STATE_CITY_DATA, STATES } from "../../util/stateCityData";

const PlaceOrder = () => {
  const { foodList, quantities, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const paymentStatusReported = useRef(false);
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phoneNumber: "", address: "", state: "", city: "", zip: "",
  });

  const cartItems = foodList.filter((food) => quantities[food.id] > 0);
  const itemCount = getCartItemCount(cartItems, quantities);
  const { subtotal, shipping, tax, total } = calculateCartTotals(cartItems, quantities);
  const availableCities = data.state ? STATE_CITY_DATA[data.state] || [] : [];

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value, ...(name === "state" ? { city: "" } : {}) }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!window.Razorpay) {
      toast.error("Razorpay is not loaded. Please refresh the page.");
      return;
    }

    setIsSubmitting(true);
    paymentStatusReported.current = false;
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        foodId: item.id,
        quantity: quantities[item.id],
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        category: item.category,
      })),
    };

    try {
      const response = await api.post("/orders/create-payment-order", orderData);
      const paymentOrder = response.data;
      if (!paymentOrder?.razorpayOrderId || !paymentOrder?.keyId) {
        setIsSubmitting(false);
        toast.error("Unable to create payment order.");
        return;
      }

      const reportPaymentStatus = async (status) => {
        if (paymentStatusReported.current) return;
        paymentStatusReported.current = true;
        try {
          await api.post("/orders/cancel-payment", {
            orderId: paymentOrder.orderId,
            razorpayOrderId: paymentOrder.razorpayOrderId,
            status,
          });
          if (status === "cancelled") {
            toast.info("Payment cancelled. You can try again whenever you're ready.");
          }
        } catch (error) {
          paymentStatusReported.current = false;
          console.error("Could not update payment status:", error.response?.data || error.message);
          toast.error("We could not update the payment status. Please refresh your orders.");
        } finally {
          setIsSubmitting(false);
        }
      };

      const razorpay = new window.Razorpay({
        key: paymentOrder.keyId,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
         name: "MasalaBox",
        description: "Food order payment",
        order_id: paymentOrder.razorpayOrderId,
        prefill: { name: `${data.firstName} ${data.lastName}`.trim(), email: data.email, contact: data.phoneNumber },
        notes: { orderId: paymentOrder.orderId },
        theme: { color: "#f0443d" },
        modal: { ondismiss: () => { void reportPaymentStatus("cancelled"); } },
        handler: async (paymentResponse) => {
          try {
            await api.post("/orders/confirm", {
              orderId: paymentOrder.orderId,
              razorpayOrderId: paymentResponse.razorpay_order_id,
              razorpayPaymentId: paymentResponse.razorpay_payment_id,
              razorpaySignature: paymentResponse.razorpay_signature,
            });
            clearCart();
            toast.success("Payment successful!");
            navigate("/myorders");
          } catch (error) {
            console.error("Razorpay payment verification failed:", error.response?.data || error.message);
            toast.error("Payment was received but could not be verified.");
          } finally {
            setIsSubmitting(false);
          }
        },
      });

      razorpay.on("payment.failed", (paymentError) => {
        void reportPaymentStatus("failed");
        toast.error(paymentError.error?.description || "Razorpay payment failed.");
      });
      razorpay.open();
    } catch (error) {
      console.error("Order error:", error.response?.data || error.message);
      setIsSubmitting(false);
      toast.error("Unable to place order. Please try again");
    }
  };

  return (
    <main className="foodly-checkout">
      <header className="foodly-checkout__header">
        <Link className="foodly-checkout__logo" to="/"><img src={assets.logo} alt="MasalaBox home" /></Link>
        <div>
          <p className="foodly-checkout__eyebrow">ALMOST THERE</p>
          <h1>Make it yours<span>.</span></h1>
          <p>Tell us where to bring the good stuff.</p>
        </div>
        <Link className="foodly-checkout__back" to="/cart"><i className="bi bi-arrow-left" aria-hidden="true" /> Back to cart</Link>
      </header>

      <div className="foodly-checkout__layout">
        <section className="foodly-checkout__form-panel" aria-labelledby="delivery-heading">
          <div className="foodly-checkout__section-heading">
            <span className="foodly-checkout__step">01</span>
            <div><h2 id="delivery-heading">Delivery details</h2><p>Where should we send your order?</p></div>
          </div>
          <form onSubmit={onSubmitHandler}>
            <div className="foodly-checkout__fields foodly-checkout__fields--two">
              <label>First name<input type="text" name="firstName" placeholder="Aarav" required value={data.firstName} onChange={onChangeHandler} /></label>
              <label>Last name<input type="text" name="lastName" placeholder="Sharma" required value={data.lastName} onChange={onChangeHandler} /></label>
            </div>
            <div className="foodly-checkout__fields foodly-checkout__fields--two">
              <label>Email address<input type="email" name="email" placeholder="you@example.com" required value={data.email} onChange={onChangeHandler} /></label>
              <label>Phone number<input type="tel" name="phoneNumber" inputMode="tel" placeholder="10 digit number" required value={data.phoneNumber} onChange={onChangeHandler} /></label>
            </div>
            <label>Street address<input type="text" name="address" placeholder="House number, street, apartment..." required value={data.address} onChange={onChangeHandler} /></label>
            <div className="foodly-checkout__fields foodly-checkout__fields--three">
              <label>State<select name="state" required value={data.state} onChange={onChangeHandler}><option value="">Choose state</option>{STATES.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>
              <label>City<select name="city" required value={data.city} onChange={onChangeHandler} disabled={!data.state}><option value="">{data.state ? "Choose city" : "Select state"}</option>{availableCities.map((city) => <option key={city} value={city}>{city}</option>)}</select></label>
              <label>ZIP code<input type="text" name="zip" inputMode="numeric" placeholder="700001" required value={data.zip} onChange={onChangeHandler} /></label>
            </div>
            <div className="foodly-checkout__payment-note"><i className="bi bi-shield-check" aria-hidden="true" /><span><strong>Safe and sound.</strong> You’ll complete payment securely with Razorpay.</span></div>
            <button className="foodly-checkout__submit" type="submit" disabled={cartItems.length === 0 || isSubmitting}>{isSubmitting ? <><span className="foodly-checkout__spinner" aria-hidden="true" /> Opening secure checkout...</> : <>Continue to payment <i className="bi bi-arrow-right" aria-hidden="true" /></>}</button>
          </form>
        </section>

        <aside className="foodly-checkout__summary" aria-labelledby="checkout-summary-heading">
          <div className="foodly-checkout__summary-top"><h2 id="checkout-summary-heading">Your order</h2><span>{itemCount} {itemCount === 1 ? "item" : "items"}</span></div>
          {cartItems.length === 0 ? <div className="foodly-checkout__summary-empty"><i className="bi bi-bag" aria-hidden="true" /><p>Your cart is empty.</p><Link to="/explore">Explore the menu</Link></div> : <ul className="foodly-checkout__order-list">{cartItems.map((item) => <li key={item.id}><span><strong>{item.name}</strong><small>Qty {quantities[item.id]}</small></span><b>₹{(item.price * quantities[item.id]).toFixed(2)}</b></li>)}</ul>}
          <dl className="foodly-checkout__totals"><div><dt>Subtotal</dt><dd>₹{subtotal.toFixed(2)}</dd></div><div><dt>Delivery fee</dt><dd>₹{shipping.toFixed(2)}</dd></div><div><dt>Tax (10%)</dt><dd>₹{tax.toFixed(2)}</dd></div><div className="foodly-checkout__total"><dt>Total <small>INR</small></dt><dd>₹{total.toFixed(2)}</dd></div></dl>
          <p className="foodly-checkout__no-discount"><i className="bi bi-stars" aria-hidden="true" /> Freshly calculated from your order</p>
        </aside>
      </div>
    </main>
  );
};

export default PlaceOrder;
