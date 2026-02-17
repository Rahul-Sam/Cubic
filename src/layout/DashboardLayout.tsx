import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Chip,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import AppTopBar from "./AppTopBar";
import logo from "../assets/judge-logo.png";

export default function DashboardLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    console.log("Logout clicked");
    // 👉 Example logout redirect
    navigate("/login");
  };

  return (
    <Box sx={{ minHeight: "100vh" }}>
      {/* ================= App Bar ================= */}
      <AppTopBar
        logo={logo}
        userName="Judge"
        userEmail="mohit@judge.com"
        userInitials="J"
        coreHours="1594 core-hours used"
        onLogout={() => {
          console.log("Logout clicked");
        }}
      />

      {/* ================= Page Content ================= */}
      <Container maxWidth="xxl" sx={{ py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
