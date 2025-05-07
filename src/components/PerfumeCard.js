import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import "../styles/perfumeCard.css";

const PerfumeCard = ({ perfume, variant = "full" }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addToCart(perfume);
    navigate("/checkout");
  };

  return (
    <motion.div
      className={`perfume-card ${variant}`}
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link to={`/perfumes/${perfume.id}`} className="card-link">
      <div className="perfume-img-container">
        <img src={perfume.image} alt={perfume.name} className="perfume-img" /></div>
        <h3>{perfume.name}</h3>
        <p>${perfume.price}</p>
      </Link>

      {variant === "full" && (
        <div className="card-actions">
          <button className="btn-primary" onClick={() => addToCart(perfume)}>
            Add to Cart
          </button>
          <button className="btn-secondary" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PerfumeCard;
