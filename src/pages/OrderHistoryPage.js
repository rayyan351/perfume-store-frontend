import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/orderHistory.css";

const OrderHistoryPage = () => {
  const { auth } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!auth || !auth.token) return; // ✅ Prevent fetch after logout

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders/my-orders", {
          headers: {
            Authorization: auth.token,
          },
        });
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        alert("Failed to load order history");
      }
    };

    fetchOrders();
  }, [auth]);

  if (!auth) {
    return (
      <div className="order-history">
        <h2>Your Order History</h2>
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <div><strong>Date:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</div>
              <div>
                <strong>Total:</strong> ${typeof order.total === "number" ? order.total.toFixed(2) : "0.00"}
              </div>
              <div><strong>Items:</strong></div>
              <ul>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <li key={`${item.name}-${index}`}>
                      {item.name} × {item.quantity}
                    </li>
                  ))
                ) : (
                  <li>No items found</li>
                )}
              </ul>
              <div><strong>Status:</strong> {order.status || "Confirmed"}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistoryPage;
