import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppTopBar from "./AppTopBar";
import LeftSidebar from "./LeftSidebar";
import logo from "../assets/judge-logo.png";

export default function LeftNavLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top App Bar */}
      <AppTopBar
        logo={logo}
        userName="Judge"
        userEmail="admin@judge.com"
        userInitials="J"
        coreHours="1594 core-hours used"
        onLogout={() => {
          console.log("Logout clicked");
        }}
      />

      {/* Sidebar + Content Section */}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        
        {/* Left Sidebar */}

        {/* <LeftSidebar /> */}

        {/* Main Content */}
        <Box
          sx={{
            flexGrow: 1,
            //background: "linear-gradient(90deg, #eef2f7, #e6ecf5)",
            p: 3,
          }}
        >
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
}
