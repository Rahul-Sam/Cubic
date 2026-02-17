import React, { useEffect, useRef } from "react";
import { Box, Paper, Typography, Stack, Chip } from "@mui/material";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

interface ARMConsoleProps {
  connected?: boolean;
  height?: number | string;
  title?: string;
  onDataSend?: (data: string) => void;
}

const ARMConsole: React.FC<ARMConsoleProps> = ({
  connected = false,
  height = 600,
  title = "Console",
  onDataSend,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      scrollback: 10000,
      fontSize: 14,
      convertEol: false,
      theme: {
        background: "#000000",
        foreground: "#00ff00",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    term.open(containerRef.current);
    fitAddon.fit();

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    //  REAL INTERACTIVE MODE
    term.onData((data) => {
      if (onDataSend) {
        onDataSend(data); // send every keystroke
      }
    });

    // Listen for backend stream
    const listener = (e: any) => {
      term.write(e.detail);
    };

    window.addEventListener("terminal-data", listener);

    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("terminal-data", listener);
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, [onDataSend]);

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6">{title}</Typography>

        <Chip
          label={connected ? "Connected" : "Disconnected"}
          color={connected ? "success" : "error"}
          size="small"
        />
      </Stack>

      <Paper
        sx={{
          height,
          bgcolor: "#000",
        }}
      >
        <Box ref={containerRef} sx={{ height: "100%", width: "100%" }} />
      </Paper>
    </Box>
  );
};

export default ARMConsole;
