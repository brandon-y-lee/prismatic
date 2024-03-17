import React from "react";
import { motion } from "framer-motion";

const AnimateRoute = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 100 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimateRoute;
