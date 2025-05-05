import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import perfumes from "../data/perfumes";
import "../styles/productDetails.css";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const perfume = perfumes.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();

  if (!perfume) {
    return <div style={{ padding: "2rem" }}>Perfume not found.</div>;
  }

  const handleBuyNow = () => {
    addToCart(perfume);        
    setTimeout(() => {
      navigate("/checkout");    
    }, 100); 
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="scent-trails">
        <span className="trail trail1"></span>
        <span className="trail trail2"></span>
        <span className="trail trail3"></span>
      </div>

      <div className="product-details glass-panel">
        <motion.img
          src={perfume.image}
          alt={perfume.name}
          className="product-img"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        />
        <motion.div
          className="product-info"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2>{perfume.name}</h2>
          <p className="product-price">${perfume.price}</p>
          <p className="product-description">{perfume.description}</p>

          <div className="notes">
            <p><strong>Top Notes:</strong> {perfume.notes.top}</p>
            <p><strong>Middle Notes:</strong> {perfume.notes.middle}</p>
            <p><strong>Base Notes:</strong> {perfume.notes.base}</p>
          </div>

          <div className="actions">
            <button className="btn-primary" onClick={() => addToCart(perfume)}>Add to Cart</button>
            <button className="btn-secondary" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetailsPage;
