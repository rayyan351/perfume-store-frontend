import React from "react";
import HeroSection from "../components/HeroSection";
import CollectionSection from "../components/CollectionSection";
import AnimatedSection from "../components/AnimatedSection";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <>
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4 }}
    >
      <HeroSection />
      <AnimatedSection>
      <CollectionSection />
      </AnimatedSection>
      </motion.div>
    </>
  );
};

export default Home;
