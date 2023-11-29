import React from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { getToken } from "utils/token";

const PublicRoute = ({ children }) => {
  const token = getToken();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <motion.div
      initial={{ x: 200 }}
      animate={{ x: 0 }}
      exit={{ scale: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default PublicRoute;
