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
import CreateBudget from "components/projects/CreateBudget";
import Scope from "components/projects/Scope";
import Budget from "components/projects/Budget";
import Crews from "components/projects/crews";
import Crew from "components/projects/crew";
import Timeline from "components/projects/timeline/Timeline";


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
            <Route path="/projects/view/:id" element={<PrivateRoute><View /></PrivateRoute>}>
              <Route index element={<Scope />} />
              <Route path="budget" element={<Budget />} />
              <Route path="budget/new" element={<CreateBudget />} />
              <Route path="crews" element={<Crews />} />
              <Route path="crews/:crewId" element={<Crew />} />
              <Route path="team" element={<Crew />} />
              <Route path="team/new" element={<Crew />} />
              <Route path="timeline" element={<Timeline />} />
            </Route>

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