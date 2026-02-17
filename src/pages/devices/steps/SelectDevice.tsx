import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import React, { useEffect, useMemo, useState, useCallback, memo } from "react";

type Props = {
  onSelect: (device: Device) => void;
  onBack: () => void;
};

type DeviceCardProps = {
  device: any;
  baseUrl: string;
  onSelect: (device: any) => void;
};

/* =========================
   MEMOIZED DEVICE CARD
========================= */
const DeviceCard = memo(function DeviceCard({
  device,
  baseUrl,
  onSelect,
}: DeviceCardProps) {
  // 🔹 Memoized image URL
  const imageUrl = useMemo(() => {
    return `${baseUrl}/v1/flavors/${device?.flavor}/productimage`;
  }, [baseUrl, device?.flavor]);

  return (
    <Card
      onClick={() => onSelect(device)}
      sx={{
        height: "100%",
        borderRadius: "40px",
        backgroundColor: "#f3f4f6",
        padding: "40px 24px",
        textAlign: "center",
        boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
        },
      }}
    >
      <Box
        sx={{
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Box
          component="img"
          src={imageUrl}
          loading="lazy"
          sx={{
            maxHeight: 130,
            maxWidth: "100%",
            objectFit: "contain",
          }}
        />
      </Box>

      <Typography fontWeight={700} fontSize={16}>
        {device.description || device.name}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Requires {device.quotas?.cores ?? 1} CPU cores
      </Typography>
    </Card>
  );
});

/* =========================
   MAIN COMPONENT
========================= */
export default function SelectDevice({ onSelect, onBack }: Props) {
  const BASE_URL = import.meta.env.VITE_CORELLIUM_BASE;
  const API_KEY = import.meta.env.VITE_CORELLIUM_API_KEY;

  const [devices, setDevices] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!devices.length) return;

    const links: HTMLLinkElement[] = [];

    devices.forEach((device) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = `${BASE_URL}/v1/flavors/${device?.flavor}/productimage`;
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, [devices, BASE_URL]);

  /* =========================
     FETCH DEVICES
  ========================= */
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${BASE_URL}/v1/models`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch models");

        const data = await response.json();

        const filteredData = data.filter((device: any) => !device.peripherals);

        setDevices(filteredData);
      } catch (error) {
        console.error("Models API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [BASE_URL, API_KEY]);

  /* =========================
     STABLE SELECT HANDLER
  ========================= */
  const handleSelect = useCallback(
    (device: any) => {
      onSelect(device);
    },
    [onSelect],
  );

  /* =========================
     FILTERED DEVICES
  ========================= */
  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesFilter =
        filter === "All" || device.type?.toLowerCase() === filter.toLowerCase();

      const matchesSearch =
        device.name?.toLowerCase().includes(search.toLowerCase()) ||
        device.description?.toLowerCase().includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [devices, filter, search]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={6}>
          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Select Device
              </Typography>
              <Typography variant="caption" color="text.secondary">
                * Includes Rapid Start
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                placeholder="Search Devices"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: 260,
                  background: "#fff",
                  borderRadius: 2,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <Stack
                direction="row"
                sx={{
                  background: "#f3f4f6",
                  borderRadius: 2,
                  p: 0.5,
                }}
              >
                {["All", "Android", "IoT"].map((item) => (
                  <Button
                    key={item}
                    size="small"
                    onClick={() => setFilter(item)}
                    sx={{
                      minWidth: 75,
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: 2,
                      background:
                        filter === item ? "primary.main" : "transparent",
                      color: filter === item ? "#1807b4" : "text.primary",
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Box>

          {/* LOADING */}
          {loading && (
            <Box textAlign="center" py={6}>
              <CircularProgress />
            </Box>
          )}

          {/* DEVICE GRID */}
          {!loading && (
            <Grid container spacing={1}>
              {filteredDevices.map((device) => (
                <Grid
                  key={device.name}
                  item
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "49%",
                      md: "24%",
                    },
                  }}
                >
                  <DeviceCard
                    device={device}
                    baseUrl={BASE_URL}
                    onSelect={handleSelect}
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* BACK BUTTON */}
          <Box textAlign="center">
            <Typography
              sx={{
                cursor: "pointer",
                fontWeight: 500,
                "&:hover": {
                  color: "primary.main",
                },
              }}
              onClick={onBack}
            >
              ← Back
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
