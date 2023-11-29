import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "components/PageLoader";

import Login from "scenes/login";
import Logout from "scenes/logout";
import Dashboard from "scenes/dashboard";
import Orders from "scenes/orders";
import Error from "scenes/error";

function AppRouter() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>

          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/orders" element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          } />

          <Route path="/logout" element={
            <PrivateRoute>
              <Logout />
            </PrivateRoute>
          } />

          <Route path="*" element={<Error />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AppRouter;