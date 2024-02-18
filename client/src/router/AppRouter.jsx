import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "components/PageLoader";

import Layout from "scenes/layout";
import Login from "scenes/login";
import Logout from "scenes/logout";
import Error from "scenes/error";
import Dashboard from "scenes/dashboard";
import Home from "scenes/home";
import Search from "scenes/search";
import Orders from "scenes/orders";
import ViewOrder from "scenes/orders/ViewOrder";
import CreateOrder from "scenes/orders/CreateOrder";
import UpdateOrder from "scenes/orders/UpdateOrder";
import Funds from "scenes/funds";
import Funding from "scenes/funding";

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
          <Route element={<Layout />}>
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
            <Route path="/home" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } />
            <Route path="/search/loading" element={
              <PrivateRoute>
                <Search isLoading={true} />
              </PrivateRoute>
            } />
            <Route path="/search/:id" element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            } />
            <Route path="/funds" element={
              <PrivateRoute>
                <Funds />
              </PrivateRoute>
            } />
            <Route path="/funding" element={
              <PrivateRoute>
                <Funding />
              </PrivateRoute>
            } />
            <Route path="/orders" element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            } />
            <Route path="/orders/create" element={
              <PrivateRoute>
                <CreateOrder />
              </PrivateRoute>
            } />
            <Route path="/orders/view/:id" element={
              <PrivateRoute>
                <ViewOrder />
              </PrivateRoute>
            } />
            <Route path="/orders/update/:id" element={
              <PrivateRoute>
                <UpdateOrder />
              </PrivateRoute>
            } />
            <Route path="/logout" element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            } />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default AppRouter;