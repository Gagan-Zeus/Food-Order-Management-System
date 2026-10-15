import React, { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { assets } from "../../assets/assests";
import api from "../../api/axiosConfig";
import { toast } from "react-toastify";

const statusClass = (status) => ({
  Paid: "status-badge",
  "Food Preparing": "status-badge status-badge--preparing",
  "Out for Delivery": "status-badge status-badge--delivery",
  Delivered: "status-badge status-badge--delivered",
  "Payment Cancelled": "status-badge status-badge--cancelled",
  "Payment Failed": "status-badge status-badge--failed",
}[status] || "status-badge");

const paymentTerminalStatuses = new Set(["Payment Cancelled", "Payment Failed"]);

const Orders = () => {
  const [data, setData] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/orders/all");
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders. Check login status.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const viewCustomerDetails = (order) => {
    const parts = (order.userAddress || "").split(",");
    const name = parts[0]?.trim() || "N/A";
    const address = parts.length > 1 ? parts.slice(1).join(",").trim() : order.userAddress || "N/A";
    setSelectedCustomer({
      name,
      address,
      phone: order.phoneNumber || "N/A",
      email: order.email || "N/A",
    });
  };

  useEffect(() => {
    if (!selectedCustomer) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedCustomer(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedCustomer]);

  const updateStatus = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await api.patch(`/orders/status/${orderId}`, { status: newStatus });
      if (response.status === 200) await fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => { void fetchOrders(); }, [fetchOrders]);

  return (
    <div>
      <div className="page-heading"><div><p className="eyebrow">Keep things moving</p><h1>Orders</h1><p>Stay close to every meal on its way to someone.</p></div><div className="orders-heading-actions"><span className="orders-live"><i className="bi bi-list-check" aria-hidden="true" /> Order queue</span></div></div>
      <section className="admin-panel orders-panel">
        <div className="panel-heading"><div><h2>Recent orders</h2><p>Review details and update the order journey as it happens.</p></div><span className="panel-step">04</span></div>
        {isLoading ? <div className="empty-state"><div className="empty-state-icon"><i className="bi bi-arrow-repeat spin" aria-hidden="true" /></div><h3>Loading recent orders</h3><p>We’re checking what’s cooking.</p></div> : data.length === 0 ? <div className="empty-state"><div className="empty-state-icon"><i className="bi bi-bag-heart" aria-hidden="true" /></div><h3>No orders just yet</h3><p>New orders will appear here when customers start ordering from your menu.</p></div> : <div className="table-scroll"><table className="admin-table order-table"><thead><tr><th>Order</th><th>Order details</th><th>Amount</th><th>Items</th><th>Update status</th><th>Current status</th></tr></thead><tbody>
          {data.map((order, index) => { const items = order.orderedItems?.filter((item) => item.quantity > 0) || []; const itemCount = items.reduce((count, item) => count + (Number(item.quantity) || 0), 0); const isPaymentTerminal = paymentTerminalStatuses.has(order.orderStatus); return <tr key={order.id || index}><td><div className="order-details"><span className="order-icon"><img src={assets.parcel} alt="" /></span><span><strong className="order-id">#{String(order.id || index + 1).slice(-6)}</strong><small className="order-count">Customer order</small></span></div></td><td><div className="order-items">{items.map((item) => `${item.name} × ${item.quantity}`).join(", ") || "No items listed"}</div><button type="button" className="customer-link" onClick={() => viewCustomerDetails(order)}>View customer details <i className="bi bi-arrow-up-right" aria-hidden="true" /></button></td><td className="price-cell">₹{Number(order.amount || 0).toFixed(2)}</td><td><span className="order-count">{itemCount} {itemCount === 1 ? "item" : "items"}</span></td><td><select className="status-select" onChange={(event) => updateStatus(event, order.id)} value={order.orderStatus} disabled={isPaymentTerminal}>{isPaymentTerminal && <option value={order.orderStatus} disabled>{order.orderStatus}</option>}<option value="Paid">Paid</option><option value="Food Preparing">Food Preparing</option><option value="Out for Delivery">Out for Delivery</option><option value="Delivered">Delivered</option></select></td><td><span className={statusClass(order.orderStatus)}>{order.orderStatus}</span></td></tr>; })}
        </tbody></table></div>}
      </section>

      {selectedCustomer &&
        createPortal(
          <div
            className="admin-modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="customerModalLabel"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCustomer(null);
            }}
          >
            <div className="admin-modal-dialog">
              <div className="admin-modal-header">
                <div>
                  <p className="eyebrow">Customer overview</p>
                  <h3 id="customerModalLabel">Customer details</h3>
                </div>
                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setSelectedCustomer(null)}
                  aria-label="Close customer details"
                >
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              <div className="admin-modal-body">
                <div className="customer-info-card">
                  <div className="customer-avatar" aria-hidden="true">
                    <i className="bi bi-person-fill" />
                  </div>
                  <div className="customer-primary">
                    <h4>{selectedCustomer.name}</h4>
                    <span className="customer-badge">
                      <i className="bi bi-patch-check-fill" aria-hidden="true" />
                      Verified customer
                    </span>
                  </div>
                </div>

                <div className="customer-meta-grid">
                  <div className="customer-meta-item">
                    <span className="meta-icon" aria-hidden="true">
                      <i className="bi bi-envelope-fill" />
                    </span>
                    <div>
                      <label>Email address</label>
                      <strong title={selectedCustomer.email}>{selectedCustomer.email || "N/A"}</strong>
                    </div>
                  </div>

                  <div className="customer-meta-item">
                    <span className="meta-icon" aria-hidden="true">
                      <i className="bi bi-telephone-fill" />
                    </span>
                    <div>
                      <label>Phone number</label>
                      <strong title={selectedCustomer.phone}>{selectedCustomer.phone || "N/A"}</strong>
                    </div>
                  </div>
                </div>

                <div className="customer-address-box">
                  <div className="address-header">
                    <span className="meta-icon" aria-hidden="true">
                      <i className="bi bi-geo-alt-fill" />
                    </span>
                    <div>
                      <label>Delivery location</label>
                      <p>{selectedCustomer.address || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-button button-outline"
                  onClick={() => setSelectedCustomer(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
export default Orders;
