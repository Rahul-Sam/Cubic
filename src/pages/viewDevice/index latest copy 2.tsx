import { useEffect, useMemo, useRef, useState } from "react";

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
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SouthIcon from "@mui/icons-material/South";

///
import mqtt from "mqtt";

// import bg from "./assets/bg.png";
// import deviceImg from "./assets/device.png";
// import logo from "./assets/judge-logo.png";
import "./App.css";

import RealTerminal from "./terminal";

const DEFAULT_FROM = "Central";
const DEFAULT_TO = "Airport";
const DEFAULT_DISTANCE = 18;
const DEFAULT_READER = "BUS_12";

const CARD_PRESETS = [
  { label: "Valid Card (GO)", uid: "04A1B2C3D4" },
  { label: "Blocked Card (DENIED)", uid: "04DEADBEEF01" },
  { label: "Low Balance (DENIED)", uid: "0433CCDD9911" },
];

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

// WebAudio tones (no mp3 needed)
function playTone(type = "go") {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.connect(g);
    g.connect(ctx.destination);

    const t0 = ctx.currentTime;

    if (type === "go") {
      o.type = "sine";
      o.frequency.setValueAtTime(880, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);

      o.frequency.setValueAtTime(1320, t0 + 0.14);
      g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.16);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
    } else {
      o.type = "square";
      o.frequency.setValueAtTime(220, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
    }

    o.start();
    o.stop(t0 + 0.35);
    o.onended = () => ctx.close();
  } catch {
    // ignore autoplay blocks
  }
}
///

function ListDevice() {
  ////

  const WS_URL = import.meta.env.VITE_MQTT_WS || "ws://164.52.219.33:9001";
  const REQ_TOPIC = import.meta.env.VITE_REQ_TOPIC || "motu/tap/request";
  const RESP_TOPIC = import.meta.env.VITE_RESP_TOPIC || "motu/tap/response";

  const [connected, setConnected] = useState(false);
  const [uid, setUid] = useState(CARD_PRESETS[0].uid);

  // READY | GO | DENIED
  const [screen, setScreen] = useState("READY");
  const [resp, setResp] = useState(null);

  // ripple trigger
  const [rippleKey, setRippleKey] = useState(0);

  // history
  const [history, setHistory] = useState([]);

  const clientRef = useRef(null);
  const resetTimerRef = useRef(null);

  const clearResetTimer = () => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  const armAutoReset = () => {
    clearResetTimer();
    resetTimerRef.current = setTimeout(() => {
      setScreen("READY");
      setResp(null);
    }, 3000);
  };

  useEffect(() => {
    const c = mqtt.connect(WS_URL, {
      reconnectPeriod: 1000,
      connectTimeout: 5000,
      clean: true,
    });

    clientRef.current = c;

    c.on("connect", () => {
      setConnected(true);
      c.subscribe(RESP_TOPIC, { qos: 1 });
    });

    c.on("reconnect", () => setConnected(false));
    c.on("close", () => setConnected(false));
    c.on("offline", () => setConnected(false));
    c.on("error", () => setConnected(false));

    c.on("message", (topic, payload) => {
      if (topic !== RESP_TOPIC) return;
      try {
        const data = JSON.parse(payload.toString());
        setResp(data);

        const nextScreen = data.decision === "GO" ? "GO" : "DENIED";
        setScreen(nextScreen);

        playTone(nextScreen === "GO" ? "go" : "denied");

        setHistory((prev) => {
          const item = {
            ts: data.ts,
            uid: data.uid,
            decision: data.decision,
            trip_state: data.trip_state,
            fare: data.fare,
            remaining_balance: data.remaining_balance,
            reason: data.reason,
            request_id: data.request_id,
          };
          return [item, ...prev].slice(0, 10);
        });

        armAutoReset();
      } catch {
        // ignore
      }
    });

    return () => {
      clearResetTimer();
      c.end(true);
    };
  }, [WS_URL, RESP_TOPIC]);

  const publishTap = () => {
    if (!clientRef.current) return;

    setRippleKey((k) => k + 1);

    const payload = {
      uid,
      from: DEFAULT_FROM,
      to: DEFAULT_TO,
      distance_km: DEFAULT_DISTANCE,
      reader_id: DEFAULT_READER,
      ts: nowTs(),
    };

    clientRef.current.publish(REQ_TOPIC, JSON.stringify(payload), { qos: 1 });
  };

  const fareDetails = useMemo(() => {
    const d = resp || {};
    return {
      from: d.from ?? DEFAULT_FROM,
      to: d.to ?? DEFAULT_TO,
      distance_km: d.distance_km ?? DEFAULT_DISTANCE,
      fare: d.fare ?? 0,
      prev_balance: d.prev_balance ?? 0,
      remaining_balance: d.remaining_balance ?? 0,
      trip_state: d.trip_state ?? "—",
      reason: d.reason ?? "—",
      request_id: d.request_id ?? "—",
      device_ip: d.device_ip ?? "—",
      validator_version: d.validator_version ?? "—",
      latency_ms: d.latency_ms ?? "—",
      message: d.message ?? "",
      decision: d.decision ?? "",
      uid: d.uid ?? uid,
    };
  }, [resp, uid]);

  const displayTitle =
    screen === "GO" ? "GO" : screen === "DENIED" ? "DENIED" : "Tap Below";

  const displaySub =
    screen === "GO"
      ? fareDetails.message || "Amount detected"
      : screen === "DENIED"
        ? fareDetails.message || "Denied"
        : "Tap your card on reader";
  ///
  const [balance, setBalance] = useState(120);
  const [screenState, setScreenState] = useState("IDLE");

  const isProcessing = screenState !== "IDLE";

  const handleSwipe = () => {
    if (screenState !== "IDLE") return;

    if (balance < 45) {
      setScreenState("ERROR");
      setTimeout(() => setScreenState("IDLE"), 4000);
      return;
    }

    setScreenState("DETECTED");

    setTimeout(() => {
      setScreenState("VALIDATING");
    }, 1000);

    setTimeout(() => {
      setScreenState("SUCCESS");
      setBalance((prev) => prev - 45);
    }, 2500);

    setTimeout(() => {
      setScreenState("OPEN");
    }, 3500);

    setTimeout(() => {
      setScreenState("IDLE");
    }, 5000);
  };

  const getScreenContent = () => {
    switch (screenState) {
      case "DETECTED":
        return "TAP DETECTED";

      case "VALIDATING":
        return (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography fontWeight={600}>VALIDATING</Typography>
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
        return (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 16,
                color: "#1f4f82",
              }}
            >
              Tap Below
            </Typography>

            <SouthIcon
              sx={{
                mt: 1,
                fontSize: 30,
                color: "#1f4f82",
                animation: "bounce 1.2s infinite",
              }}
            />
          </Box>
        );
    }
  };

  const getScreenBackground = () => {
    switch (screenState) {
      case "VALIDATING":
        return "#e3f2fd"; // blue

      case "SUCCESS":
      case "OPEN":
        return "#e8f5e9"; // green

      case "ERROR":
        return "#ffebee"; // red

      case "IDLE":
        return "#eaf4ff"; // light blue default

      default:
        return "#ffffff";
    }
  };

  const getScreenColor = () => {
    if (screenState === "SUCCESS" || screenState === "OPEN") return "#2e7d32";
    if (screenState === "ERROR") return "#d32f2f";
    return "#1f4f82";
  };

  const MetroCardIcon = ({ size = 26, color = "#fff" }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Card */}
      <rect
        x="2"
        y="6"
        width="20"
        height="12"
        rx="2"
        stroke={color}
        strokeWidth="2"
      />

      {/* Card Stripe */}
      <rect x="2" y="9" width="20" height="3" fill={color} opacity="0.25" />

      {/* Contactless Waves */}
      <path
        d="M15 12c1.5-1.5 1.5-3.5 0-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M17 12c2.5-2.5 2.5-6 0-8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );

  return (
    <>
      <div className="crumb"> </div>
      <div className="top-right">
        <div className={`pill ${connected ? "ok" : "bad"}`}>
          <span className="dot" />
          {connected ? "MQTT Connected" : "MQTT Disconnected"}
        </div>
      </div>
      <div className="page">
       <main>
  <Box
    sx={{
      maxWidth: 1400,
      mx: "auto",
      p: 4,
    }}
  >
    {/* ================= TOP ROW ================= */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
        mb: 4,
      }}
    >
      {/* ===== DEVICE AREA ===== */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          p: 5,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* DEVICE CODE HERE (keep exactly same) */}
      </Paper>

      {/* ===== FARE DETAILS ===== */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          p: 5,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* Fare Details Code (unchanged) */}
      </Paper>
    </Box>

    {/* ================= BOTTOM ROW ================= */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 4,
      }}
    >
      {/* ===== CARD UID ===== */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          p: 4,
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Typography fontWeight={700} mb={2}>
          Card UID
        </Typography>

        <select
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
          }}
        >
          {CARD_PRESETS.map((c) => (
            <option key={c.uid} value={c.uid}>
              {c.label} — {c.uid}
            </option>
          ))}
        </select>
      </Paper>

      {/* ===== TRIP HISTORY ===== */}
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          p: 4,
          background: "rgba(255,255,255,0.8)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <Typography fontWeight={700} mb={2}>
          Trip History
        </Typography>

        <Box
          sx={{
            maxHeight: 250,
            overflowY: "auto",
          }}
        >
          {history.length === 0 ? (
            <Typography fontSize={13} color="gray">
              No taps yet.
            </Typography>
          ) : (
            history.map((h, idx) => (
              <Box
                key={`${h.request_id}-${idx}`}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  background:
                    h.decision === "GO"
                      ? "rgba(46,125,50,0.08)"
                      : "rgba(211,47,47,0.08)",
                  borderLeft:
                    h.decision === "GO"
                      ? "4px solid #2e7d32"
                      : "4px solid #d32f2f",
                  fontSize: 13,
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Typography fontWeight={600}>{h.uid}</Typography>
                  <Typography fontWeight={600}>{h.decision}</Typography>
                </Box>

                <Typography mt={0.5}>
                  {h.trip_state} | ₹{h.fare} | Bal ₹
                  {h.remaining_balance}
                </Typography>

                <Typography fontSize={11} color="gray" mt={0.5}>
                  {new Date(h.ts * 1000).toLocaleTimeString()}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Paper>
    </Box>
  </Box>
</main>

      </div>
    </>
  );
}

const EnhancedRow = ({ icon, label, value, bold = false }: any) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "32px 160px 1fr",
      alignItems: "center",
      columnGap: 4,
    }}
  >
    <Box sx={{ color: "#1f4f82", display: "flex" }}>{icon}</Box>

    <Typography
      sx={{
        fontWeight: 600,
        color: "#1f4f82",
      }}
    >
      {label}
    </Typography>

    <Typography
      sx={{
        fontWeight: bold ? 700 : 500,
        color: "#1f4f82",
      }}
    >
      {value}
    </Typography>
  </Box>
);

function Row({ label, value }) {
  return (
    <div className="row">
      <div className="rowLabel">{label}:</div>
      <div className="rowValue">{value}</div>
    </div>
  );
}

const ResultRow = ({ label, value }: any) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      fontSize: 11,
      mb: 0.5,
    }}
  >
    <span style={{ opacity: 0.7 }}>{label}</span>
    <span style={{ fontWeight: 600 }}>{value}</span>
  </Box>
);

export default ListDevice;
