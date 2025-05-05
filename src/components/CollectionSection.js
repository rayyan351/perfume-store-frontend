import React from "react";
import perfumes from "../data/perfumes";
import PerfumeCard from "./PerfumeCard";
import "../styles/collection.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CollectionSection = () => {
  return (
    <section className="collection-section">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2>Our Signature Collection</h2>
        <p>Handpicked luxury perfumes curated for excellence</p>
      </motion.div>

      <motion.div
        className="perfume-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
      >
        {perfumes.slice(0, 3).map((perfume) => (
          <PerfumeCard key={perfume.id} perfume={perfume} variant="compact" />
        ))}
      </motion.div>

      <motion.div
        className="cta-container"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Link to="/perfumes" className="btn btn-primary">
          View Full Collection
        </Link>
      </motion.div>
    </section>
  );
};

export default CollectionSection;
