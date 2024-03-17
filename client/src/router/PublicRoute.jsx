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
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
    >
      {children}
    </motion.div>
  );
};

export default PublicRoute;
