import React from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { getToken } from "utils/token";

const PrivateRoute = ({ children }) => {
  const token = getToken();

  const motionConfig = {
    type: "spring",
    damping: 20,
    stiffness: 100,
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  return token ? (
    <motion.div {...motionConfig}>
      {children}
    </motion.div>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
