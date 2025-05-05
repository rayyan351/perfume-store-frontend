import React from "react";
import "../styles/loading.css";

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner" />
    </div>
  );
};

export default LoadingOverlay;
