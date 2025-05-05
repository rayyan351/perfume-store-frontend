import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/hero.css";

const HeroSection = () => {
  return (
    <section className="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Discover Timeless Luxury
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Crafted aromas for those who dare to stand out
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
         <div className="hero-buttons">
        <Link to="/perfumes" className="btn btn-primary">Explore Collection</Link>
        <Link to="/contact" className="btn btn-secondary adjust-btn">Get in Touch</Link>
       </div>


        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
