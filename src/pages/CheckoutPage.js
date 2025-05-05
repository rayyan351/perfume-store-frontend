import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";
import { motion } from "framer-motion";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (!auth) {
      alert("You must be logged in to checkout.");
      navigate("/login");
    }
  }, [auth, navigate]);

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const validate = () => {
    const newErrors = {};
    const { name, email, address, phone } = formData;

    if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = "Name must contain only letters and spaces.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!address.trim()) {
      newErrors.address = "Address cannot be empty.";
    }
    
    if (!/^\d*$/.test(phone)) {
      newErrors.phone = "Phone number must contain digits only.";
    } else if (phone.length !== 11) {
      newErrors.phone = "Phone number must be exactly 11 digits long.";
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleOrder = async () => {
    if (!validate()) return;

    const orderData = {
      ...formData,
      items: cartItems,
      total,
    };

    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return alert(data.message || "Order failed");
      }

      setTimeout(() => {
        clearCart();
        navigate("/order-summary", {
          state: { order: orderData },
        });
      }, 1500);
    } catch (err) {
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="checkout-page">
        {loading && (
          <div className="full-loader">
            <div className="loader-spinner"></div>
            <p>Placing your order...</p>
          </div>
        )}

        <h2>Checkout</h2>
        <div className="checkout-container">
          <form className="checkout-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="auth-msg error">{errors.name}</p>}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="auth-msg error">{errors.email}</p>}

            <input
              type="text"
              name="address"
              placeholder="Shipping Address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="auth-msg error">{errors.address}</p>}

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="auth-msg error">{errors.phone}</p>}
          </form>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <ul>
              {cartItems.map((item) => (
                <li key={item.id}>
                  {item.name} × {item.quantity} = ${item.price * item.quantity}
                </li>
              ))}
            </ul>
            <h4>Total: ${total.toFixed(2)}</h4>
            <button className="btn-primary" onClick={handleOrder} disabled={loading}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;
