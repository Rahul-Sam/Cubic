import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Fade,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

function ListDevice() {
  const [balance, setBalance] = useState(120);
  const [screenState, setScreenState] = useState("IDLE");

  const handleSwipe = () => {
    if (screenState !== "IDLE") return;

    if (balance < 45) {
      setScreenState("ERROR");
      setTimeout(() => setScreenState("IDLE"), 2000);
      return;
    }

    setScreenState("DETECTED");

    setTimeout(() => {
      setScreenState("VALIDATING");
    }, 800);

    setTimeout(() => {
      setScreenState("SUCCESS");
      setBalance((prev) => prev - 45);
    }, 2200);

    setTimeout(() => {
      setScreenState("OPEN");
    }, 3200);

    setTimeout(() => {
      setScreenState("IDLE");
    }, 4500);
  };

  const getScreenContent = () => {
    switch (screenState) {
      case "DETECTED":
        return "TAP DETECTED";

      case "VALIDATING":
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography>VALIDATING</Typography>
            <CircularProgress size={20} sx={{ mt: 1 }} />
          </Box>
        );

      case "SUCCESS":
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography fontWeight={600}>SUCCESS</Typography>
            <CheckCircleIcon sx={{ color: "#2e7d32", fontSize: 32, mt: 1 }} />
          </Box>
        );

      case "OPEN":
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography fontWeight={600}>OPEN GATE</Typography>
            <CheckCircleIcon sx={{ color: "#2e7d32", fontSize: 32, mt: 1 }} />
          </Box>
        );

      case "ERROR":
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography fontWeight={600}>INSUFFICIENT BALANCE</Typography>
            <ErrorIcon sx={{ color: "#d32f2f", fontSize: 32, mt: 1 }} />
          </Box>
        );

      default:
        return "Tap Below";
    }
  };

  const getScreenColor = () => {
    if (screenState === "SUCCESS" || screenState === "OPEN") return "#2e7d32";
    if (screenState === "ERROR") return "#d32f2f";
    return "#1f4f82";
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        background:
          "linear-gradient(135deg,#e9eef6 0%,#dde5f3 50%,#d5def0 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "1500px",
          gap: 8,
        }}
      >
        {/* LEFT CARD */}
        <Paper
          elevation={2}
          sx={{
            width: "50%",
            borderRadius: 3,
            position: "relative",
            p: 5,
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(6px)",
            border: "1px solid #c7d4ea",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              position: "absolute",
              top: -20,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#2b6cb0",
              px: 6,
              py: 1.2,
              borderRadius: 2,
            }}
          >
            <Typography color="#fff" fontWeight={600} fontSize={18}>
              Validator
            </Typography>
          </Box>

          {/* Device */}
          <Box sx={{ position: "relative", width: 380 }}>
            <Box component="img" src="/device.png" sx={{ width: "100%" }} />

            {/* SCREEN OVERLAY */}
            <Box
              sx={{
                position: "absolute",
                top: "53px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "270px",
                height: "150px",
                background: "#ffffff",
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Fade in key={screenState} timeout={300}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: getScreenColor(),
                  }}
                >
                  {getScreenContent()}
                </Typography>
              </Fade>
            </Box>

            {/* Diamond Button */}
            <Box
              onClick={handleSwipe}
              sx={{
                position: "absolute",
                top: "65%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(45deg)",
                width: 130,
                height: 130,
                borderRadius: 3,
                background: "linear-gradient(145deg,#5fa8ff,#1f5fae)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 18px 35px rgba(0,0,0,0.35)",
                transition: "0.25s",
                "&:hover": {
                  transform: "translate(-50%, -50%) rotate(45deg) scale(1.05)",
                },
              }}
            >
              <Box sx={{ transform: "rotate(-45deg)" }}>
                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 18,
                  }}
                >
                  Tap Here
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* RIGHT CARD */}
        <Paper
          elevation={2}
          sx={{
            width: "50%",
            borderRadius: 3,
            p: 6,
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(6px)",
            border: "1px solid #c7d4ea",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              fontWeight: 600,
              fontSize: 20,
              color: "#1f4f82",
              mb: 2,
            }}
          >
            Fare Details
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box display="flex" flexDirection="column" gap={4}>
            <Row icon={<ArrowBackIcon />} label="From:" value="Central" />
            <Row icon={<ArrowForwardIcon />} label="To:" value="Airport" />
            <Row icon={<LocationOnIcon />} label="Distance:" value="18 km" />
            <Row icon={<DirectionsCarIcon />} label="Fare:" value="$45" />
            <Row
              icon={<AccountBalanceWalletIcon />}
              label="Previous Balance:"
              value="$120"
            />
            <Row
              icon={<PaymentsIcon />}
              label="Remaining Balance:"
              value={`$${balance}`}
              bold
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

const Row = ({ icon, label, value, bold = false }: any) => (
  <Box display="flex" alignItems="center" gap={2}>
    <Box sx={{ color: "#1f4f82" }}>{icon}</Box>
    <Typography sx={{ fontWeight: 500 }}>{label}</Typography>
    <Typography
      sx={{
        fontWeight: bold ? 600 : 400,
        color: "#1f4f82",
      }}
    >
      {value}
    </Typography>
  </Box>
);

export default ListDevice;
