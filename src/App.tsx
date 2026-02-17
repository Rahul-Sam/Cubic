import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

import DashboardLayout from "./layout/DashboardLayout";
import LeftNavLayout from "./layout/LeftNavLayout";
import Settings from "./pages/viewDevice/Setting";


import "./App.css";

/* -------------------- Lazy Load Pages -------------------- */
const DashboardPage = lazy(() => import("./pages/dashboard/DashboardPage"));
const AddDevice = lazy(() => import("./pages/devices"));
const ListDevice = lazy(() => import("./pages/viewDevice"));


/* -------------------- Loader Component -------------------- */
function Loader() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <CircularProgress size={50} />
    </Box>
  );
}

/* -------------------- App Component -------------------- */
export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* First Layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="devices" element={<AddDevice />} />
          <Route path="setting" element={<Settings />} />
        </Route>

        {/* Second Layout with Left Nav */}
        <Route path="/view" element={<LeftNavLayout />}>
          <Route index element={<ListDevice />} />
          <Route path=":id" element={<ListDevice />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
