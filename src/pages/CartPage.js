import React from "react";
import { useCart } from "../context/CartContext";
import "../styles/cart.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="cart-page">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => (
       <li key={item.id} className="cart-item">
       <img src={item.image} alt={item.name} />
       <div className="cart-item-details">
         <h3>{item.name}</h3>
         <p>${item.price.toFixed(2)}</p>
     
         <div className="cart-item-controls">
         <div className="quantity-control">
         <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>−</button>
         <span>{item.quantity}</span>
         <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>

           <button onClick={() => removeFromCart(item.id)}>Remove</button>
         </div>
       </div>
        </li>
           ))}
            </ul>
            <h3 className="total">Total: ${total.toFixed(2)}</h3>


            <button
              className="btn-primary"
              onClick={() => navigate("/checkout")}
              style={{ marginTop: "1rem" }}
            >
              Proceed to Checkout
            </button>
              </>
             )}
            </div>
          </motion.div>
            );
            };

export default CartPage;
