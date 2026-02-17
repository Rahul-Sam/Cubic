import React from "react";
import { Box, IconButton, Tooltip, Avatar } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import WifiIcon from "@mui/icons-material/Wifi";
import MemoryIcon from "@mui/icons-material/Memory";
import ScienceIcon from "@mui/icons-material/Science";
import { NavLink } from "react-router-dom";

const navItems = [
  { icon: <LinkIcon />, path: "#", label: "Link" },
  { icon: <WifiIcon />, path: "#", label: "Wifi" },
  { icon: <MemoryIcon />, path: "#", label: "Device" },
  { icon: <ScienceIcon />, path: "#", label: "Lab" },
];

export default function LeftSidebar() {
  return (
    <Box
      sx={{
        width: 90,
        // height: "100vh",
        background: "linear-gradient(180deg,#eef3f9,#e3ecf7)",
        borderRight: "1px solid #dde6f1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 3,
      }}
    >
      {/* Logo */}

      {/* Nav Icons */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "center",
        }}
      >
        {navItems.map((item, index) => (
          <Tooltip title={item.label} placement="right" key={index}>
            <IconButton
              component={NavLink}
              to={item.path}
              sx={{
                width: 56,
                height: 56,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                color: "#4b5563",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "all .25s ease",

                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  backgroundColor: "#f0f6ff",
                },

                "&.active": {
                  background: "linear-gradient(145deg,#1f5fae,#0d3b66)",
                  color: "#fff",
                  boxShadow: "0 8px 18px rgba(13,59,102,0.35)",
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
