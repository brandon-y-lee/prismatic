import React, { Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import AnimateRoute from "./AnimateRoute";
import PageLoader from "components/PageLoader";

import Layout from "scenes/layout";
import Login from "scenes/login";
import Logout from "scenes/logout";
import Error from "scenes/error";
import Dashboard from "scenes/dashboard";
import Home from "scenes/home";
import Prospects from "scenes/prospects";
import Search from "scenes/search";
import Funds from "scenes/funds";
import Funding from "scenes/funding";

import Network from "scenes/network";
import Developers from "components/network/navigation/Developers";
import Architects from "components/network/navigation/Architects";
import Attorneys from "components/network/navigation/Attorneys";
import CityPlanners from "components/network/navigation/CityPlanners";
import Contractors from "components/network/navigation/Contractors";
import Groups from "components/network/navigation/Groups";
import Events from "components/network/navigation/Events";

import Projects from "scenes/projects";
import Create from "scenes/projects/create";
import View from "scenes/projects/view";
import Overview from "components/projects/overview";
import Zoning from "components/projects/zoning";
import Budget from "components/projects/budget";
import CreateBudget from "components/projects/budget/CreateBudget";
import Crews from "components/projects/crews";
import Crew from "components/projects/crew";
import Timeline from "components/projects/timeline";
import Planning from "components/projects/planning";




function AppRouter() {
  const location = useLocation();

  return (
    <Suspense fallback={<PageLoader />}>
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
            <Route path="/prospects" element={
              <PrivateRoute>
                <Prospects />
              </PrivateRoute>
            } />

            <Route path="/network" element={
              <PrivateRoute>
                <Network />
              </PrivateRoute>
            } />
            <Route path="/network/developers" element={
              <PrivateRoute>
                <Developers />
              </PrivateRoute>
            } />
            <Route path="/network/architects" element={
              <PrivateRoute>
                <Architects />
              </PrivateRoute>
            } />
            <Route path="/network/attorneys" element={
              <PrivateRoute>
                <Attorneys />
              </PrivateRoute>
            } />
            <Route path="/network/city-planners" element={
              <PrivateRoute>
                <CityPlanners />
              </PrivateRoute>
            } />
            <Route path="/network/contractors" element={
              <PrivateRoute>
                <Contractors />
              </PrivateRoute>
            } />
            <Route path="/network/groups" element={
              <PrivateRoute>
                <Groups />
              </PrivateRoute>
            } />
            <Route path="/network/events" element={
              <PrivateRoute>
                <Events />
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
              <Route index element={<AnimateRoute><Overview /></AnimateRoute>} />
              <Route path="zoning" element={<AnimateRoute><Zoning /></AnimateRoute>} />
              <Route path="budget" element={<AnimateRoute><Budget /></AnimateRoute>} />
              <Route path="budget/new" element={<AnimateRoute><CreateBudget /></AnimateRoute>} />
              <Route path="crews" element={<AnimateRoute><Crews /></AnimateRoute>} />
              <Route path="crews/:crewId" element={<AnimateRoute><Crew /></AnimateRoute>} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="planning" element={<Planning />} />
            </Route>

            <Route path="/logout" element={
              <PrivateRoute>
                <Logout />
              </PrivateRoute>
            } />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
    </Suspense>
  );
}

export default AppRouter;