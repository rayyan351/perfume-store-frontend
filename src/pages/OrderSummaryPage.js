import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/orderSummary.css";

const OrderSummaryPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.order) {
    return (
      <div className="order-summary">
        <h2>No order found.</h2>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  const { name, email, address, phone, items, total } = state.order;

  return (
<div className="order-summary-page">
  <div className="order-summary-box">
    <h2>🎉 Order Confirmed!</h2>
    <p>Thank you <strong>{name}</strong>, your order has been placed.</p>

    <div className="summary-section">
      <h3>Customer Details</h3>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Phone:</strong> {phone}</p>
    </div>

    <div className="summary-section">
      <h3>Ordered Items</h3>
      <ul className="order-items-list">
        {items.map((item, idx) => (
          <li key={idx}>
            {item.name} × {item.quantity} = ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <div className="total-amount">Total Amount: ${total.toFixed(2)}</div>
    </div>

    <button onClick={() => navigate("/")}>Go Home</button>
  </div>
</div>

  );
};

export default OrderSummaryPage;
