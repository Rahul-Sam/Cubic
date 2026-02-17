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
  const onDataSendRef = useRef(onDataSend);

  useEffect(() => {
    onDataSendRef.current = onDataSend;
  }, [onDataSend]);

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      scrollback: 10000,
      fontSize: 14,
      convertEol: false,
      disableStdin: false, // keep input enabled
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

    // 🔥 DO NOT let xterm render locally
    const disposable = term.onData((data) => {
      onDataSendRef.current?.(data);

      // Prevent local echo by NOT writing anything here
      // Do NOT call term.write(data)
    });

    // Backend stream writer (ONLY writer)
    const listener = (e: any) => {
      term.write(e.detail);
    };

    window.addEventListener("terminal-data", listener);

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
      } catch {}
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      disposable.dispose();
      resizeObserver.disconnect();
      window.removeEventListener("terminal-data", listener);
      term.dispose();
    };
  }, []);

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

      <Paper sx={{ height: "70vh", bgcolor: "#000", borderRadius: "0px" }} >
        <Box
          ref={containerRef}
          sx={{ height: "100%", width: "100%" }}
        />
      </Paper>
    </Box>
  );
};

export default ARMConsole;
