import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "utils/token";
import { Box } from "@mui/material";

const PrivateRoute = ({ children }) => {
  const token = getToken();

  return token ? (<Box>{children}</Box>) : (<Navigate to="/login" />);
};

export default PrivateRoute;
