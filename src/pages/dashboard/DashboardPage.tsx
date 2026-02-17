import {
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SearchInput from "../../components/SearchInput";
import StatusChip from "../../components/StatusChip";
import AddButton from "../../components/addButton";
import FourGridCards from "./DashboardStats";
import DevicesTable from "./DevicesTable";
import DevicesTable2 from "./DevicesTable2";

export default function DashboardPage() {
  return (
    <>
      <FourGridCards />

      <Box
        sx={{
          p: 3,
          borderRadius: 4,
        }}
      >
        <Grid container spacing={4}>
          <Grid size={4}>
            <Box sx={{ m: 0 }}>
              <Typography variant="h4" fontWeight={700}>
                Dashboard
              </Typography>
              <Typography color="text.secondary">
                Manage your virtual devices.
              </Typography>
            </Box>
          </Grid>

          <Grid size={8} sx={{ float: "right" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {/* <SearchInput /> */}
              <AddButton />
            </Box>
          </Grid>
        </Grid>

        <DevicesTable />
        {/* <DevicesTable2 /> */}
      </Box>
    </>
  );
}
