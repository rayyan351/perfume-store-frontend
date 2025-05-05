import React, { useState } from "react";
import { motion } from "framer-motion";
import perfumes from "../data/perfumes";
import PerfumeCard from "../components/PerfumeCard";
import "../styles/collection.css";

const PerfumesPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(1000);
  const [minRating, setMinRating] = useState(0);

  const filteredPerfumes = perfumes.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    const matchesPrice = p.price <= maxPrice;
    const matchesRating = p.rating >= minRating;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="collection-section">
        <h2>All Perfumes</h2>
        <p>Explore our complete luxury fragrance range</p>

        <input
          type="text"
          className="search-input"
          placeholder="Search perfumes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-bar">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Oud">Oud</option>
            <option value="Floral">Floral</option>
            <option value="Citrus">Citrus</option>
            <option value="Woody">Woody</option>
          </select>

          <input
            type="range"
            min="0"
            max="1000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
          <span>Max Price: ${maxPrice}</span>

          <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
            <option value={0}>Any Rating</option>
            <option value={3}>3★ & up</option>
            <option value={4}>4★ & up</option>
            <option value={4.5}>4.5★ & up</option>
          </select>
        </div>

        {filteredPerfumes.length > 0 ? (
          <div className="perfume-grid">
            {filteredPerfumes.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} variant="full" />
            ))}
          </div>
        ) : (
          <p style={{ marginTop: "2rem", color: "#999" }}>
            No perfumes found matching your filters.
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default PerfumesPage;
