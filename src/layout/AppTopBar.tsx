import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Avatar,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

type Props = {
  logo: string;
  userName: string;
  userEmail: string;
  userInitials: string;
  coreHours?: string;
  onLogout: () => void;
};

export default function AppTopBar({
  logo,
  userName,
  userEmail,
  userInitials,
  coreHours = "0 core-hours used",
  onLogout,
}: Props) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#fff",
        color: "#000",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <Container maxWidth="xxl">
        <Toolbar
          sx={{
            justifyContent: "space-between",
            height: 90,
            minHeight: "90px !important",
            px: 4,
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src={logo}
            alt="Logo"
            onClick={() => navigate("/")}
            sx={{
              height: 60,
              cursor: "pointer",
            }}
          />

          {/* Right Section */}
          <Box display="flex" alignItems="center" gap={2}>
            <Chip label={coreHours} sx={{ fontWeight: 500 }} />

            <IconButton onClick={handleOpen} size="small">
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                }}
              >
                {userInitials}
              </Avatar>
              <ArrowDropDownIcon />
            </IconButton>

            {/* Dropdown */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  mt: 2,
                  borderRadius: 2,
                  minWidth: 260,
                  p: 1,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(0,0,0,0.05)",
                },
              }}
            >
              {/* User Info */}
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{ width: 42, height: 42, bgcolor: "primary.main" }}
                >
                  {userInitials}
                </Avatar>

                <Box>
                  <Typography fontWeight={600} fontSize={14}>
                    {userName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {userEmail}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/");
                }}
                sx={{ borderRadius: 2, mx: 1 }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/");
                }}
                sx={{ borderRadius: 2, mx: 1 }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>

              <Divider sx={{ my: 1 }} />

              <MenuItem
                onClick={() => {
                  handleClose();
                  onLogout();
                }}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  color: "error.main",
                  "&:hover": {
                    bgcolor: "rgba(211,47,47,0.08)",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "error.main" }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
