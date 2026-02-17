import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

export default function DevicesTable() {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_CORELLIUM_BASE;
  const API_KEY = import.meta.env.VITE_CORELLIUM_API_KEY;

  const [devices, setDevices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);

  // ✅ Pagination State
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const open = Boolean(anchorEl);

  React.useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${BASE_URL}/v1/instances`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();

        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          version: item.os || "—",
          state:
            item.state === "on"
              ? "On"
              : item.state === "error"
                ? "Error"
                : "Off",
          model: item.flavorName || "—",
          createdBy: item.createdBy?.username || "—",
          createdAt: item.created
            ? new Date(item.created).toLocaleDateString()
            : "—",
        }));

        setDevices(formatted);
      } catch (err: any) {
        console.error("API Error:", err);
        setError("Failed to load devices.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleOpenDevice = (row: any) => {
    navigate(`/view/${row.id}`, {
      state: { device: row },
    });
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    if (selectedRow) {
      handleOpenDevice(selectedRow);
    }
    handleMenuClose();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
          borderRadius: 1,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2,
            backgroundImage: "url(./table-bg-1.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
            AVH Instances
          </Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                    <TableCell>Name</TableCell>
                    <TableCell>State</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Created by</TableCell>
                    <TableCell>Created at</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {devices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No instances found
                      </TableCell>
                    </TableRow>
                  )}

                  {devices
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell>
                          {row.state === "Off" ? (
                            <Typography
                              sx={{
                                fontWeight: 600,
                                color: "text.secondary",
                                cursor: "not-allowed",
                              }}
                            >
                              {row.name}
                            </Typography>
                          ) : (
                            <Typography
                              onClick={() =>
                                row.state !== "Off" && handleOpenDevice(row)
                              }
                              sx={{
                                fontWeight: 600,
                                color:
                                  row.state === "Off"
                                    ? "text.secondary"
                                    : "primary.main",
                                cursor:
                                  row.state === "Off"
                                    ? "not-allowed"
                                    : "pointer",
                                "&:hover":
                                  row.state !== "Off"
                                    ? { textDecoration: "underline" }
                                    : {},
                              }}
                            >
                              {row.name}
                            </Typography>
                          )}

                          <br />
                          <Typography variant="caption" color="text.secondary">
                            v{row.version}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={row.state}
                            size="small"
                            sx={{
                              bgcolor:
                                row.state === "On"
                                  ? "#d1fae5"
                                  : row.state === "Error"
                                    ? "#fee2e2"
                                    : "#e5e7eb",
                              color:
                                row.state === "On"
                                  ? "#065f46"
                                  : row.state === "Error"
                                    ? "#991b1b"
                                    : "#374151",
                              fontWeight: 500,
                            }}
                          />
                        </TableCell>

                        <TableCell>{row.model}</TableCell>
                        <TableCell>{row.createdBy}</TableCell>
                        <TableCell>{row.createdAt}</TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, row)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={devices.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[15, 25, 50]}
            />
          </>
        )}

        {/* Dropdown */}
        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem onClick={handleView}>Open</MenuItem>
          <Divider />
        </Menu>
      </Paper>
    </Box>
  );
}
