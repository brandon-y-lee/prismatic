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
import Funds from "scenes/funds";
import Funding from "scenes/funding";
import Projects from "scenes/projects";
import Create from "scenes/projects/create";
import View from "scenes/projects/view";
import CreateProject from "scenes/projects/CreateProject";
import ViewProject from "scenes/projects/ViewProject";
import UpdateProject from "scenes/projects/UpdateProject";


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
            <Route path="/projects" element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            } />
            <Route path="/projects/create" element={
              <PrivateRoute>
                <Create />
              </PrivateRoute>
            } />
            <Route path="/projects/view/:id" element={
              <PrivateRoute>
                <View />
              </PrivateRoute>
            } />
            <Route path="/projects/update/:id" element={
              <PrivateRoute>
                <UpdateProject />
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